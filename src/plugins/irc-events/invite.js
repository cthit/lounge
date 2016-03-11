var _ = require("lodash");
var Msg = require("../../models/msg");
var storage = require("../../storage");

module.exports = function(irc, network) {
	var client = this;
	irc.on("invite", function(data) {
		var target = data.to;

		var chan = _.find(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			chan = network.channels[0];
		}

		var msg = new Msg({
			type: Msg.Type.INVITE,
			from: data.from,
			target: target,
			text: data.channel,
			invitedYou: target.toLowerCase() === irc.me.toLowerCase()
		});
		storage.insertMessage(msg, client.name, chan, network);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	});
};
