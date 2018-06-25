# 世界杯球迷互动DAPP
地址：https://guyancanyun.github.io/nebulasic/project/worldcup/index.html

## 介绍  
基于星云链开发的世界杯应用。球迷们可以为所支持的球队投票，应用将对球队的票数进行统计排行，另外还可以点击世界地图可以进行留言互动。

## 前端页面  
主要采用`bootstrap + jquery + vue + layer.js`框架实现。  
设计有世界地图，球队排行榜，精彩图片等页面。  
实现了**互动留言**、**球队投票**以及**排行榜**等功能。


## 智能合约设计
合约主要设计分为2块逻辑，一是**投票**，二是**留言**。投票的数据用Map方式存储，每一只球队team作为key，value为得票数，每次投票只需对于value进行累加即可。  
留言同样采用的是Map方式存储，key为球队而value则为List，List中的对象为Message，球队的留言构造成Message对象后加入到List中，然后放进Map存储。  
`球队排行榜查询需遍历teamVoteMap中的球队，得到得票数后，使用一个sort排序算法从高到低排行后返回一个数组。`   
`球队留言则根据team取取留言数组List，然后按时间由近到远的顺序重新排序后返回。`
 
### 方法设计
- vote(team) 给某只球队投票
- getVotesOfTeam(team) 查询某只球队的得票
- getVotesOfTeamList() 查询所有球队的得票
- comment(content, team) 给某只球队留言
- getcommentsOfTeam(team) 查询某支球队留言列表
- getcommentsOfTeamByCdt(teamId, offect, limit) 带条件查询球队留言列表

### 存储设计
> Message 基础单元
- content 评论内容
- date 时间
- from 地址

> Property 属性
- count 票数总计(Int)
- team 球队（List）

> Map 字典
- teamMsgMap 球队留言(team, List<Message>)
- teamVoteMap 球队投票（team, Int）

