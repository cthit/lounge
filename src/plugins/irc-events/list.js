var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on('data', function(msg) {
      if (! msg.command.startsWith('RPL_LIST')) return;
      if ('RPL_LISTSTART' == msg.command) {
					network.listCache = []
			}
      if ('RPL_LIST' == msg.command) {
				var msgParts = msg.string.split(' ')
				msgParts = msgParts.slice(3)
				network.listCache.push({
					name:     msgParts[0],
					numUsers: msgParts[1],
					mode:     msgParts[2],
					topic:    msgParts.slice(3).join(' ')
				})
			}
      if ('RPL_LISTEND' == msg.command) {
					client.emit('list', network.listCache)
			}
	});
};
