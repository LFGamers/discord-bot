const MessageManager = require('../Manager/MessageManager');
const walk           = require('walk');
const chalk = require('chalk');

class MessageListener {
    constructor(dev, brain, client) {
        this.dev      = dev;
        this.brain    = brain;
        this.client   = client;
        this.commands = [];

        this.initialize();
    }

    initialize() {
        let walker = walk.walk(__dirname + '/../Command/', {followLinks: false});

        walker.on('file', (root, stat, next) => {
            let cls = require(__dirname + '/../Command/' + stat.name);


            if (stat.name !== 'AbstractCommand.js') {
                this.register(cls);
            }

            next();
        });

        walker.on('end', () => {
            console.log(chalk.grey.dim("Added " + this.commands.length + " commands"));
            this.client.on('message', this.handleMessage.bind(this));
        })
    }

    register(command) {
        this.commands.push(command);
    }

    handleMessage(message) {
        message = MessageManager.create(this.client, message);

        if (message.author.id === this.client.user.id) {
            return false;
        }

        for (let index in this.commands) {
            if (!this.commands.hasOwnProperty(index)) {
                continue;
            }

            let cls     = this.commands[index],
                command = new cls(this.client, this.brain, message);

            if (typeof command.setCommands === 'function') {
                command.setCommands(this.commands);
            }

            command.handle();
        }
    }
}

module.exports = MessageListener;