### BigNumber
BigNumber模块使用[bignumber.js](https://github.com/MikeMcl/bignumber.js)(v4.1.0)，用于大数运算。因为星云链的交易金额以及gas都是以wei计量，换算比例为`1nas=1e18wei`即`1nas=1000,000,000,000,000,000wei`。如果智能合约中计算金额使用常用的加减乘除方式可能会引入bug或者出现计算结果精度丢失，因此建议金额类型的变量先转成BigNumber类型后再处理。  

+ 乘法 new BigNumber(x).plus(y)  
+ 减法 new BigNumber(x).plus(y)  
+ 小于 lessThan

### Blockchain
`Blockchain`为合约提供了一个对象，该对象可以取得当前合约所在的块和Transaction信息，此外该对象提供了transfer方法用于从合约中转出nas，提供了verifyAddress用于地址校验。

Blockchain API:

```js

// current block 
Blockchain.block;

// current transaction, transaction's value/gasPrice/gasLimit auto change to BigNumber object
Blockchain.transaction;

// transfer NAS from contract to address
Blockchain.transfer(address, value);

// verify address
Blockchain.verifyAddress(address);

```

properties:

- `block`: 合约执行的当前块
    - `timestamp`: 块时间戳
    - `seed`: 随机数种子
    - `height`: 块高度
- `transaction`: 合约执行的当前Transaction
    - `hash`: 交易哈希
    - `from`: 交易发送地址
    - `to`: 交易目的地址
    - `value`: 交易金额, 一个BigNumber对象
    - `nonce`: 交易nonce
    - `timestamp`: 交易时间戳
    - `gasPrice`: gas出价, 一个BigNumber对象
    - `gasLimit`: gas上限值, 一个BigNumber对象
- `transfer(address, value)`: 该函数将来自合约中的NAS发送到目的地址
    - 参数:
        - `address`: 接收NAS的nebulas地址
        - `value`: 交易金额，一个BigNumber对象；单位为wei，所以只能是整数，用小数会失败。
    - 返回值(布尔型):
        - `true`: 交易成功
        - `false`: 交易失败   
- `verifyAddress(address)`: 该函数校验地址
    - 参数:
        - `address`: 需要校验的地址
    - 返回值(数字型):
        - `87`: 用户钱包地址
        - `88`: 合约地址
        - `0`: 地址非法

