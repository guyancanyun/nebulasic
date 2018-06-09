'use strict';

var DictItem = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.address = obj.address;
		this.value = new BigNumber(obj.value);
		this.num = obj.num;
		this.date = getNowFormatDate();
	}
	else {
		this.address = "";
		this.value = new BigNumber(0);
		this.num = "";
		this.date = getNowFormatDate();
	}
}

DictItem.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var LottryContract = function () {
	LocalContractStorage.defineProperty(this, "owner");
	LocalContractStorage.defineProperty(this, "minAmt");
	LocalContractStorage.defineProperty(this, "size");
    LocalContractStorage.defineProperty(this, 'count');
	LocalContractStorage.defineProperty(this, 'term');
	LocalContractStorage.defineProperty(this, 'balance');
    LocalContractStorage.defineMapProperty(this, "betMap", {
        parse: function(text) {
            return new DictItem(text);
        },
        stringify: function(o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineMapProperty(this, "winMap", {
        parse: function(text) {
            return new DictItem(text);
        },
        stringify: function(o) {
            return o.toString();
        }
    });
};

LottryContract.prototype = {
	init: function(){
		this.count = 0;
		this.term = 1;
		this.balance = new BigNumber(0);
		this.size = 2;
		this.owner = Blockchain.transaction.from;
		this.minAmt = 0.001;
	},

	//投注
	bet: function(num){
		var from = Blockchain.transaction.from;
		var value = Blockchain.transaction.value;
        if (value < this.minAmt * 1000000000000000000) {
            throw new Error('竞猜金额少于0.001nas');
		}
		if (num < 1 || num > 3) {
            throw new Error("竞猜数字大于10或小于1");
        }
        // if (value * 50 > this.balance * 0.9) {
        //     throw new Error('合约余额不足，请调低竞猜金额！');
        // }
		var item = new DictItem(null);
		item.address = from;
		item.value = value;
		item.num = num;
		this.count += 1;
		this.betMap.put(this.count, item);
		this.balance = new BigNumber(value).plus(this.balance);
		//开奖
		if (this.count%this.size == 0){
			this._openPrice()
		}
	},

	//获取投注信息
	getBets: function(term){
		var term = parseInt(term);
		var result  = [];
		if(term > this.term){
			return result;
		}
        for(var i=(term-1)*this.size+1; i<=this.count; i++){
			var item = this.betMap.get(i);
			//var value = item.value;
			item.value = new BigNumber(item.value) / 1000000000000000000;
            result.push(item);
        }
        return result;
	},

	//获取中奖信息
	getWinsByTerm: function(term){
		term = parseInt(term)
		if(term > this.term){
			return null;
		}
		var result = this.winMap.get(term);
		if(result){
			result.value = new BigNumber(result.value) / 1000000000000000000;
		}
        return result;
	},
	
	//获取最新期数
	getLatestTerm: function(){
		return this.term;
	},

	_transfer: function(address, value) {
		//只转96%奖金
		var result = Blockchain.transfer(address, value*0.99);
		if (result) {
			var balance = new BigNumber(this.balance);
			balance = balance.sub(value);
			this.balance = balance;
		}
		else {
			throw new Error("transfer failed.");
		}
		return result;
	},

	//获取奖池余额
	getBalance: function() {
		return this.balance / 1000000000000000000;
	},	
	
	getCount: function() {
        return this.count;
	},
	
	getAdmin: function() {
       return this.owner;
	},
	//开奖
	_openPrice: function(){
		//随机中奖号码
		var ramdomNum = Math.floor(Math.random()*2+1)
		var win = this.winMap.get(this.term);
        if (!win) {
            win = new DictItem(null);
		}
		win.num = ramdomNum;
		var winNum = 0;
		for(var i=(this.term-1)*this.size+1; i<=this.count; i++){
			var bet = this.betMap.get(i);
			var from = bet.address; 
			var gressNum = parseInt(bet.num);
			if (gressNum == ramdomNum){
				var addrs = win.address;
				if (addrs) {
					addrs += "," + from;
				} else {
					addrs = from;
				}
				win.address = addrs;
				winNum += 1;
			}
		}
		var sendAddress = win.address.split(",");
		//每次开奖收取3%手续费
		console.log("transfer 5% fee");
		this._transfer(this.owner, this.balance*0.05);
		var reward = this.balance / winNum;
		win.value = reward;
		this.winMap.put(this.term, win);
		this.term += 1;
		for (var j = 0; j < winNum; j++) {
			var result = this._transfer(sendAddress[j], win.value);
		}
	},	

	getOutAmt: function(amt) {
        if (Blockchain.transaction.from === this.owner) {
            Blockchain.transfer(this.owner, owner);
            Event.Trigger('transfer', {
                to: this.owner,
                value: owner
            });
        } else {
            throw new Error("Admin only");
        }
    },
};

function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + date.getSeconds();
	return currentdate;
};

module.exports = LottryContract;