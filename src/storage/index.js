var Helper = require("../helper");
var config = Helper.getConfig();
var database = require("./database");
var memory = require("./memory.js");


if (config.sqlite) {
	module.exports = database;
} else {
	module.exports = memory;
}