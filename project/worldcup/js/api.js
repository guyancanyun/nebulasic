"use strict";
// 合约地址（测试网络）
//var dappAddress = "n21EBq9eB6dkwFVzsqrHn89SPia9owgTGYE";
// 合约地址（生产网络）
var dappAddress = "n1q8MwxFjmUTeU2hyL4hRQMj4oCE1M47RsP";
// 直接访问星云链的api
var nebulas = require("nebulas"),
    Account = nebulas.Account,
    neb = new nebulas.Neb();
// 设置使用的网络(测试网络)
//neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
// 生产网络
neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));
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

//查询投票结果
function getVoteResult() {
    // var from = Account.NewAccount().getAddressString();
    // var value = "0";
    // var nonce = "0"
    // var gas_price = "1000000"
    // var gas_limit = "2000000"
    var callFunction = "getVotesOfTeamList";
    var callArgs = "[]";
    var contract = {
        "function": callFunction,
        "args": callArgs
    }
    neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var obj = resp.result;    ////resp is an object, resp.result is a JSON string
        console.log("vote_list:" + obj);
        obj = eval(JSON.parse(obj));
        Vue.set(app, 'vote_list', obj);
    }).catch(function (err) {
        console.log("error:" + err.message);
    })
}

//投票
function callVoteApi(team){
    var value = "0";
    var callFunction = "vote" //调用的函数名称
    var callArgs = '[\"' + team + '\"]'  //参数格式为参数数组的JSON字符串, 比如'["arg"]','["arg1","arg2]'       
    var options = {
        //callback 是交易查询服务器地址,
        //callback: NebPay.config.mainnetUrl //在主网查询(默认值)
        //callback: NebPay.config.testnetUrl //在测试网查询
         listener: cbPush()
    };
    // 执行合约中的save方法
    serialNumber = nebPay.call(dappAddress, value, callFunction, callArgs, options);
}


//评论
function callCommentApi(team, content){
    var value = "0";
    var callFunction = "comment" //调用的函数名称
    var callArgs = '[\"' + content + "\",\"" + team + '\"]'  //参数格式为参数数组的JSON字符串, 比如'["arg"]','["arg1","arg2]'       
    var options = {
        //callback 是交易查询服务器地址,
        //callback: NebPay.config.mainnetUrl //在主网查询(默认值)
        //callback: NebPay.config.testnetUrl //在测试网查询
         listener: cbPush()
    };
    // 执行合约中的save方法
    serialNumber = nebPay.call(dappAddress, value, callFunction, callArgs, options);
}

function cbPush(){
    layer.msg("操作需要15-20s时间确认，请您耐心等待");
    //设置定时查询交易结果
    intervalQuery = setInterval(function () {
        queryResultInfo();
    }, 15000); //建议查询频率10-15s,因为星云链出块时间为15s,并且查询服务器限制每分钟最多查询10次。
}

// 根据交易流水号查询执行结果数据
function queryResultInfo() {
    nebPay.queryPayInfo(serialNumber)
        .then(function (resp) {
            console.log("tx result: " + resp)
            //$("#result").val(resp);
            var respObject = JSON.parse(resp)
             if (respObject.code != 0){
                return;
            }
            if (respObject.data.status === 1) {
                layer.msg("您的操作已经成功!",{icon: 1});
                // console.log("bet success");
                clearInterval(intervalQuery);
                getLatestBets();
            }
            if (respObject.data.status === 0) {
                layer.msg("您的操作失败了，是稍后再尝试!",{icon: 2});
                // console.log("bet failed");
                clearInterval(intervalQuery);
            }
        })
        .catch(function (err) {
            console.log(err);
        })
}

var teamMap = {
    "els":"俄罗斯",
    "dg":"德国",
    "bx":"巴西",
    "pty":"葡萄牙",
    "agt":"阿根廷",
    "bls":"比利时",
    "bl":"波兰",
    "fg":"法国",
    "xby":"西班牙",
    "ml":"秘鲁",
    "rs":"瑞士",
    "ygl":"英格兰",
    "glby":"哥伦比亚",
    "mxg":"墨西哥",
    "wlg":"乌拉圭",
    "kldy":"克罗地亚",
    "dm":"丹麦",
    "bd":"冰岛",
    "gsdlj":"哥斯达黎加",
    "rd":"瑞典",
    "tns":"突尼斯",
    "aj":"埃及",
    "snje":"塞内加尔",
    "yl":"伊朗",
    "sewy":"塞尔维亚",
    "nrly":"尼日利亚",
    "adly":"澳大利亚",
    "rb":"日本",
    "mlg":"摩洛哥",
    "bnm":"巴拿马",
    "hg":"韩国",
    "st":"沙特阿拉伯"
}

getVoteResult();

var app = new Vue({
    el: '#app',
    data: {
        vote_list:[]
    },
    methods: {
        getCountry: function (text) {
            var url = "img/" + text + ".png";
            url = '<img class="flag" alt="flag" src="' + url + '" class="img-rounded">' + teamMap[text];
            //console.log(url);
            return url;
        },
        isHighLight: function (index) {
          if (index > 4){
              return false;
          }else{
              return true;
          }
        },
        vote: function(team){
            // layer.msg(team);
            callVoteApi(team);
        },
        getProgressBar: function(percent){
            var body = '<div class="progress-bar color-1" role="progressbar" style="width: '
            + percent 
            +'%" aria-valuenow='
            +  percent
            + ' aria-valuemin="0" aria-valuemax="100"></div>';
            // console.log(body);
            return body;
        }
    }
});


//获取评论
function getCommentsOfTeam(team) {
    var callFunction = "getcommentsOfTeam";
    var callArgs = "[\""+ team +"\"]";
    var contract = {
        "function": callFunction,
        "args": callArgs
    }
    neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var obj = resp.result;    ////resp is an object, resp.result is a JSON string
        console.log("comments:" + obj);
        obj = eval(JSON.parse(obj));
        $.each(obj, function(i, value) {
            var html =
            '<div class="item" >'
            + '<div class="user">'
            +        '<div class="content">' + value.content +'</div>'
            +        '<div class="info">'
            +            '<div>'
            +                '<span class="time">时间：' + value.date + '</span>'
            +                '<span class="time">&nbsp&nbsp&nbsp地址：' + value.from + '</span>'
            +            '</div>'
            +        '</div> '                  
            +    '</div>'
            +'</div>';
            $("#comments").append(html);
        });
 
    }).catch(function (err) {
        console.log("error:" + err.message);
    })
}

//定时器刷新数据
setInterval(function () {
    //getLatestTerm();
    getVoteResult();
    console.log("refresh data per 20s");
}, 20000);

// var comment = new Vue({
//     el: '#comment',
//     data: {
//         list:[]
//     }
// });