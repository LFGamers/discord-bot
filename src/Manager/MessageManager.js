const Message = require('../Model/Message');

class MessageManager {
    constructor(client) {
        this.client = client;
    }

    create(message) {
        return new Message(this.client, message);
    }
}

module.exports = MessageManager;