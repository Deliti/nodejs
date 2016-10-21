var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var url = require('url');

var startUrl = 'http://www.zhangxinxu.com/wordpress/category/js/';
var final = [];
superagent.get(startUrl)
	.end(function(err,res){
		if(err){
			return console.error(err);
		}
		var $ = cheerio.load(res.text);
		var eveUrls = [];
		$('.post h3 a').each(function(){
			var $ele = $(this);
			var href = url.resolve(startUrl,$ele.attr('href'));
			var title = $ele.attr('title');
			eveUrls.push(href);
		})

		var ep = new eventproxy();
		ep.after('html',eveUrls.length,function(list){
			final = list.map(function(onelist){
				var oneListUrl = onelist[0];
				var oneListHtml = onelist[1];
				var $ = cheerio.load(oneListHtml);
				return({
					url:oneListUrl,
					comment1Au:$('.comment-author').eq(0).text().trim(),
					comment1:$('.comment-body').eq(0).find('p').text().trim()
				})
				
			})
			console.log(final);
		})

		eveUrls.forEach(function(oneUrl){
			superagent.get(oneUrl)
				.end(function(err,res){
					if(err){
						return console.error(err);
					}
					console.log('fetch '+oneUrl+' successful');
					ep.emit('html',[oneUrl,res.text]);
				})
		})


	})

	// 此方法：先监听事件，在处理事件，处理事件完了直接返回数值，不对其进行更多处理
	// 所有事件处理完成之后，after处理，一条一条处理不会漏不会乱

	/*************************** 下面这种有问题 ********************************/ 

	//1.在每发出一条指令后，对其有个处理，这样会导致指令没有发送完，就开始处理，很乱
	// 2.同样还会出现漏爬的现象

	// var $ = cheerio.load(res.text);
	// $('.comment-body').each(function(){
	// 	$this = $(this);
	// 	var cA = $this.find('div').find('cite').text().trim();
	// 	var ct = $this.find('p').text().trim();
	// 	ep.emit('html',[oneUrl,cA,ct]);
	// })

	// var urls = onelist[0];
	// var comAuthor = onelist[1];
	// var comment1 = onelist[2];
	// return({
	// 	url:urls,
	// 	comment1Au:comAuthor,
	// 	comment1:comment1
	// })


