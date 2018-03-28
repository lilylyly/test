var http = require('http');  //http的模块;
var url = require('url');   //url模块;
var fs = require('fs');      //fs模块;
var querystring = require('querystring');//一个和

http.createServer(function (req,res) {   //创建服务
    res.writeHead(200, {'Content-type': 'text/html;charset=utf-8'});
    console.log('req.url:',req.url);  //打印请求的地址

    var pathname =url.parse(req.url).pathname;

    //通过parse的pathname这个方法,获得地址栏的: /xxx
    if(pathname =='/')
    {
       fs.readFile('post.html',function (err,data) {
           res.writeHead(200, {'Content-Type': 'text/html'});
           res.end(data);
       });     //读取第一个html的文件（注册页面）
    }else if(pathname =='/post'&&req.method=='POST')
    {
        console.log('解析数据');//当用户提交注册数据的时候，开始进行解析和写入
        var data ='';
        req.on('data',function (chunk) {
            data+=chunk;
            console.log(data);
        }).on('end',function () {
           var tt= querystring.parse(data); //参数字符串格式化成对象
           console.log(tt);
           fs.writeFile('hello.json',JSON.stringify(tt),'utf8',function (err) {
                 if(err)
                 {
                     return  res.end('Registration error')
                 }else {
                     return  res.end('Registration success')
                 }
           });  //将我们注册的信息写入(writeFile)到本地的一个json文件中，保存起来
        })
    }
    else if(pathname=='/login'&&req.method=='GET')   //登录页面
    {
        fs.readFile('login.html',function (err,data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });  //读取第二个html的文件（登录页面）

    }else if(pathname=='/login'&&req.method=='POST')
    {
      fs.readFile('hello.json',function (err,data) { 
          //读取本地的json文件的数据，进行对比
           data = JSON.parse(data.toString());
           console.log('读取数据',data);
           var temp ='';
           req.on('data',function (chunk){
               temp +=chunk;
           }).on('end',function () {
               var login= querystring.parse(temp);
               if(login.username ==data.username&&login.password==data.password)
               {
                   return res.end('Login Success!');
               }else{
                   return res.end('Login failed, please confirm whether the username and password are correct!');
               }
           })

      })
    }
}).listen(3000,function () {
    console.log('Server startup........');
});
