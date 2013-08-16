/* My Next Tweet. Copyright (C) 2011 Monokai.
	NodeJS port (C) 2012-2013 outa[dev].
*/
 
(function() {	
	var maxTweetLength = 106, // Max tweet length
		z = maxTweetLength * 2 / 3,
		l,
		t = {},
		x = {},
		cacheTimestamp = [],
		k, // Array with words from tweets
		q,
		r;
		
	module.exports = {
		removeSpecialChars: function(string) {
			return (string.replace(/[\u201c\u201d\u2039\u203a\u00ab\u00bb\[\]\(\)]/, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));
		},
		
		getRandomTweet: function(tweets, data, callback) {
			var tweet,
				randomWord = k[Math.floor(Math.random() * k.length)], // b = random tweet if k is an array with words
				endingPonctuationRegex = /[\.\!\?]/gm;
			
			if (randomWord != undefined) {
				for (tweet = randomWord + " ";;) {
					randomWord: {
						randomWord = tweets[randomWord];

						var c = Math.random(),
							g = 0,
							e = void 0;

						for (e in randomWord) {
							g += Number(randomWord[e]);
							if (c <= g) {
								randomWord = e;
								break randomWord;
							}
						}

						randomWord = tweets[Math.floor(Math.random() * tweets.length)];
					}

					if (!randomWord || tweet.length + randomWord.length >= maxTweetLength) { // If we exceed the tweet size, or haven't any word to add, STAHP
						break;
					}

					tweet += randomWord + " ";
				}

				tweet = tweet.substr(0, 1).toUpperCase() + tweet.substr(1);
				
				for (c = 0; g = endingPonctuationRegex.exec(tweet);) c = g.index;
 
				if (c >= z) {
					tweet = tweet.substr(0, c + 1);
				}

				else if (!tweet.charAt(tweet.length - 1).match(endingPonctuationRegex)) { // If last char isn't either "." or "!" or "?"
					if (tweet.length == maxTweetLength) { // If there isn't space to add ponctuation, then trim the tweet to the last space.
						tweet = tweet.substr(0,tweet.lastIndexOf(" "));
					}

					if (tweet.charAt(tweet.length - 1).match(/[,:; \t]/)) { // If last char is either ";" or "," or ":" or " " or "	", then remove it
						tweet = tweet.substr(0, tweet.length - 1);
					}
 
					tweet += [".", " ?", " !"][Math.floor(Math.random() * 3)]; // Add random ponctuation.
				}
			}

			callback(null, data, tweet);
		},
 
		getNewTweet: function (data, twitterObj, callback) {
			if (t[data.user.screen_name] && cacheTimestamp[data.user.screen_name] != null && (new Date()).getTime() - cacheTimestamp[data.user.screen_name] < 18000000) { //if cache is more than 5 hours old, don't use it
				var tweets = t[data.user.screen_name];
				k = x[data.user.screen_name];
				this.getRandomTweet(tweets, data, callback);
			} else {
				k = [];
				
				twitterObj.get('/statuses/user_timeline.json', {screen_name: encodeURIComponent(data.user.screen_name), count: 80}, function(error, tweets) {
					if(error) {
						callback("error getting " + data.user.screen_name + "'s timeline: " + error, null);
					} else {
						cacheTimestamp[data.user.screen_name] = (new Date()).getTime();
						module.exports.onTwitterStatusesLoaded(tweets, data, callback);
					}
				});
 
			}
		},
		
		onTwitterStatusesLoaded: function (tweets, data, callback) {
			if(tweets && tweets.length != 0) {
				var b, c = {}, g = 0;

				for (g = 0; g < tweets.length; g++) {
					var e = tweets[g].text.split(/ /),
						h = [], f = 0;
					
					for (f = 0; f < e.length; f++) {
						var d = e[f];
						d != undefined && !d.match(/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u2018\u2019]))/i) && !d.match(/^@.+/) && !d.match(/^#.+/) && !d.match(/^rt$/i) && !d.match(/^\/?via$/i) && !d.match(/^\/?cc$/i) && h.push(this.removeSpecialChars(d));
					}
					
					h.length > 0 && k.push(h[0]);
					e = h;

					for (h = 0; h < e.length; h++) {
						f = e[h];
						c[f] || (c[f] = {});
						if (f && b) if (isNaN(c[b][f])) c[b][f] = 1;
						else c[b][f]++;
						b = f;
					}
				}
				
				tweets = {};
				var j, m;
				
				for (j in c) {
					tweets[j] = {};
					b = 0;
					for (m in c[j]) b += c[j][m];
					for (m in c[j]) tweets[j][m] = c[j][m] / b
				}
				
				x[data.user.screen_name] = k;
				t[data.user.screen_name] = tweets;
				
				this.getRandomTweet(tweets, data, callback);
			}
		}
	}
})();