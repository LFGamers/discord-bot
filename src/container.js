const EventEmitter = require('events');
const Client       = require('discord.js').Client;

const RedisBrain      = require('./Brain/RedisBrain');
const MessageListener = require('./Listener/MessageListener');
const ThrottleHelper  = require('./Helper/ThrottleHelper');
const MessageManager  = require('./Manager/MessageManager');
const ReminderManager = require('./Manager/ReminderManager');

module.exports = (Bot) => {
    return {
        parameters: {
            dev:      process.env.DISCORD_DEV === undefined ? false : process.env.DISCORD_DEV,
            adminId:  process.env.DISCORD_ADMIN_ID,
            login:    {
                email:    process.env.DISCORD_EMAIL,
                password: process.env.DISCORD_PASSWORD
            },
            redisUrl: process.env.DISCORD_REDIS_URL
        },
        services:   {
            dispatcher:         {module: EventEmitter},
            client:             {module: Client},
            'brain.redis':      {module: RedisBrain, args: ['%redisUrl%']},
            'manager.message':  {module: MessageManager, args: [{$ref: 'client'}]},
            'helper.throttle':  {module: ThrottleHelper},
            'reminder.message': {
                module: ReminderManager,
                args: [
                    {$ref: 'dispatcher'},
                    {$ref: 'client'},
                    {$ref: 'brain.redis'}
                ]
            },
            'listener.message': {
                module: MessageListener,
                args:   [
                    '%dev%',
                    {$ref: 'dispatcher'},
                    {$ref: 'brain.redis'},
                    {$ref: 'client'},
                    {$ref: 'manager.message'},
                    {$ref: 'helper.throttle'}
                ]
            }
        }
    };
};