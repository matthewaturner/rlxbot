// filter.js

var config = require('./config')

var required_keywords = config.required_keywords;
var selected_keywords = config.selected_keywords;

function filter(post) {
	var text = post.title.toLowerCase();

	if (post.body !== undefined) {
		text = text + post.body.toLowerCase();
	}

	if (required_keywords.every(keyword => text.includes(keyword))) {
		if (selected_keywords.some(keyword => text.includes(keyword))) {
			return true;
		}
	}

	return false;
}

module.exports = filter;
