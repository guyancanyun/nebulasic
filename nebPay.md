## nebPay

用户在使用Dapp过程中需要发送交易，但是直接在Dapp中导入钱包文件或输入私钥是极不安全的，所以Nebulas官方提供了一个支付接口NebPay。Dapp开发者可以使用NebPay作为支付通道，来处理sendTransaction的需求。Dapp用户需要安装浏览器插件（桌面端）或钱包APP（移动端）来完成Dapp页面发起的交易请求。

如果Dapp页面需要与Nebulas网络进行其他非交易类的信息交互，比如查询数据、订阅event等，则可以使用neb.js直接与Nebulas网络交互。

接口	简介
pay	用于账户间的NAS转账
nrc20pay	用于NRC20代币的转账,仅接口实现，app不支持
deploy	用于部署智能合约，仅接口实现(目前尚不支持该API)
call	用于调用智能合约
queryPayInfo	用于查询支付结果


需要注意的是，NebPay 并不关心当前使用的是主网或测试网，只是把交易信息发给浏览器插件或手机app，由后者决定将交易发送到哪个网络。callback参数也只是决定使用哪个服务器查询交易结果，并不会影响交易发送的网络。