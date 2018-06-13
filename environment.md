
### 调整dpos节点数量  
自建私链一般节点数量少于21个，如果按照默认的配置的话15s*21=3分钟才会轮到当前节点再次出块，因此一笔交易最少也要等待5分钟才能够确认，显然这速度太慢了。如果有需要加快确认速度也是可以的，方法就是修改节点数量。

首先，修改`conf/default/genesis.con`的王朝，把21个地址删掉20个，只留下1个。  
![genesis](resource/build_4.png)  
其次，修改`conf/default/config.conf`的几个地方把旷工地址改了。  
![config](resource/build_3.png)  
再次，修改`conf/example/miner.conf`把旷工地址写成自己的地址，如果是自己新建的账号那么passphrase密码一定要填正确，系统账号默认的密码是*passphrase* 。  
![miner](resource/build_6.png)   
最后，还要修改下代码`consensus/dpos/dpos_state.go`，把节点数量改成1。  
![miner](resource/build_5.png)   
**需要注意的是，如果你已经编译且运行过代码，此时你还需要做两件事情**  
+ 执行```rm -rf *.db```清除区块信息
+ 执行```make build``` 重新编译代码




## 钱包插件
星云链的web钱包、chrome钱包插件(WebExtensionWallet)使用起来都挺方便的，但是原生的钱包仅支持连接以下三种网络。
+ MainNet 主网
+ TestNet 测试网
+ LocalHost:8685 本地节点

![钱包插件](resource/wallet_2.png)

假如有些小伙伴需要使用钱包连接自己部署的私有链，那就需要改改钱包代码，增加几行配置了。

> **解决办法**

在钱包源代码找到`ui-block.js`这个文件打开，然后搜索字符串Local Nodes，在这个apiList中加入你的私有链连接信息后保存就OK啦。   
![钱包插件](resource/wallet_1.png)  
重启打开钱包后你就会发现多了一项刚才的配置了，在尝试发一笔交易，完美搞定。  
![钱包插件](resource/wallet_3.png)  

