/* My Next Tweet. Copyright (C) 2011 Monokai. 
   NodeJS port (C) 2012-2013 outa[dev].
*/

(function() {    
    var s = 106,
        z = s * 2 / 3,
        w = true,
        l, t = {}, i, x = {}, k, q, r;
        
    module.exports = {
        removeSpecialChars: function(string) {
            return (string.replace(/[\u201c\u201d\u2039\u203a\u00ab\u00bb\[\]\(\)]/, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
        },
        
        getRandomTweet: function() {
            var tweet;
            var b = k[Math.floor(Math.random() * k.length)];
            
            if (b == undefined) exports.callback("getRandomTweet(): error, b undefined", null);
            else {
                for (tweet = b + " ";;) {
                    b: {
                        b = i[w ? b : b.toUpperCase()];
                        var c = Math.random(),
                            g = 0,
                            e = void 0;
                        for (e in b) {
                            g += Number(b[e]);
                            if (c <= g) {
                                b = e;
                                break b;
                            }
                        }
                        b = i[Math.floor(Math.random() * i.length)]
                    }
                    if (!b) break;
                    if (tweet.length + b.length >= s) break;
                    tweet += b + " ";
                }
                tweet = tweet.substr(0, tweet.length - 1);
                tweet = tweet;
                tweet = tweet.substr(0, 1).toUpperCase() + tweet.substr(1);
                b = /[\.\!\?]/gm;
                
                for (c = 0; g = b.exec(tweet);) c = g.index;
                if (c >= z) tweet = tweet.substr(0, c + 1);
                else {
                    if (!tweet.charAt(tweet.length - 1).match(b)) {
                        if (tweet.length == s) tweet = tweet.substr(0,
                        tweet.lastIndexOf(" "));
                        if (tweet.charAt(tweet.length - 1).match(/[,:;]/)) tweet = tweet.substr(0, tweet.length - 1);
                        tweet += [".", "?", "!"][Math.floor(Math.random() * 3)]
                    }
                    tweet = tweet;
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
            } else try {
                i = {};
                k = [];
                
                twitterObj.get('/statuses/user_timeline.json', {screen_name: encodeURIComponent(this.user), count: 80}, function(error, tweets) {
                    module.exports.onTwitterStatusesLoaded(tweets);
                });

            } catch (e) {
                this.callback("getNewTweet(): error getting tweets w/ api", null);
            }
        },
        
        onTwitterStatusesLoaded: function (tweets) {
            if (!tweets || tweets.length === 0) this.callback("onTwitterStatusesLoaded(): error, tweets undefined");
            else {
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
                        d = w ? f : f.toUpperCase();
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