const AbstractCommand = require('./AbstractCommand');
const User            = require('../Model/User');

class NamesCommand extends AbstractCommand {
    static get name() { return 'names'; }

    static get description() { return "Shows names of the given user"; }

    static get help() { return "Type `names <username>` to get the nicknames a user has used."; }

    handle() {
        this.responds(/^names$/g, () => {
            this.reply(NamesCommand.help);
        });

        this.responds(/^names <@(\d+)>$/g, (matches) => {
            User.findOne({identifier: matches[1]}, (err, user) => {
                if (user.names === undefined || user.names.length <= 1) {
                    this.sendMessage(
                        this.message.channel,
                        `${this.message.mentions[0].mention()} has no other usernames`
                    );

                    return;
                }

                let message = `${this.message.mentions[0].mention()} has used the following usernames: \n`;
                user.names.forEach((username) => {
                    username = username.replace('`', '\\`');
                    username = username.replace('@', '\\@');
                    message += `\n - ${username}`;
                });

                this.sendMessage(this.message.channel, message);
            });
        });
    }
}

module.exports = NamesCommand;