var async = require('async');

var t = require('moment');

t.log = function(msg,obj){
	// 对console.log进行了封装，主要增加了秒钟的输出，通过秒数的差值更好对asyns的理解
	pro
}

var log = t.log;

/*
	对集合中的每一个元素，执行某个异步操作，得到结果。所有的结果将汇总到callback里
	与each的区别是，each只关心操作不管最后的值，而map关心的最后的产生值

	两种方式：
		1.并行执行，同事对集合中的所有元素进行操作，结果汇总到最终到callback中
		如果出错，则立即返回错误以及已经执行完的任务的结果，未执行的占个空位
		2.顺序执行，对集合中的元素一个一个执行操作，结果汇总到最后的callback中
		如果出错，则立即返回错误以及已经执行完的任务的结果，未执行的被忽略
	map(arr,iterator(item,callback),callback(err,result))
*/ 
var arr = [{name:'jack',delay:200},{name:'Mike',delay:100},{name:'Freewind',delay:300},{name:'test',delay:50}];

// 所有的操作均执行正确，未出错，所有结果按元素顺序汇总给最终的callback

async.map(arr,function(item,callback){
	log('1.1 handle: '+item.name);
	setTimeout(function(){
		log('1.1 handle: '+item.name);
		callback(null,item.name+'!!!');
	},item.delay)
},function(err,result){
	log('1.1 err: '+err);
	log('1.1 result: '+result);
})