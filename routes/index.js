var myUtil = require('../myUtil.js');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var url = require('url');
exports.index = function(req,res){
    var targetUrl="http://bettips7x24.com/zh/";
    console.log(targetUrl);
    myUtil.get(targetUrl,function(content,status){
        console.log("status:="+status);
        var $ = cheerio.load(content);
        var odds = [];
		var betUrls = [];
		var subUrl ='';


       $('#mainPanel .mainTable tr:nth-child(3)').each(function(idx,element){
         var odd={};
          var $element = $(element);
         var betUrl = $element.parents().eq(0).find('a').attr('href');
		  
         odd.id = ""+(idx+1);
		  odd.title = $element.parents().eq(0).find('span').text();
//		   odd.bet_url = url.resolve(targetUrl,betUrl);
		   odd.bet_url =betUrl;
         odd.match_date=$element.children().first().text();
          odd.win_rate = $element.children().eq(1).text();
         odd.draw_rate= $element.children().eq(2).text();
         odd.lose_rate= $element.children().eq(3).text();
        // items.push({
          //         title:$element.attr('title'),
          //         href:$element.attr('href')
          //         }
          // );
          // var href = url.resolve(targetUrl,$element.attr('href'))
		subUrl = betUrl.substring(7,15);

           odds.push(odd);
          });
		   	for(var i=62100;i<=parseInt(subUrl);i++){
			if(i<66050&&i>=65950){				
			  betUrls.push({
			   url:url.resolve(targetUrl,'/zh/id/'+i),
			   year:2012	  
			  });}			  	
//			  else if(i<76785){67117
//			    betUrls.push({
//			    url:url.resolve(targetUrl,'/zh/id'+i),
//			   year:2013	  
//			  });	  
//			  }else if(i<87132){
//			    betUrls.push({
//			    url:url.resolve(targetUrl,'/zh/id'+i),
//			   year:2014	  
//			  });	  
//			  }else{
//			    betUrls.push({
//			    url:url.resolve(targetUrl,'/zh/id'+i),
//			   year:2015	  
//			  });			  
//			  }				
			}

      //  res.send(betUrls);
		
//---------------------------------------分割线-------------------------------------------------		
//		var items=[];
//		   items.push({
//                  url:"http://bettips7x24.com/zh/id/90694",
//			      year:2015
//                  }
//           );
        //得到topicUrls之后
        var ep = new eventproxy();
        //命令ep重复监听topicUrls.length次（在这里也就是40次）'topic_html'事件再行动
        ep.after('bet_html',betUrls.length,function(bets){
            //topics是个数组，包含了40次，ep.emit('topic_html',pair)中的40个pair
            //开始行动
            bets = bets.map(function(betPair){
               //接下来都是jquery的用法了
               var betUrl = betPair[0];
               var betHtml = betPair[1];
                var $ = cheerio.load(betHtml);
			   var subOdd={};
				 $('.mainTable tr:nth-child(n+2)').each(function(idx,element){
                 var $element = $(element);
			
			 if(idx==0){
			  subOdd.title = $('.headerPanel').find('span').text();
			  subOdd.bet_url=betUrl.substring(7);
              subOdd.match_date =$element.children().eq(0).text().substring(0,12);
			  subOdd.win_rate = $element.children().eq(1).text();
              subOdd.draw_rate= $element.children().eq(2).text();
              subOdd.lose_rate= $element.children().eq(3).text();
				 }
				 });
               return (subOdd);
           });
            res.send(bets);
        });
        betUrls.forEach(function(betUrl){
         myUtil.get(betUrl.url,function(content,status){
               console.log('fetch '+betUrl.url+' successful');
                ep.emit('bet_html',[betUrl.url,content]);
        
            });
        
        });

   });
};