var _ = require("lodash");
var Msg = require("../../models/msg");
var storage = require("../storage");

module.exports = function(irc, network) {
	var client = this;
	irc.on("part", function(data) {
		var chan = _.find(network.channels, {name: data.channels[0]});
		if (typeof chan === "undefined") {
			return;
		}
		var from = data.nick;
		if (from === irc.me) {
			network.channels = _.without(network.channels, chan);
			client.save();
			client.emit("part", {
				chan: chan.id
			});
		} else {
			var user = _.find(chan.users, {name: from});
			chan.users = _.without(chan.users, user);
			client.emit("users", {
				chan: chan.id
			});
			var msg = new Msg({
				type: Msg.Type.PART,
				mode: chan.getMode(from),
				text: data.message || "",
				hostmask:data.hostmask.username + "@" + data.hostmask.hostname,
				from: from
			});
			storage.insertMessage(msg, client.name, chan, network);
			client.emit("msg", {
				chan: chan.id,
				msg: msg
			});
		}
	});
};
