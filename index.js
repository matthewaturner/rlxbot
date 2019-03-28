var http = require('http');
var snoowrap = require('snoowrap');
var snoostorm = require('snoostorm');
var nodemailer = require('nodemailer');
var config = require('./config')
var filter = require('./filter')

// import environment variables if they exist
require('dotenv').config();
var startTime = new Date();

/* -------------------------------------------------------------------------- */
/* Set up notifications (email)																							 */
/* -------------------------------------------------------------------------- */

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GMAIL_USER + '@gmail.com',
		pass: process.env.GMAIL_PASS
	}
});

function sendEmail(msg) {
	var mailOptions = {
		from: process.env.GMAIL_USER + '@gmail.com',
		to: process.env.DEST_EMAIL,
		subject: config.email_subject,
		text: msg
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

/* -------------------------------------------------------------------------- */
/* Set up reddit wrapper																											*/
/* -------------------------------------------------------------------------- */

var client = new snoowrap({
	userAgent: config.agent_name,
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	username: process.env.REDDIT_USER,
	password: process.env.REDDIT_PASS
});

var streamOpts = {
	subreddit: config.subreddit,
	limit: config.poll_limit,
	pollTime: config.poll_interval_ms
};

var posts = new snoostorm.SubmissionStream(client, streamOpts);

posts.on('item', (post) => {
	postTime = new Date(0);
	postTime.setUTCSeconds(post.created_utc);

	// if this is a new post and our filter selects it
	if (postTime > startTime && filter(post)) {
		console.log('SELECTED: %s', post.title);
		sendEmail(post.title + '\r\n-----\r\n' + post.text + '\r\n' + post.url);
	} else {
		console.log('IGNORED: %s', post.title);
	}
});

/* -------------------------------------------------------------------------- */
/* Simple http server (verify bot is running)																 */
/* -------------------------------------------------------------------------- */

var server = http.createServer((request, response) => {
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end('Hello world from ' + config.agent_name);
});

var port = process.env.PORT || 1337;
server.listen(port);

console.log('Server running on port %d', port);
sendEmail('Bot started at ' + startTime + '.');
