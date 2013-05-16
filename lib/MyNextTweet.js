/* My Next Tweet. Copyright (C) 2011 Monokai.
   NodeJS port (C) 2012-2013 outa[dev].
*/
 
(function() {   
    var maxTweetLength = 106, // Max tweet length
        z = maxTweetLength * 2 / 3,
        uppercase = true, // If false the message will be upper case
        l,
        t = {},
        i, // Words from tweets, associated to other words
        x = {},
        k, // Array with words from tweets
        q,
        r;
       
    module.exports = {
        removeSpecialChars: function(string) {
            return (string.replace(/[\u201c\u201d\u2039\u203a\u00ab\u00bb\[\]\(\)]/, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
        },
       
        getRandomTweet: function() {
            var tweet;
            var randomWord = k[Math.floor(Math.random() * k.length)]; // b = random tweet if k is an array with words
            var endingPonctuationRegex = /[\.\!\?]/gm;
           
            if (randomWord != undefined) {
                for (tweet = randomWord + " ";;) {
                    randomWord: {
                        randomWord = i[uppercase ? randomWord : randomWord.toUpperCase()];
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
                        randomWord = i[Math.floor(Math.random() * i.length)];
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
                    if (tweet.charAt(tweet.length - 1).match(/[,:;]/)) { // If last char is either ";" or "," or ":", then remove it
                        tweet = tweet.substr(0, tweet.length - 1);
                    }
 
                    tweet += [".", "?", "!"][Math.floor(Math.random() * 3)]; // Add random ponctuation.
                }
            }
            this.callback(null, {
                username: this.user,
                tweet: tweet,
                reply_id: this.data.id_str
            });
        },
 
        getNewTweet: function (data, twitterObj, callback) {
            this.user = data.user.screen_name;
            this.data = data;
            this.callback = callback;
           
            if (t[this.user]) {
                i = t[this.user];
                k = x[this.user];
                this.getRandomTweet();
            } else {
                i = {};
                k = [];
               
                twitterObj.get('/statuses/user_timeline.json', {screen_name: encodeURIComponent(this.user), count: 80}, function(error, tweets) {
                    if(error) {
                        module.exports.callback("error getting " + module.exports.user + "'s timeline: " + error, null);
                    } else {
                        module.exports.onTwitterStatusesLoaded(tweets);
                    }
                });
 
            }
        },
       
        onTwitterStatusesLoaded: function (tweets) {
            if(tweets && tweets.length != 0) {
                for (var b, c = {}, g = 0; g < tweets.length; g++) {
                    var e;
                    e = tweets[g].text.split(/ /);
                   
                    for (var h = [], f = 0; f < e.length; f++) {
                        var d = e[f];
                        d != undefined && !d.match(/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u2018\u2019]))/i) && !d.match(/^@.+/) && !d.match(/^#.+/) && !d.match(/^rt$/i) && !d.match(/^\/?via$/i) && !d.match(/^\/?cc$/i) && h.push(this.removeSpecialChars(d));
                    }
                   
                    h.length > 0 && k.push(h[0]);
                    e = h;
                    for (h = 0; h < e.length; h++) {
                        f = e[h];
                        d = uppercase ? f : f.toUpperCase();
                        c[d] || (c[d] = {});
                        if (f && b) if (isNaN(c[b][f])) c[b][f] = 1;
                        else c[b][f]++;
                        b = d;
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
               
                i = tweets;
                x[this.user] = k;
                t[this.user] = i;
               
                this.getRandomTweet();
            }
        }
    }
})();