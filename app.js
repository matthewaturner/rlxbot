// index.js

const body_parser = require('body-parser');
const dotenv = require('dotenv');
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const snoowrap = require('snoowrap');
const snoostorm = require('snoostorm');

const config = require('./config');
const filter = require('./filter');

// set up environment variables and globals
dotenv.config();
var startTime = new Date();

var required_keywords = config.required_keywords;
var selected_keywords = config.selected_keywords;
var ignored_keywords  = config.ignored_keywords;

/* -------------------------------------------------------------------------- */
/* Set up express server and routes                                           */
/* -------------------------------------------------------------------------- */
var app = express();
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '/index.html'));
});

// required keywords
app.get('/required_keywords', function(req, res) {
	res.send(required_keywords);
});

app.post('/required_keywords', function(req, res) {
	data = req.body;
	if (Array.isArray(data)) {
		required_keywords = data;
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
});

// selected keywords
app.get('/selected_keywords', function(req, res) {
	res.send(selected_keywords);
});

app.post('/selected_keywords', function(req, res) {
	data = req.body;
	if (Array.isArray(data)) {
		selected_keywords = data;
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
});

// ignored keywords
app.get('/ignored_keywords', function(req, res) {
	res.send(ignored_keywords);
});

app.post('/ignored_keywords', function(req, res) {
	data = req.body;
	if (Array.isArray(data)) {
		ignored_keywords = data;
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
});

app.listen(process.env.PORT || 1337);
console.log('Server running on port %d', process.env.PORT || 1337);

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
/* Set up reddit wrapper                                                      */
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
