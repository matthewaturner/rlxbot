const http = require('http');
const snoowrap = require('snoowrap');
const snoostorm = require('snoostorm');

// import environment variables if they exist
require('dotenv').config();


const client = new snoowrap({
    userAgent: 'rxlbot-node',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});

const streamOpts = {
    subreddit: 'testingground4bots',
    limit: 5,
    pollTime: 20000
};

const comments = new snoostorm.CommentStream(client, streamOpts);

comments.on('item', (comment) => {
    console.log('Got a comment: \'%s\'', comment.body);
    if (comment.body === ':(') {
        console.log('Replied!');
        comment.reply(':)');
    }
});

// just so we know the bot is running
const server = http.createServer((request, response) => {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("RLXBot is working!");
});

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
