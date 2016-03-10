const AbstractModule = require('discord-bot-base').AbstractModule;

class FunModule extends AbstractModule {
    get commandsDir() {
        return __dirname + '/Command';
    }
}

module.exports = FunModule;
