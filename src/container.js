const EventEmitter = require('events');
const Client       = require('discord.js').Client;

const RedisBrain      = require('./Brain/RedisBrain');
const MessageListener = require('./Listener/MessageListener');
const ThrottleHelper  = require('./Helper/ThrottleHelper');
const MessageManager  = require('./Manager/MessageManager');

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
            client:             {module: Client},
            'brain.redis':      {module: RedisBrain, args: ['%redisUrl%']},
            'manager.message':  {module: MessageManager, args: [{$ref: 'client'}]},
            'helper.throttle':  {module: ThrottleHelper},
            'listener.message': {
                module: MessageListener,
                args:   [
                    '%dev%',
                    {$ref: 'brain.redis'},
                    {$ref: 'client'},
                    {$ref: 'manager.message'},
                    {$ref: 'helper.throttle'}
                ]
            }
        }
    };
};