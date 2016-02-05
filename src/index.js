'use strict';

const pkg                  = require('../package');
const walk                 = require('walk');
const Bot                  = require('./Bot');
const UserListener         = require('./Listener/UserListener');
const EventListenerFactory = require('./Factory/EventListenerFactory');
const ReminderManager      = require('./Manager/ReminderManager');

let walker  = walk.walk(__dirname + '/Command/', {followLinks: false}),
    options = {
        admin_id:  process.env.DISCORD_ADMIN_ID,
        email:     process.env.DISCORD_EMAIL,
        password:  process.env.DISCORD_PASSWORD,
        name:      pkg.name,
        log_dir:   '/var/log/discord_bots',
        version:   pkg.version,
        author:    pkg.author,
        commands:  [],
        status:    'www.lfgame.rs',
        prefix:    "$",
        container: (Bot) => {
            return {
                parameters: {
                    "redis_url":         process.env.DISCORD_REDIS_URL,
                    "mongo_url":         process.env.DISCORD_MONGO_URL,
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

walker.on('file', (root, stat, next) => {
    options.commands.push(require(__dirname + '/Command/' + stat.name));

    next();
});

walker.on('end', () => {
    new Bot('dev', true, options);
});
