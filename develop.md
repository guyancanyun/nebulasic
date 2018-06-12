
Nebulas实现了NVM虚拟机来运行智能合约，NVM的实现使用了JavaScript V8引擎，只支持JavaScript、TypeScript来编写智能合约。
## 智能合约开发
1. 智能合约代码必须是一个Prototype的对象； 
2. 智能合约代码必须有一个init()的方法，这个方法只会在部署的时候被执行一次； 
3. 智能合约里面的私有方法是以_开头的方法，私有方法不能被外部直接调用； 

### 智能合约存储区  
> 星云链智能合约(smart contract)提供了链上数据存储功能。类似于传统的key-value存储系统（eg:redis），可以付费（消耗gas）将数据存储到星云链上。

> 星云链的智能合约运行环境内置了存储对象==LocalContractStorage==，可以存储数字，字符串，JavaScript对象，存储数据只能在智能合约内使用，其他合约不能读取存储的内容。

基础用法
LocalContractStorage的简单接口包括set,get,del接口，实现了存储，读取，删除数据功能。存储可以是数字，字符串，对象。

LocalContractStorage存储数据
```
// 存储数据，数据会被json序列化成字符串保存
LocalContractStorage.put(key, value);
// 或者
LocalContractStorage.set(key, value);
```
LocalContractStorage读取数据
```
// 获取数据
LocalContractStorage.get(key);
```
LocalContractStorage删除数据
```
// 删除数据, 数据删除后无法读取
LocalContractStorage.del(key);
// 或者
LocalContractStorage.delete(key);
```
高级用法
LocalContractStorage除了基本的set,get,del方法，还提供方法来绑定合约属性。对绑定过的合约属性的读写将直接在LocalContractStorage上读写，而无需调用get和set方法。

绑定属性
在绑定一个合约属性时，需要提供对象实例，属性名和序列化方法。
```
// SampleContract的`size`属性为存储属性，对`size`的读写会存储到链上，
// 此处的`descriptor`设置为null，将使用默认的JSON.stringify()和JSON.parse()
LocalContractStorage.defineProperty(this, "size", null);

// SampleContract的`value`属性为存储属性，对`value`的读写会存储到链上，
// 此处的`descriptor`自定义实现，存储时直接转为字符串，读取时获得Bignumber对象
LocalContractStorage.defineProperty(this, "value", { // 提供自定义的序列化和反序列化方法
    stringify: function (obj) { // 序列化方法
        return obj.toString();
    },
    parse: function (str) { //反序列化方法
        return new BigNumber(str);
    }
});
// SampleContract的多个属性批量设置为存储属性，对应的descriptor默认使用JSON序列化
LocalContractStorage.defineProperties(this, {
    name: null,
    count: null
});
然后，我们可以如下在合约里直接读写这些属性。

SampleContract.prototype = {
    // 合约部署时调用，部署后无法二次调用
    init: function (name, count, size, value) {
        // 在部署合约时将数据存储到链上
        this.name = name;
        this.count = count;
        this.size = size;
        this.value = value;
    },
    testStorage: function (balance) {
        // 使用value时会从存储中读取链上数据，并根据descriptor设置自动转换为Bignumber
        var amount = this.value.plus(new BigNumber(2));
        if (amount.lessThan(new BigNumber(balance))) {
            return 0
        }
    }
};

```
绑定Map属性
```
'use strict';

var SampleContract = function () {
    // 为`SampleContract`定义`userMap`的属性集合，数据可以通过`userMap`存储到链上
    LocalContractStorage.defineMapProperty(this, "userMap");

    // 为`SampleContract`定义`userBalanceMap`的属性集合，并且存储和读取序列化方法自定义
    LocalContractStorage.defineMapProperty(this, "userBalanceMap", {
        stringify: function (obj) {
            return obj.toString();
        },
        parse: function (str) {
            return new BigNumber(str);
        }
    });

    // 为`SampleContract`定义多个集合
    LocalContractStorage.defineMapProperties(this,{
        key1Map: null,
        key2Map: null
    });
};

SampleContract.prototype = {
    init: function () {
    },
    testStorage: function () {
        // 将数据存储到userMap中，并序列化到链上
        this.userMap.set("robin","1");
        // 将数据存储到userBalanceMap中，使用自定义序列化函数，保存到链上
        this.userBalanceMap.set("robin",new BigNumber(1));
    },
    testRead: function () {
        //读取存储数据
        var balance = this.userBalanceMap.get("robin");
        this.key1Map.set("robin", balance.toString());
        this.key2Map.set("robin", balance.toString());
    }
};

module.exports = SampleContract;
```
Map数据遍历
在智能合约中如果需要遍历map集合，可以采用如下方式：定义两个map,分别是arrayMap,dataMap，arrayMap采用严格递增的计数器作为key,dataMap采用data的key作为key,详细参见set方法。遍历实现参见forEach,先遍历arrayMap,得到dataKey,再对dataMap遍历。Tip：由于Map遍历性能开销比较大，不建议对大数据量map进行遍历，建议按照limit,offset形式进行遍历，否者可能会由于数据过多，导致调用超时。
```
"use strict";

var SampleContract = function () {
   LocalContractStorage.defineMapProperty(this, "arrayMap");
   LocalContractStorage.defineMapProperty(this, "dataMap");
   LocalContractStorage.defineProperty(this, "size");
};

SampleContract.prototype = {
    init: function () {
        this.size = 0;
    },

    set: function (key, value) {
        var index = this.size;
        this.arrayMap.set(index, key);
        this.dataMap.set(key, value);
        this.size +=1;
    },

    get: function (key) {
        return this.dataMap.get(key);
    },

    len:function(){
      return this.size;
    },

    forEach: function(limit, offset){
        limit = parseInt(limit);
        offset = parseInt(offset);
        if(offset>this.size){
           throw new Error("offset is not valid");
        }
        var number = offset+limit;
        if(number > this.size){
          number = this.size;
        }
        var result  = "";
        for(var i=offset;i<number;i++){
            var key = this.arrayMap.get(i);
            var object = this.dataMap.get(key);
            result += "index:"+i+" key:"+ key + " value:" +object+"_";
        }
        return result;
    }
};

module.exports = SampleContract;
```

### 日志打印(Console)

console 模块提供了一个简单的调试控制台，类似于网页浏览器提供的 JavaScript 控制台。console 将把所有接收到的 args 以指定级别打印到 Nebulas Logger 上。

+ console.log([…args<any>]) — — info 级别

+ console.debug([…args<any>]) — — debug 级别

+ console.warn([…args<any>]) — — warn 级别

+ console.error([…args<any>]) — — error 级别

+ console.info ([…args<any>]) — — console.log() 别名


## 部署智能合约  
可以在命令行下进行部署，本文介绍在web钱包下的部署方法，操作更简单。  

###  第一步  
 
###  第二步  

###  第三步  


执行智能合约方法
执行save方法，发布信息




注意：目的地址为合约地址

执行read方法，查看信息

https://mp.weixin.qq.com/s?__biz=MzI3NzExODg4OA==&mid=2650822384&idx=1&sn=e985d2b5bbdb88638e21959568dbdb0a&scene=21#wechat_redirect


## 一些问题
> 怎么在智能合约内部查询账户余额？  
+  官网说目前暂不支持，据说近期会支持。目前大部分合约的处理方式是自定义一个全局变量，然后每次合约金额变化时候，在合约的代码里面对于这个变量进行加减。这样做也存在一个问题，一个是合约里面对变量的做计算可能出现金额算错导致整个合约废掉，同时因为每笔转出交易都会消耗一定数量gas（虽然很少），但也会对于高精度要求的余产生影响。
+  可以从星云浏览器上查询合约地址得到合约的账号余额，这个是比较准确的。

>  一次交易的数据大小有限制吗？   
+  一次transaction的数据长度限制为128k，如果您需要在链上存储数据可以考虑将图片数据拆成多个分片，分多次transaction完成上传。另一种替代方案是您可以将图片存储在别的地方，将图片的hash校验存储在星云链上保证数据的一致性。
