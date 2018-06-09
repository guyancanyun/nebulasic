基于幸运链的彩票DAPP
---
1. 游戏规则
   - 啊啊 
2. 前端页面  
   采用bootstrap框架实现，分别设计有投注、中奖信息、投注信息页面。
   
2. 智能合约设计
   - 数据存储  
     data = address, value，num  （地址，金额，数字）      
     - property  
     投注序号 seq  
     期数 term  
     - map    
     投注 （seq，data）  
     中奖 （term, data） 
 
   * 方法定义 f
     1. 下注：bet  
     2. 查询交易：getAllBits  
     3. 查询中奖：getWinList
     4. 查询期数：getTerm
     5. 发送交易：trancation
     6. 接受转账：accept
f