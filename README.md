#What is it?
Just a Twitter bot that listens for what you're saying. It will answer every tweet mentionning it something random it got from the previous tweets of the mentionner.

#Configure
Begin by opening a new account for the bot on Twitter. Then, create an application for this account on dev.twitter.com, and get the API keys.

Setup in apiKeys.json. Replace the Twitter API keys of the bot you created on twitter in the file. Like this:

``` json
{
	"consumer_key":        "YOUR_CONSUMER_TOKEN",
	"consumer_secret":     "YOUR_CONSUMER_SECRET",
	"access_token_key":    "YOUR_ACCESS_TOKEN_KEY",
	"access_token_secret": "YOUR_ACCESS_TOKEN_SECRET"
}
```

#Usage
Install Node.js, and use it to run the bot. Like this:

	node bot.js