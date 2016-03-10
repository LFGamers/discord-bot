const BaseBot          = require('discord-bot-base').Bot;

class Bot extends BaseBot {
    onReady() {
        super.onReady();

        this.container.get('listener.username').listen();

        let client = this.container.get('client');
        client.servers.forEach((server) => {
            this.container.get('factory.event_listener').create(server).listen();
        });
    }
}

module.exports = Bot;
