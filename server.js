var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/:id', function(req, res){

	var player = req.params.id;
	var platform = "pc";
	url = 'n7hq/home/challenges/?name=' + player + '%20&platform=' + platform;

	if (!player) {
		res.send(401, "Player ID Required");
	}


	request.post({
		url:'http://social.bioware.com/language.php', 
		form: {
			return_url: url, //'/home.php',
			lang_id: 1
		}
	}, function(err, httpResponse, body){
		
		console.log(httpResponse);

		console.log("\n");

		console.log(body);

		request('http://social.bioware.com/' + url, function(error, response, html){

			console.log(error);
			console.log(response);
			console.log(html);

			res.send(200, html);
		});

	})

	return;

	request(url, function(error, response, html){
		
		if (error) {
			res.send(200, {status : "Error"} );
			return;
		}

		res.send(200, html);
		
		var $ = cheerio.load(html);

		var title, release, rating;
		var json = { title : "", release : "", rating : ""};

		$('.header').filter(function(){
		    var data = $(this);
		    title = data.children().first().text();
		    release = data.children().last().children().text();

		    json.title = title;
		    json.release = release;
	    })

	    $('.star-box-giga-star').filter(function(){
	    	var data = $(this);
	    	rating = data.text();

	    	json.rating = rating;
	    })

        // res.send(200, json)
	})
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app; 	