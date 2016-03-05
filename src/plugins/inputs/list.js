module.exports = function(network, chan, cmd, args) {
	if (cmd !== "list") {
		return;
	}
	var irc = network.irc;
	irc.write('LIST ' + args.join(" "))
};
