const AbstractCommand = require('discord-bot-base').AbstractCommand,
      User            = require('../../../Model/User');

class NamesCommand extends AbstractCommand {
    static get name() {
        return 'names';
    }

    static get description() {
        return "Shows names of the given user";
    }

    static get help() {
        return "Type `names <username>` to get the nicknames a user has used.";
    }

    handle() {
        this.responds(/^names$/g, () => {
            this.reply(NamesCommand.help);
        });

        this.responds(/^names <@(\d+)>$/g, () => {
            User.findOne({identifier: this.mentions[0].id}, (err, user) => {
                if (err) {
                    this.reply("There was an error fetching usernames", 0, 3000);

                    return this.logger.error(err);
                }

                if (user.names === undefined || user.names.length <= 1) {
                    this.reply(`${this.mentions[0].mention()} has no other usernames`);

                    return;
                }

                let message = `${this.mentions[0].mention()} has used the following usernames: \n`;
                user.names.forEach((username) => {
                    username = username.replace('`', '\\`');
                    username = username.replace('@', '\\@');
                    message += `\n - ${username}`;
                });

                this.reply(message);
            });
        });
    }
}

module.exports = NamesCommand;