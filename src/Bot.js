const BaseBot          = require('discord-bot-base').Bot;

class Bot extends BaseBot {
    constructor(env, debug, options) {
        super(env, debug, options);
    }

    onReady() {
        super.onReady();

        this.container.get('listener.username').listen();
        this.client.servers.forEach((server) => {
            this.container.get('factory.event_listener').create(server).listen();
        });
    }
}

module.exports = Bot;
