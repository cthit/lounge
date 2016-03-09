function insertMessage(msg, clientName, channel, network) {
	channel.messages.push(msg);
}

function setup() {
	// noop
}

module.exports = {
	insertMessage: insertMessage,
	setup: setup
};
