"use strict";
// 合约地址(测试网络)
var dappAddress = "n1kqSg9sM1GnH1mbjN15ZeihEND2fcUWv35";
// 直接访问星云链的api
var nebulas = require("nebulas"),
    Account = nebulas.Account,
    neb = new nebulas.Neb();
// 设置使用的网络(测试网络)
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
// NebPay SDK 为不同平台的交易提供了统一的支付接口
// 开发者在Dapp页面中使用NebPay API可以通过浏览器插件钱包、手机app钱包等实现交易支付和合约调用。
var NebPay = require("nebpay");
var nebPay = new NebPay();

// 执行合约返回的交易流水号，用于查询交易信息
var serialNumber;
// 定时器
var intervalQuery;

var from = Account.NewAccount().getAddressString();
var value = "0";
var nonce = "0";
var gas_price = "1000000";
var gas_limit = "2000000";

//投注
$("#bit").click(function () {
    console.log($("#optionsRadios1").val());
    var value = "0.001";
    var callFunction = "bet" //调用的函数名称
    var callArgs = "[" + $("input[name='optionsRadios']:checked").val() + "]"  //参数格式为参数数组的JSON字符串, 比如'["arg"]','["arg1","arg2]'       
    var options = {
        //callback 是交易查询服务器地址,
        //callback: NebPay.config.mainnetUrl //在主网查询(默认值)
        //callback: NebPay.config.testnetUrl //在测试网查询
        // listener: cbPush()
    };
    // 执行合约中的save方法
    serialNumber = nebPay.call(dappAddress, value, callFunction, callArgs, options);
    //设置定时查询交易结果
    intervalQuery = setInterval(function () {
        queryResultInfo();
    }, 10000); //建议查询频率10-15s,因为星云链出块时间为15s,并且查询服务器限制每分钟最多查询10次。

});
// function cbPush(){
// 	console.log("submit a trancatin");
// }

// 根据交易流水号查询执行结果数据
function queryResultInfo() {
    nebPay.queryPayInfo(serialNumber)
        .then(function (resp) {
            console.log("tx result: " + resp)
            //$("#result").val(resp);
            var respObject = JSON.parse(resp)
            if (respObject.data.status === 1) {
                layer.msg("恭喜您的下注交易 " + serialNumber + " 已成功，请关注开奖结果!",{icon: 1});
                console.log("bet success");
                clearInterval(intervalQuery);
            }
            if (respObject.data.status === 0) {
                layer.msg("很抱歉您的下注交易 " + serialNumber + " 未成功，是稍后再尝试!",{icon: 2});
                console.log("bet failed");
                clearInterval(intervalQuery);
            }
        })
        .catch(function (err) {
            console.log(err);
        })
}

function getLatestTerm() {
    // var from = Account.NewAccount().getAddressString();
    // var value = "0";
    // var nonce = "0";
    // var gas_price = "1000000";
    // var gas_limit = "2000000";
    var callFunction = "getLatestTerm";
    var callArgs = "[]";
    var contract = {
        "function": callFunction,
        "args": callArgs
    };
    neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        //searchRes(resp)
        console.log("latest term is：" + resp.result);
        layer.msg("第 " + resp.result + " 期正在投注中...");
    }).catch(function (err) {
        //cbSearch(err)
        console.log("error:" + err.message)
    });
}

function getLatestBets() {
    // var from = Account.NewAccount().getAddressString();
    // var value = "0";
    // var nonce = "0"
    // var gas_price = "1000000"
    // var gas_limit = "2000000"
    var callFunction = "getLatestBets";
    var callArgs = "[]";
    var contract = {
        "function": callFunction,
        "args": callArgs
    }
    neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        //searchRes(resp)
        //console.log("bet list is："+resp.result)
        cbSearch(resp);
    }).catch(function (err) {
        //cbSearch(err)
        console.log("error:" + err.message)
    })
}

function getBalance() {
    // var from = Account.NewAccount().getAddressString();
    // var value = "0";
    // var nonce = "0"
    // var gas_price = "1000000"
    // var gas_limit = "2000000"
    var callFunction = "getBalance";
    var callArgs = "[]";
    var contract = {
        "function": callFunction,
        "args": callArgs
    }
    neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        console.log("balance is：" + resp.result);
        Vue.set(app, 'balance', resp.result);
    }).catch(function (err) {
        console.log("error:" + err.message)
    })
}

function getLatestWins() {
    // var from = Account.NewAccount().getAddressString();
    // var value = "0";
    // var nonce = "0"
    // var gas_price = "1000000"
    // var gas_limit = "2000000"
    var callFunction = "getLatestWins";
    var callArgs = "[]";
    var contract = {
        "function": callFunction,
        "args": callArgs
    }
    neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        //searchRes(resp)
        //console.log("bet list is："+resp.result)
        // cbSearch(resp);
        //console.log("get win detail is："+resp.result)
        if (!resp.result) {
            return;
        }
        var obj = resp.result;    ////resp is an object, resp.result is a JSON string
        obj = eval(JSON.parse(obj));
        var term = obj.term;
        var info = obj.win;
        console.log("return lastest wins: " + JSON.stringify(info))
        // if (!info) {
        // 	//layer.msg('没有查询到中奖信息！');
        // }
        console.log("win term is: " + term);
        if (info != null) {
            Vue.set(winx, 'info', info);
        }
        Vue.set(winx, 'term', term);

    }).catch(function (err) {
        //cbSearch(err)
        console.log("error:" + err.message)
    })
}

function cbSearch(resp) {
    var obj = resp.result;    ////resp is an object, resp.result is a JSON string
    obj = eval(JSON.parse(obj));
    var term = obj.term;
    var list = obj.list;
    console.log("return lastest bes: " + JSON.stringify(obj))
    if (list == []) {
        layer.msg('没有查询中奖信息');
    }
    //if result is not null, then it should be "return value" or "error message"
    // try {
    // 	var obj = eval(JSON.parse(list))
    // } catch (err) {
    // 	layer.msg('解析返回内容失败！');
    // }
    // var result = [];
    // result.push(obj);

    Vue.set(app, 'list', list);
    Vue.set(app, 'term', term);
}

//投注清单
var app = new Vue({
    el: '#bet-list',
    data: {
        list: [],
        term: null,
        balance: 0
    },
    methods: {
        getContent: function (text) {
            return text;
        },
        getZh: function (text) {
            var source = transferValToDst(text);
            return source["name"];
        },
        getBalance: function () {
            // var num = new Number(this.balance);
            // return num.toFixed(4);
            return Math.round(this.balance * 1000000) / 1000000;
        }
        // getBalance:function(){
        // 	var val = new Number(13.2334);
        // 	return val.tofix(4);
        // }
    }
});

//中奖名单
var winx = new Vue({
    el: '#win',
    data: {
        info: {},
        term: null,
        balance: 0
    },
    methods: {
        getReward: function (text) {
            if (text == null) {
                return 0;
            } else {
                return Math.round(text * 1000000) / 1000000;
            }
        },
        getAddrs: function (text) {
            if (!text) {
                return [];
            }
            return text.split(",");
        },
        getImg: function (text) {
            if (!text) {
                return null;
            }
            var source = transferValToDst(text);
            var url = source["url"];
            url = '<img src="' + url + '" class="img-rounded">';
            //console.log(url);
            return url;
        },
        getZh: function (text) {
            if (!text) {
                return null;
            }
            var source = transferValToDst(text);
            return source["name"];
        }
    }
});

var valMapping = {
    "1": { "name": "鼠", "url": "images/shu.png" },
    "2": { "name": "牛", "url": "images/niu.png" },
    "3": { "name": "虎", "url": "images/hu.png" },
    "4": { "name": "兔", "url": "images/tu.png" },
    "5": { "name": "龙", "url": "images/long.png" },
    "6": { "name": "蛇", "url": "images/she.png" },
    "7": { "name": "马", "url": "images/ma.png" },
    "8": { "name": "羊", "url": "images/yang.png" },
    "9": { "name": "猴", "url": "images/hou.png" },
    "10": { "name": "鸡", "url": "images/ji.png" },
    "11": { "name": "狗", "url": "images/gou.png" },
    "12": { "name": "猪", "url": "images/zhu.png" }
}

function transferValToDst(val) {
    var obj = valMapping[val];
    return obj;
}

$(document).ready(function (e) {
    var lis = $('.nav > li');
    menu_focus(lis[0], 1);

    $(".fancybox").fancybox({
        padding: 10,
        helpers: {
            overlay: {
                locked: false
            }
        }
    });

});

$(".itemSelect").change(  
    function() {  
    var id = $("input[name='optionsRadios']:checked").val(); 
    console.log("radio value change to:"+id);
    var resource = transferValToDst(id);
    layer.msg("您选择了 " + resource["name"],{icon: 3});
    }  
);  

getLatestTerm();
getLatestBets();
getLatestWins();
getBalance();

//定时器刷新数据
setInterval(function () {
    //getLatestTerm();
    getLatestBets();
    getLatestWins();
    getBalance();
    console.log("refresh data per 20s");
}, 20000);