const MessageListener = require('./Listener/MessageListener');

const Promise = require("bluebird");
const Redis   = require('redis');
const Client  = require('discord.js').Client;
const chalk   = require('chalk');

Promise.promisifyAll(Redis.RedisClient.prototype);
Promise.promisifyAll(Redis.Multi.prototype);

class Bot {
    constructor(dev, adminId) {
        this.dev     = dev;
        this.adminId = adminId;

        console.log(
            chalk.blue(
                `

    LFGBot v0.1.0 - by Aaron (aequasi@gmail.com)

                `
            )
        );
    }

    run(email, password) {
        this.client          = new Client();
        this.brain           = this.createBrain();
        this.messageListener = new MessageListener(this.dev, this.brain, this.client);

        this.client.login(email, password).catch(console.error);

        if (this.dev) {
            this.client.on('debug', (message) => console.log(chalk.cyan.dim(message)));
        }

        this.client.on('ready', this.onReady.bind(this));
        this.client.on('error', console.error);

        this.client.on('disconnect', this.onDisconnect.bind(this));
    }

    onReady() {
        console.log(chalk.green("Bot is connected, waiting for messages"));
        if (this.adminId !== undefined) {
            this.client.admin = this.client.users.get('id', this.adminId);
            this.client.sendMessage(this.client.admin, "Bot is connected, waiting for messages");
        } else {
            console.error(chalk.red("Admin ID not defined. Commands requiring it disabled."));
        }
    }

    onDisconnect() {
        console.log("Bot has disconnected");
    }

    createBrain() {
        let client = Redis.createClient(process.env.DISCORD_REDIS_URL);

        client.on("error", function(err) {
            console.log("Error " + err);
        });

        return client;
    }
}

module.exports = Bot;
