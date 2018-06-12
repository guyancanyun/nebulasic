# 基于幸运链的彩票DAPP  
app地址：https://guyancanyun.github.io/nebulasic/project/lottery/index.html  

## 游戏规则  
1）游戏玩家每次从1-12选择一个数投注，赌注金额最少0.01Nas  
2）每期投注数量达到10注随即自动开奖，开奖完后进入下一期   
3）每期开奖随机开出1-12中的任一数字，猜中数字的玩家账号均分当期累积的奖池奖金  
4）当期未中奖的奖金自动划入下一期的奖池  
5）同一个玩家投注次数不限，金额不少于0.01Nas 

## 前端页面 
采用bootstrap + jquery + vue框架实现。设计有投注、中奖信息、投注信息等页面。
   
## 智能合约设计
### 数据存储  
> data 基础数据单元   
- address  投注地址
- value 投注金额
- num  数字
- term 期数
- date 日期

> property 属性
+ count 投注数 
+ term 期数
+ size 每局数量
+ owner 管理员地址
+ balance 奖池金额
+ minAmt 最小投注金额

> map 字典

+ winMap = <count, data>  
+ betMap = <term, data>
 
 ### 方法定义 
+ bet() 下注   
+ getBets() 查询某期下注信息    
+ getLatestBets() 查询最新一期下注信息  
+ getWinsByTerm() 查询某期中奖信息  
+ getLatestWins() 查询最新一期中奖信息  
+ _transfer() 转账  
+ getBalance() 查询奖池金额  
+ _openPrice() 开奖  
...
