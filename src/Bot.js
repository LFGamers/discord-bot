const chalk            = require('chalk');
const ContainerBuilder = require('crate-js').ContainerBuilder;

class Bot {
    constructor() {
        this.container = ContainerBuilder.buildFromJson(require('./container')(this));

        console.log(
            chalk.blue(
                `

    LFGBot v0.1.0 - by Aaron (aequasi@gmail.com)

                `
            )
        );

        this.run();
    }

    run() {
        this.client = this.container.get('client');

        this.client.login(this.container.getParameter('login.email'), this.container.getParameter('login.password'));
        this.client.on('ready', this.onReady.bind(this));
        this.client.on('error', console.error);
        this.client.on('disconnect', this.onDisconnect.bind(this));
        if (this.container.getParameter('dev')) {
            this.client.on('debug', (message) => console.log(chalk.cyan.dim(message)));
        }
    }

    onReady() {
        console.log(chalk.green("Bot is connected, waiting for messages"));

        this.client.setStatus('online', 'https://lfgame.rs');

        this.container.get('listener.message').listen();
        this.container.get('listener.username').listen();

        if (this.container.getParameter('adminId') !== undefined) {
            this.client.admin = this.client.users.get('id', this.container.getParameter('adminId'));
            this.client.sendMessage(this.client.admin, "Bot is connected, waiting for messages");
        } else {
            console.error(chalk.red("Admin ID not defined. Commands requiring it disabled."));
        }

        this.client.servers.forEach((server) => {
            this.container.get('factory.event_listener').create(server).listen();
        })
    }

    onDisconnect() {
        console.log("Bot has disconnected");
    }
}

module.exports = Bot;
