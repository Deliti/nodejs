// 控制并发数量，爬完整个网站
// 1.发出一条get，得到所有的链接
// 2.使用async的maplimit，控制并发
// callback的作用就是返回每个页面的数据

var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var url = require('url');

var app = express();
var startUrl = 'http://www.zhangxinxu.com/wordpress/category/js/';

app.get('/',function(req,res){
	var final = [];
	superagent.get(startUrl)
		.end(function(err,res){
			if(err){
				return console.error(err);
			}
			var eveAttr = [];
			var $ = cheerio.load(res.text);
			$('.post h3 a').each(function(){
				$this = $(this);
				var onceUrl = url.resolve(startUrl,$this.attr('href'));
				eveAttr.push(onceUrl);
			})

			var currentCount = 0;
			

			function got_html(url,callback){
				currentCount++;
				var delay = Math.round(Math.random()*2000+500);
				setTimeout(function(){
					currentCount--;
					console.log('现在有'+currentCount+'并行') 
					superagent.get(url)
						.end(function(err,res){
							if(err){
								return console.error(err);
							}
							callback(null,[url,res.text]);
						})
				},delay)
				
			}

			function callback(err,res){
				if(err){
					return console.error(err);
				}
				res.map(function(oneres){
					var onceUrl = oneres[0];
					var onceHtml = oneres[1];
					var $ = cheerio.load(onceHtml);
					var com1A = $('.comment-author cite').eq(0).text().trim();
					var com1 = $('.comment-body p').eq(0).text().trim();
					var title = $('.post h2').eq(0).text().trim();
					final.push({
						title:title,
						url:onceUrl,
						comA:com1A,
						comm:com1
					})
				})
				console.log(final);
			}

			async.mapLimit(eveAttr,3,function(url,callback){
				got_html(url,callback);
			},callback)

		})
})

app.listen(3000,function(){
	console.log('app is running');
})















