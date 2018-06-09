'use strict';

const size = 10;

var DictItem = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.address = obj.address;
		this.value = obj.value;
		this.num = obj.num;
	}
	else {
		this.address = "";
		this.value = "";
		this.num = "";
	}
}


DictItem.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var SampleContract = function () {
    LocalContractStorage.defineProperties(this, 'count');
    LocalContractStorage.defineProperties(this, 'term');
    LocalContractStorage.defineMapProperty(this, "betMap");
    LocalContractStorage.defineMapProperty(this, "winMap");
};

SampleContract.prototype = {
	init: function(){
		this.count = 0;
		this.term = 1;
	},

	//投注
	bet: function(num){
		var from = Blockchain.transaction.from;
		var from = Blockchain.transaction.value;
		var item = new DictItem(from,value,num);
		this.count += 1;
		this.betMap.put(count, item);
		if(count/size==0){
			this._open()
		}
	},

	//获取投注信息
	getBets: function(term){
		term = parseInt(term);
		var result  = [];
		if(term > this.term){
			return result;
		}
        for(var i=(this.term-1)*size+1; i<=count; i++){
            var val = this.betMap.get(i);
            result.push(val);
        }
        return result;
	},

	//获取中奖信息
	getWins: function(term){
		term = parseInt(term)
		if(term > this.size){
			return result;
		}
		var result = this.winMap.get(term)
        return result;
	},
	
	//获取最新期数
	getTerm: function(){
		return term;
	},

	_transfer: function (address, value) {
		var result = Blockchain.transfer(address, value);
		return result;
	},

	accept:function(){
        this.save();
        Event.Trigger("transfer", {
            Transfer: {
                from: Blockchain.transaction.from,
                to: Blockchain.transaction.to,
                value: Blockchain.transaction.value,
            }
        });
    },

	//开奖
	_open: function(){
		for(var i=this.term*size; i<=this.counts; i++){
			
		}
	}

	
	
}
module.exports = SimpleContract;