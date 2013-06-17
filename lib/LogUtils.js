(function() {

	var util = require('util');

	module.exports = {
		Colors: {
			RED    : '\033[31m',
			GREEN  : '\033[32m',
			YELLOW : '\033[33m',
			BLUE   : '\033[34m',
			CYAN   : '\033[36m'
		},

		logtrace: function(message, color) {
			if(color === undefined) { color = module.exports.Colors.GREEN; }
			//just log the message with a timestamp
			util.log(color + message + '\033[0m');
		},

		addUselessZero: function(num) {
			if(num < 10) {
				return '0' + num.toString();
			}

			return num;
		},
	}

})();