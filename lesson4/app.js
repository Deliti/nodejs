var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');

var url = require('url');
var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
	.end(function(err,res){
		if(err){
			return console.error(err);
		}
		var $ = cheerio.load(res.text);
		var topicUrls = [];
		$('#topic_list .topic_title').each(function(idx,ele){
			var $this = $(this);
			var href = url.resolve(cnodeUrl,$this.attr('href'));
			topicUrls.push(href);
		})

		var ep = new eventproxy();
		ep.after('topic_html',topicUrls.length,function(list){
			list = list.map(function(evelist){
				var topicUrl = evelist[0];
				var topicHtml = evelist[1];
				var $ = cheerio.load(topicHtml);
				return({
					title:$('.topic_full_title').text().trim(),
					href:topicUrl,
					comment1:$('.reply_content').eq(0).text().trim()
				})
			})
			// console.log('final:')
			// console.log(list);
		})

		topicUrls.forEach(function(topicUrl){
			superagent.get(topicUrl)
				.end(function(err,res){
					console.log('fetch '+topicUrl+' successful')
					ep.emit('topic_html',[topicUrl,res.text]);
				})
		})

	})














