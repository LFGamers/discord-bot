'use strict';

const Bot = require('./src/Bot');
const dev = process.env.DISCORD_DEV === undefined ? false : process.env.DISCORD_DEV;

let bot = new Bot(dev, process.env.DISCORD_ADMIN_ID);
bot.run(process.env.DISCORD_EMAIL, process.env.DISCORD_PASSWORD);
