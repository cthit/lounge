var _ = require("lodash");
var Msg = require("../../models/msg");
var storage = require("../storage");

module.exports = function(network, chan, cmd, args) {
	var client = this;
	if (cmd !== "notice" || !args[1]) {
		return;
	}

	var message = args.slice(1).join(" ");
	var irc = network.irc;
	irc.notice(args[0], message);

	var targetChan = _.find(network.channels, {name: args[0]});
	if (typeof targetChan === "undefined") {
		message = "{to " + args[0] + "} " + message;
		targetChan = chan;
	}

	var msg = new Msg({
		type: Msg.Type.NOTICE,
		mode: targetChan.getMode(irc.me),
		from: irc.me,
		text: message
	});
	storage.insertMessage(msg, client.name, targetChan, network);
	client.emit("msg", {
		chan: targetChan.id,
		msg: msg
	});
};
