Handlebars.registerHelper(
	"tz", function(time) {
		if (time) {
			return moment(time).format("HH:mm");
		} else {
			return "";
		}
	}
);
