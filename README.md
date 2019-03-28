# rlxbot

Bot intended to track posts on the /r/rocketleagueexchange. Could be used to
track any subreddit. When posts meet the filter defined in filter.js, an email
is sent to the bot's owner in order to notify them.

## Getting Started

These instructions help you set up your own reddit bot.

### Prerequisites

Node.js, npm, and git installed.

Create a new reddit account for your bot. If you don't want to do this you can
have the bot use your own reddit account. The bot never posts anything.

On your bot's reddit account create a reddit app [here](https://www.reddit.com/prefs/apps/). 
Take note of your bot id (listed right under the name of the bot) and the secret created.

Create a gmail account your bot will have access to. If you already have one
that you don't mind the bot sending emails from you can skip this.

### Setup

Clone this repo

```
git clone https://github.com/matthewaturner/rlxbot.git
```

Install dependencies

```
npm install
```

Set up environment variables. You can either copy / paste the following 
to a new .env file in the repo (easiest) or set these environment variables 
on the system.

**.env**
```
CLIENT_ID=<reddit bot client id>
CLIENT_SECRET=<reddit bot secret>
REDDIT_USER=<reddit bot username>
REDDIT_PASS=<reddit bot password>
GMAIL_USER=<gmail username bot will send emails from>
GMAIL_PASS=<gmail password>
DEST_EMAIL=<destination email for notifications>
```

Set up configurations you would like in **config.js**. Reddit has some
guidelines for request rate limits (especially for brand new accounts) so try
not to be impolite with the poll_limit and poll_interval_ms settings.

Run the bot

```
npm start
```

Check that the bot is running by visiting localhost:1337 in your browser. When
the bot starts up you should also receive a test email from the bot.

## Usage

Currently the post filter is very simple. There are required_keywords and
optional_keywords listed in **config.js** which are self-explanatory. Put tags
like "[xbox]" or "[ps4]" in the required_keywords list, and put optional
keywords like "draco" or "zomba" in optional_keywords.
