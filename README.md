#What is it?
Just a Twitter bot that listens for what you're saying. It will answer every tweet mentionning it something random it got from the previous tweets of the mentionner.

#Configure
Begin by opening a new account for the bot on Twitter. Then, create an application for this account on [dev.twitter.com](http://dev.twitter.com), and get the API keys.

Setup in config.json. Replace the Twitter API keys of the bot you created on Twitter in the file. Like this:

``` json
{
	"keys": {
		"consumer_key":        "YOUR_CONSUMER_TOKEN",
		"consumer_secret":     "YOUR_CONSUMER_SECRET",
		"access_token_key":    "YOUR_ACCESS_TOKEN_KEY",
		"access_token_secret": "YOUR_ACCESS_TOKEN_SECRET"
	},
	"blacklist": ["HeureFrancaise"]
}
```

As you can see, you can also specify a blacklist which will prevent the bot from replying to certain users: this can be particularly useful if you don't want the bot to be stuck in a loop with another bot.

#Usage
Install Node.js, and use it to run the bot. Like this:

	node bot.js
