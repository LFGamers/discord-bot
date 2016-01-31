const AbstractCommand = require('discord-bot-base').AbstractCommand;

const THROTTLE = 60 * 30;

class ArcherCommand extends AbstractCommand {
    static get name() { return 'archer'; }

    static get description() { return "Listens for words from archer, and replies"; }

    handle() {
        return false;

        ArcherCommand.phrases.forEach((phrase) => {
            return this.hears(phrase.regex, () => {
                if (this.isThrottled(phrase.regex.toString(), THROTTLE)) {
                    return false;
                }
                if (typeof phrase.reply === 'string') {
                    return this.sendMessage(this.message.channel, phrase.reply);
                }

                if (typeof phrase.reply === 'function') {
                    return this.sendMessage(this.message.channel, phrase.reply());
                }

                if (Array.isArray(phrase.reply)) {
                    return phrase.reply.forEach((message) => {
                        return this.sendMessage(this.message.channel, message);
                    })
                }
            });
        });
    }
}

ArcherCommand.phrases = [
    {regex: /loggin/i, reply: 'call Kenny Loggins, \'cuz you\'re in the DANGER ZONE.'},
    {regex: /sitting down/i, reply: 'What?! At the table? Look, he thinks he\'s people!'},
    {regex: /sat down/i, reply: 'What?! At the table? Look, he thinks he\'s people!'},
    {regex: /^archer$/i, reply: ["come out and playyyeeeayyyy", "https://www.youtube.com/watch?v=ZHoJf2gXXw8"]},
    {regex: /benoit/i, reply: 'balls'},
    {regex: /love/i, reply: 'And I love that I have an erection... that doesn\'t involve homeless people.'}
];

module.exports = ArcherCommand;