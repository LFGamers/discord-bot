const AbstractModule = require('discord-bot-base').AbstractModule;

class LFGamersModule extends AbstractModule {
    get commandsDir() {
        return __dirname + '/Command';
    }

    isDefaultEnabled() {
        return false;
    }
}

module.exports = LFGamersModule;
