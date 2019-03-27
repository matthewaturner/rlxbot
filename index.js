var http = require('http');
var snoowrap = require('snoowrap');
var snoostorm = require('snoostorm');
var nodemailer = require('nodemailer');
var config = require('./config')

// import environment variables if they exist
require('dotenv').config();
var startTime = new Date();

/* -------------------------------------------------------------------------- */
/* Set up notifications (email)                                               */
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
		subject: config.EMAIL_SUBJECT,
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
/* Set up reddit wrapper                                                      */
/* -------------------------------------------------------------------------- */

var client = new snoowrap({
  userAgent: config.AGENT_NAME,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS
});

var streamOpts = {
  subreddit: config.SUBREDDIT,
  limit: 5,
  pollTime: 5000
};

var posts = new snoostorm.SubmissionStream(client, streamOpts);

posts.on('item', (post) => {
	postTime = new Date(0);
	postTime.setUTCSeconds(post.created_utc);

	if (postTime > startTime) {
		console.log('Got a (new) post');
		sendEmail(post.title + '\n' + post.url);
	} else {
		console.log('Got an old post');
	}
});

/* -------------------------------------------------------------------------- */
/* Simple http server (verify bot is running)                                 */
/* -------------------------------------------------------------------------- */

var server = http.createServer((request, response) => {
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end('Hello world from ' + config.AGENT_NAME);
	sendEmail('Hello world from ' + config.AGENT_NAME);
});

var port = process.env.PORT || 1337;
server.listen(port);

console.log('Server running on port %d', port);
