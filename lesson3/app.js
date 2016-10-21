var express = require('express');
var superagent = require('superagent'); //http方面的库
var cheerio = require('cheerio'); //node.js版的jquery

var app = express();
// var superagents = superagent();  这两个为什么不用实例化
// var cheerios = cheerio();

// 核心逻辑
app.get('/',function(req,res,next){
	// 用superagent去抓取 https://cnodejs.org/的内容
	superagent
		.get('https://cnodejs.org/')
		.end(function(err,sres){
			// 常规的错误处理
			if(err){
				return next(err);
			}
			// sres.text里面存储这网页html内容，将它传给cheerio.load之后
			// 就可以得到一个实现了jquery接口的变量，我们习惯性将它命名为'$'
			// 剩下的就都是jquery的内容了

			var $ = cheerio.load(sres.text);
			var items = [];
			$('#topic_list .topic_title').each(function(idx,element){
				var $element = $(this);
				items.push({
					title:$element.attr('title'),
					href:$element.attr('href')
				})
			})
			$('#topic_list .user_avatar img').each(function(idx,element){
				var $this = $(this);
				items[idx].author = $this.attr('title');
			})
			res.send(items);
		})
})

app.listen(3000,function(){
	console.log('app is start');
})