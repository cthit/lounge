function createMessagesTable(db) {
	db.serialize(function() {
		db.run("CREATE TABLE messages( \
			network TEXT, \
			channel TEXT, \
			user TEXT, \
			type TEXT, \
			`from` TEXT, \
			mode TEXT, \
			target TEXT, \
			text TEXT, \
			invitedYou INTEGER, \
			highlight INTEGER, \
			hostmask TEXT, \
			self INTEGER, \
			time TEXT, \
			isSetByChan INTEGER \
		)");
		db.run("CREATE INDEX user_channel_network on messages (user, channel, network);")
	});
}

function insertMessage(db, msg, user, channel, network) {
	db.serialize(function() {
		var stmt = db.prepare("INSERT INTO messages VALUES(?, ?,?,?,?,?,?,?,?,?,?,?,?,?)")
		stmt.run(
			network,
			channel,
			user,
			msg.type,
			msg.from,
			msg.mode,
			msg.target,
			msg.text,
			msg.invitedYou,
			msg.highlight,
			msg.hostmask,
			msg.self,
			msg.time,
			msg.isSetByChan
		);
	});
}

function getMessagesForUser(db, user) {
	return new Promise(resolve => {
		db.serialize(() => {
			db.prepare("SELECT network, channel FROM messages WHERE user = ? GROUP BY network, channel")
			.all(user, (err, channels) => {
				var stmt = db.prepare("SELECT * FROM messages WHERE user = ? AND channel = ? AND network = ? ORDER BY `time` DESC LIMIT 100");

				db.parallelize(() => {
					Promise.all(
						channels.map(chan =>
							new Promise(resolve =>
								stmt.all(user, chan.channel, chan.network, (err, messages) =>
									resolve(messages)
								)
							)
						)
					).then(channels => {
						channels = _.flatten(channels)
						resolve(
							channels.map(channel => _.assign({}, channel, {
								invitedYou: channel.invitedYou === 1,
								highlight: channel.highlight === 1,
								self: channel.self === 1,
								isSetByChan: channel.isSetByChan === 1
							}))
						)
					});
				});
			});
		})
	});
}


module.exports = {
	insertMessage: insertMessage,
	createMessagesTable: createMessagesTable,
	getMessagesForUser: getMessagesForUser
}
