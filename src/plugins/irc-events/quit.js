var _ = require("lodash");
var Msg = require("../../models/msg");
var storage = require("../../storage");

module.exports = function(irc, network) {
	var client = this;
	irc.on("quit", function(data) {
		network.channels.forEach(function(chan) {
			var from = data.nick;
			var user = _.find(chan.users, {name: from});
			if (typeof user === "undefined") {
				return;
			}
			chan.users = _.without(chan.users, user);
			client.emit("users", {
				chan: chan.id
			});
			var msg = new Msg({
				type: Msg.Type.QUIT,
				mode: chan.getMode(from),
				text: data.message || "",
				hostmask: data.hostmask.username + "@" + data.hostmask.hostname,
				from: from
			});
			storage.insertMessage(msg, client.name, chan, network);
			client.emit("msg", {
				chan: chan.id,
				msg: msg
			});
		});
	});
};
