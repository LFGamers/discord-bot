const AbstractModule = require('discord-bot-base').AbstractModule;

class ModerationModule extends AbstractModule {
    get commandsDir() {
        return __dirname + '/Command';
    }
}

module.exports = ModerationModule;
