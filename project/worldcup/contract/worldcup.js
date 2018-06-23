    "use strict";

    var Message = function(text){
        if (text) {
            var obj = JSON.parse(text);
            this.content = obj.content;
            this.date = obj.date;
            // this.term = obj.term;
            this.from = obj.from;
        } else {
            this.content = '';
            this.date = '';
            // this.term = '';
            this.from = '';
        }
    }

    Message.prototype = {
        toString: function() {
            return JSON.stringify(this);
        }
    };

    var WorldCupContract = function() {
        LocalContractStorage.defineMapProperty(this, 'teamMsgMap');
        LocalContractStorage.defineMapProperty(this, 'teamVoteMap');
        LocalContractStorage.defineProperty(this, 'team');
        LocalContractStorage.defineProperty(this, 'count');
    };
    
    WorldCupContract.prototype = {
        init: function() {
            var team = ["els","dg","bx","pty","agt","bls"
            ,"bl","fg","xby","ml","rs","ygl","glby",
            "mxg","wlg","kldy","dm","bd","gsdlj",
            "rd","tns","aj","snje","yl","sewy","nrly",
            "adly","rb","mlg","bnm","hg","st"];
            this.team = team;
            for(var i=0; i<team.length; i++){
                this.teamVoteMap.put(team[i],0);
                this.teamMsgMap.put(team[i],[]);
                this.teamMsgMap.put('zg',[]);
            }
            this.count = 0;
        },
        vote: function(teamId) {
            teamId = teamId;
    /*       if (!teamId || parseInt(teamId) < 0 || parseInt(teamId) > 29) {
                throw new Error('请输入正确的 teamId！');
            } */
        //    var from = Blockchain.transaction.from;
            var favNum = this.teamVoteMap.get(teamId);
            // if (!teamItem) {
            //     teamItem = new TeamItem(null)
            // }
            favNum = favNum + 1;
            this.teamVoteMap.put(teamId, favNum);
            this.count = this.count + 1;
        },

        getVotesOfTeam: function(teamId) {
            var favNum = this.teamVoteMap.get(teamId);
            var percent = 0;
            if(this.count != 0){
                percent = favNum/this.count*100;
            }
            var result = {
                teamId: teamId,
                num: favNum,
                percent: percent
            }
            return result;
        },

        getVotesOfTeamList: function() {
            var teamList = [];
            for (var index = 0; index < this.team.length; index++) {
                var teamId = this.team[index];
                var num = this.teamVoteMap.get(teamId);
                var percent = 0;
                if(this.count != 0){
                    percent = num / this.count * 100;
                }
                var item = {
                    teamId: teamId,
                    num: num,
                    percent: percent
                }
                teamList.push(item);
                teamList.sort(function(a, b) {
                    return b.num - a.num
                });
            }
            return teamList;
        },

        comment: function(content, teamId){
            if(content.length > 60){
                throw new Error('评论字数超过60！');
            }
            var message = new Message(null);
            var from = Blockchain.transaction.from;
            message.from = from;
            // message.team = team;
            message.content = content;
            //message.date = new Date().getTime();
            message.date = getNowFormatDate();
            // this.seq = this.seq + 1;
            var teamMsgList = this.teamMsgMap.get(teamId)
            teamMsgList.push(message);
            this.teamMsgMap.put(teamId, teamMsgList);
        },

        getcommentsOfTeam: function(teamId){
            var msgList = [];
            var list = this.teamMsgMap.get(teamId);
            if(!list){
                return [];
            }
            var len = list.length;
            for(var i=len-1; i>=0; i--){
                var item = list[i];
                msgList.push(item);
            }
            return msgList;
        },

        getcommentsOfTeamByCdt: function(teamId, offect, limit){
            var msgList = [];
            var list = this.teamMsgMap.get(teamId);
            if(!list){
                return [];
            }
            var len = list.length;
            for(var i=len-offect-1; i>=len-limit && i>=0; i--){
                var item = list[i];
                msgList.push(item);
            }
            return msgList;
        }

    }

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
    

    module.exports = WorldCupContract;
