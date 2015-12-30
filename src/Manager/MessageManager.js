const Message = require('../Model/Message');

class MessageManager {
    static create(client, message) {
        return new Message(client, message);
    }
}

module.exports = MessageManager;