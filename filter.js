
function filter(post) {
	var title = post.title.toLowerCase();
	var body = "";

	if (post.body !== undefined) {
		body = post.body.toLowerCase();
	}

	if (title.indexOf('[xbox]') >= 0) {
		if (title.indexOf('halo') >= 0 || body.indexOf('halo') >= 0) {
			return true;
		}
	}

	return false;
}

module.exports = filter;
