// config.js

var config = {};

config.subreddit = 'rocketleagueexchange';
config.agent_name = 'rlxbot_node';
config.email_subject = 'RLXBot Notification';
config.poll_limit = 10;
config.poll_interval_ms = 5000;
config.required_keywords = ['[xbox]'];
config.selected_keywords = ['halo', 'infinium', 'dissolver', 'saff'];
config.ignored_keywords = ['[discussion]'];

module.exports = config;
