## 基于幸运链的彩票DAPP  
访问地址：https://guyancanyun.github.io/nebulasic/project/lottery/index.html  

### 游戏规则  
    1）玩家每次下注消耗1Nas，每次下注从1-10随机获得1个数字作为自己的幸运数字，玩家进去待开奖状态   
    2）玩家参与人数达到10人即可自动开奖  
    3）不同玩家不可押同一个数字  
    4）开奖，只摇出1-10中的一个中奖数字  
    5）中奖者获得全部10nas，未中奖的不获得10nas  
    6）每个玩家限制下注一次  

### 前端页面 
   采用bootstrap框架实现，分别设计有投注、中奖信息、投注信息页面。
   
### 智能合约设计
#### 数据存储  
     data = address, value，num  （地址，金额，数字）      
     - property  
     投注序号 seq  
     期数 term  
     - map    
     投注 （seq，data）  
     中奖 （term, data） 
 
 #### 方法定义 
     1. 下注：bet  
     2. 查询交易：getAllBits  
     3. 查询中奖：getWinList
     4. 查询期数：getTerm
     5. 发送交易：trancation
     6. 接受转账：accept
