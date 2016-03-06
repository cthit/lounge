module.exports = function(network, chan, cmd, args) {
	if (cmd !== "list") {
		return;
	}
	var irc = network.irc;
	var client = this;

	network.listCache = network.listCache || []
	if (network.listCache.length === 0) {
		irc.write('LIST');
	} else {
		client.emit('list', network.listCache);
	}


};
