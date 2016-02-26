'use strict';

const pkg                  = require('../package');
const Bot                  = require('./Bot');
const UserListener         = require('./Listener/UserListener');
const EventListenerFactory = require('./Factory/EventListenerFactory');
const ReminderManager      = require('./Manager/ReminderManager');
const env                  = process.env;
const Commands             = require('require-all')(__dirname + '/Command/');

let commands = [];
for (let name in Commands) {
    if (Commands.hasOwnProperty(name)) {
        if (name !== 'AbstractCommand') {
            commands.push(Commands[name]);
        }
    }
}

let options = {
    admin_id:  env.DISCORD_ADMIN_ID,
    email:     env.DISCORD_EMAIL,
    password:  env.DISCORD_PASSWORD,
    redis_url: env.DISCORD_REDIS_URL,
    mongo_url: env.DISCORD_MONGO_URL,
    name:      pkg.name,
    version:   pkg.version,
    author:    pkg.author,
    commands:  commands,
    status:    'https://lfgame.rs',
    prefix:    "$",
    container: (Bot) => {
        return {
            parameters: {
                eventLogChannelName: 'event-log'
            },
            services:   {
                'factory.event_listener': {
                    module: EventListenerFactory,
                    args:   [{$ref: 'client'}, '%eventLogChannelName%']
                },
                'reminder.message':       {
                    module: ReminderManager, args: [{$ref: 'dispatcher'}, {$ref: 'client'}, {$ref: 'brain.redis'}]
                },
                'listener.username':      {module: UserListener, args: [{$ref: 'client'}]}
            }
        }
    }
};

let environment = 'prod';
if (env.DISCORD_ENV !== undefined) {
    environment = env.DISCORD_ENV;
}

new Bot(environment, environment === 'dev', options);
