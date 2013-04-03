/* outa[bot] // app.js
   Copyright (c) 2012-2013 outa[dev].
*/

(function() {
	//the twitter api module
	var twitter = require('ntwitter'),
		LogUtils = require('./lib/LogUtils.js'),

		//the username of the bot. not set to begin with, we'll get it when authenticating
		botUsername = null,

		//create an object using the keys we just determined
		twitterAPI = new twitter({
			consumer_key:        'JNUuAnHQAiIzrdZXFQ1jlQ',
			consumer_secret:     'DB3RuaKgZryn2Zw5BPSuWRusZGiWzN38LAzjPB7g',
			access_token_key:    '1320886308-G1kfBNRmHltQDVqDvEOYH1agzCaEhyl5UOWB82c',
			access_token_secret: 'sEwFQl4Sz2ptEIpASBr36SXINUYON81fgk4yb4AqIo0'
		});
	
	//check if we have the rights to do anything
	twitterAPI.verifyCredentials(function(error, userdata) {
		if (error) {
			//if we don't, we'd better stop here anyway
			LogUtils.logtrace(error, LogUtils.Colors.RED);
		} else {
			//the credentials check returns the username, so we can store it here
			botUsername = userdata.screen_name;
			LogUtils.logtrace("logged in as " + userdata.screen_name, LogUtils.Colors.BLUE);

			//start listening to tweets that contain the bot's username using the streaming api
			twitterAPI.stream('user', { with:'followings', track:'@' + botUsername },
				function(stream) {
					LogUtils.logtrace("streaming", LogUtils.Colors.BLUE);

					//when we're receiving something
					stream.on('data', function(data) {
						if(data.text !== undefined 														//if it's actually there
							&& data.user.screen_name.toLowerCase() != botUsername.toLowerCase() 		//if it wasn't sent by the bot itself
							&& data.text.toLowerCase().indexOf('@' + botUsername.toLowerCase()) != -1 	//if it's really mentionning us (it should)
							&& data.retweeted_status === undefined) {									//and if it isn't a retweet of one of our tweets

							LogUtils.logtrace("@mention from " + data.user.screen_name, LogUtils.Colors.GREEN);
							
							//getting a random tweet using the "yes.thatcan.be/my/next/tweet/" method							
							//we pass it the username of the real person, a reference to the twitter api module, and a callback
							require("./lib/MyNextTweet.js").getNewTweet(data, twitterAPI, 
								function(error, newTweetData) {
									if (error) {
										//handling the error, again
										LogUtils.logtrace(error, LogUtils.Colors.RED);
									} else {
										LogUtils.logtrace("#got random tweet for " + newTweetData.username, LogUtils.Colors.GREEN);
										//store the final tweet (containing the mention)
										var tweetDone = '@' + newTweetData.username + " " + newTweetData.tweet;
										
										//reply to the tweet that mentionned us
										twitterAPI.updateStatus(tweetDone.substring(0, 139), { in_reply_to_status_id: newTweetData.reply_id },
											function(error, statusData) {
												if (error) {
													LogUtils.logtrace(error, LogUtils.Colors.RED);
												} else {
													LogUtils.logtrace("->replied to " + statusData.in_reply_to_screen_name, LogUtils.Colors.GREEN);
												}
											}
										);
									}
								}
							);
						}
					});

					stream.on('end', function(e) {
						//if it stops, log it
						LogUtils.logtrace("STREAM STOPPED. (" + e + ")", LogUtils.Colors.RED);
					});
					
					stream.on('error', function (e, code) {
						//if it encounters an error... well, fuck.
						LogUtils.logtrace("STREAM ERROR. (" + e + " " + code + ")", LogUtils.Colors.RED);
					});
				}
			);
		}
	});

})();