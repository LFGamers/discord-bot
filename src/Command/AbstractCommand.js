const prettyjson = require('prettyjson');
const chalk      = require('chalk');

class AbstractCommand {
    static get name() { throw Error("Commands must override get name()"); }

    static get description() { throw Error("Commands must override get description()"); }

    static get help() { return "None"; }

    constructor(dispatcher, client, brain, throttleHelper, message) {
        this.dispatcher = dispatcher;
        this.client     = client;
        this.brain      = brain;
        this.throttle   = throttleHelper;
        this.message    = message;
    }

    isThrottled(key, length) {
        return this.throttle.isThrottled(key, this.message, length);
    }

    reply(content, delay) {
        delay = delay === undefined ? 0 : delay;

        setTimeout(() => {
            this.client.reply(this.message.message, content);
        }, 50 + delay)
    }

    sendMessage(location, message, delay) {
        delay = delay === undefined ? 0 : delay;

        setTimeout(() => {
            this.client.sendMessage(location, message);
        }, 50 + delay)
    }

    handle() {
        throw Error("Commands must override handleMessage");
    }

    getMatches(content, regex, callback) {
        let matches = regex.exec(content);

        //console.log(chalk.grey("Matching content against " + regex.toString(), content, matches));
        if (matches === null) {
            return false;
        }

        let result = callback(matches);

        if (result !== false) {
            let array = this.message.toArray();
            array.regex = regex.toString();
            console.log("\n" + prettyjson.render({"Command Executed": array}) + "\n");
        }
    }

    hears(regex, callback) {
        return this.getMatches(this.message.rawContent, regex, callback);
    }

    responds(regex, callback) {
        return this.getMatches(this.message.content, regex, callback)
    }
}

module.exports = AbstractCommand;
