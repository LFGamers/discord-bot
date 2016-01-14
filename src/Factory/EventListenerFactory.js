const DiscordEventListener = require('../Listener/DiscordEventListener');

class EventListenerFactory {
    constructor(client, channelName) {
        this.client      = client;
        this.channelName = channelName;
    }

    create(server) {
        return new DiscordEventListener(this.client, server, this.channelName);
    }
}

module.exports = EventListenerFactory;