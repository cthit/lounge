var fs = require('fs');
var Helper = require('./helper');
var sqlite3 = require('sqlite3').verbose();

var db = null;

var path = Helper.HOME + '/messages.sqlite3';

function shouldInitializeDatabase() {
	return !fs.existsSync(path);
}

function connect() {
	var shouldInitialize = shouldInitializeDatabase()
	db = new sqlite3.Database(path);

	if (shouldInitialize) {
		initializeDatabase();
	}
}

function insertMessage(msg, user, chan) {
	db.serialize(function() {
		var stmt = db.prepare("INSERT INTO messages VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)")
		stmt.run(
			chan,
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

function getMessagesForUser(user) {
	return new Promise((resolve, reject) => {
		db.serialize(function() {

			var channelsQuery = new Promise(resolve =>
				db.prepare("SELECT channel FROM messages WHERE user = ? GROUP BY channel")
				  .all(user, (err, rows) => resolve(rows))
		  	);

			channelsQuery.then(channels => {
				console.log('channels', channels);
				var channelRows = channels.map(c => c.channel).map((channel) =>
					new Promise(resolve => db.prepare("SELECT * FROM messages WHERE user = ? AND channel = ? LIMIT 100")
						.all(user, channel, (err, rows) => resolve(rows))
				));

			 	resolve(Promise.all(channelRows));
			})
		});
	});
}

function initializeDatabase() {
	db.serialize(function() {
		db.run("CREATE TABLE messages( \
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
		db.run("CREATE INDEX user_channel on messages (user, channel);")
	});
}

module.exports = {
	connect: connect,
	getMessagesForUser: getMessagesForUser,
	insertMessage: insertMessage
};
