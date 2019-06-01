var config = {};

config.subreddit = 'rocketleagueexchange';
config.agent_name = 'rlxbot_node';
config.email_subject = 'RLXBot Notification';
config.poll_limit = 10;
config.poll_interval_ms = 5000;
config.required_keywords = ['[xbox]'];
config.optional_keywords = ['hexed', 'infinium', 'anodoized', 'hypnotik'];

module.exports = config;
