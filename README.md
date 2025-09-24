###一、Webhostmost在Node.js环境搭建vless-ws-tls脚本###
目前新注册的Webhostmost账号的开发者工具（Development Tools）有Terminal，说明可以进入SSH，然后输入以下一键脚本，这样就不用上传文件了

UUID：你的uuid

PORT：服务器可使用的端口，建议留空随机生成

DOMAIN：已解析在CF的域名

```
wget -N https://raw.githubusercontent.com/avotccom/sb-nodejs/main/otc.sh && UUID=你的uuid PORT=服务器可使用的端口 DOMAIN=已解析在CF的域名 bash otc.sh
```
###建议使用外部节点保活方式，可使用workers_keep文件进行保活###

``节点保活及节点信息地址：https://你已解析在CF的域名/你的uuid``
