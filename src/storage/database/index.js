var fs = require('fs');
var Helper = require('./helper');
var sqlite3 = require('sqlite3').verbose();

var messageStorage = require('./messages.js');

var db = null;

var path = Helper.HOME + '/messages.sqlite3';

function shouldInitializeDatabase() {
	return !fs.existsSync(path);
}

function setup() {
	var shouldInitialize = shouldInitializeDatabase();
	db = new sqlite3.Database(path);

	if (shouldInitialize) {
		messageStorage.createMessagesTable(db);
	}
}

function insertMessage(msg, clientName, channel, network) {
	messageStorage.insertMessage(db, msg, clientName, channel.name, network.name);
}

function getMessagesForUser(user) {
	return messageStorage.getMessagesForUser(db, user);
}


module.exports = {
	insertMessage: insertMessage,
	getMessagesForUser: getMessagesForUser,
	setup: setup
};
