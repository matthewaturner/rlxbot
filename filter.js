
function filter(post) {
	var title = post.title.toLowerCase();

	if (title.indexOf('[xbox]') >= 0 && title.indexOf('halo') >= 0) {
		return true;
	}

	return false;
}

module.exports = filter;
