"use strict";

var TeamItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.favNumer = obj.favNumer;
    } else {
        this.favNumer = 0;
    }
};

var Message = function(text){
    if (text) {
        var obj = JSON.parse(text);
        this.content = obj.content;
        this.date = obj.date;
        this.term = obj.term;
        this.from = obj.from;
    } else {
        this.content = '';
        this.date = '';
        this.term = '';
        this.from = '';
    }
}

TeamItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};

Message.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};

var NBAContract = function() {
    LocalContractStorage.defineMapProperty(this, 'teamDB', {
        parse: function(str) {
            return new TeamItem(str);
        },
        stringify: function(o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineMapProperty(this, 'termMessageMap');
    LocalContractStorage.defineMapProperty(this, 'personMap');
    LocalContractStorage.defineMapProperty(this, 'messageMap');
    LocalContractStorage.defineProperty(this, 'seq');
};

NBAContract.prototype = {
    init: function() {
        seq = 0;
    },
    vote: function(teamId) {
        teamId = teamId.trim();
  /*       if (!teamId || parseInt(teamId) < 0 || parseInt(teamId) > 29) {
            throw new Error('请输入正确的 teamId！');
        } */
    //    var from = Blockchain.transaction.from;
        var teamItem = this.teamDB.get(teamId);
        if (!teamItem) {
            teamItem = new TeamItem(null)
        }
        teamItem.favNumer = teamItem.favNumer + 1;
        this.teamDB.put(teamId, teamItem);
    },

    getVotesOfTeam: function(teamId) {
        teamId = teamId.trim();
        var teamItem = this.teamDB.get(teamId);
        if (!teamItem) {
            teamItem = new TeamItem(null)
        }
        return teamItem ? teamItem.toString() : '';
    },

    getVotesOfTeamList: function() {
        var teamList = [];
        for (var index = 0; index < 32; index++) {
            var teamId = index + '';
            var teamItem = this.teamDB.get(teamId);
            if (!teamItem) {
                teamItem = new TeamItem(null)
            }
            teamList.push(teamItem.favNumer);
        }
        return teamList ? JSON.stringify(teamList) : '';
    },

    comment: function(content, team){
        var message = new Message(null);
        var from = Blockchain.transaction.from;
        message.from = from;
        message.team = team;
        message.content = content;
        message.date = new Date().getTime();
        this.seq = this.seq + 1;
        var teamMsgList = this.termMessageMap.get(team)
        teamMsgList.push(seq);
        this.termMessageMap.put(team, teamMsgList);
        this.messageMap.put(seq, message);
        var personMsgList = this.person.get(from);
        personMsgList.push(seq);
        this.person.put(from, personMsgList)
    },

    getcommentsOfTeam: function(team){
        var msgList = [];
        var list = this.termMessageMap.get(team);
        for(index in list){
            var msg = this.messageMap.get(index);
            msgList.push(msg);
        }
        return  msgList ? JSON.stringify(msgList) : '';
    },

    getCommontsOfVoter: function(){
        var msgList = [];
        var from = Blockchain.transaction.from;
        var list = this.personMap.get(from);
        for(index in list){
            var msg = this.messageMap.get(index);
            msgList.push(msg);
        }
        return  msgList ? JSON.stringify(msgList) : '';
    },

    getcomments: function(offect, limit){

    }

}

module.exports = NBAContract;
