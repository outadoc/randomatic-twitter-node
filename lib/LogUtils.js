(function() {

	module.exports = {
		Colors: {
			RED    : '\033[31m',
			GREEN  : '\033[32m',
			YELLOW : '\033[33m',
			BLUE   : '\033[34m'
		},

		logtrace: function(message, color) {
			//just log the message with a timestamp
			console.log(this.Colors.YELLOW + this.getTimestampString() + color + message + '\033[0m');
		},

		getTimestampString: function() {
			var date = new Date();
			//format nicely a timestamp we can put in front of our logs
			return "[" + this.addUselessZero(date.getDate()) + "/" + this.addUselessZero(date.getMonth()+1) + "/" + this.addUselessZero(date.getFullYear()) + "-" + this.addUselessZero(date.getHours()) + ":" + this.addUselessZero(date.getMinutes()) + ":" + this.addUselessZero(date.getSeconds()) + "] ";
		},

		addUselessZero: function(num) {
			if(num < 10) {
				return '0' + num.toString();
			}

			return num;
		},
	}

})();