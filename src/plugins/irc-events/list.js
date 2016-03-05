var Msg = require("../../models/msg");

var list = []

module.exports = function(irc, network) {
	var client = this;
		irc.on('data', function(msg) {
      if (! msg.command.startsWith('RPL_LIST')) return;
      if ('RPL_LISTSTART' == msg.command) {
					list = []
			}
      if ('RPL_LIST' == msg.command) {
				var msgParts = msg.string.split(' ')
				msgParts = msgParts.slice(3)
				list.push({
					name:     msgParts[0],
					numUsers: msgParts[1],
					mode:     msgParts[2],
					topic:    msgParts.slice(3).join(' ')
				})
			}
      if ('RPL_LISTEND' == msg.command) {
					client.emit('list', list)
			}
	});
};
