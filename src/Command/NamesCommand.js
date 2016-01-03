const AbstractCommand = require('./AbstractCommand');

class NamesCommand extends AbstractCommand {
    static get name() { return 'names'; }

    static get description() { return "Shows names of the given user"; }

    static get help() { return "Type `names <username>` to get the nicknames a user has used."; }

    handle() {
        this.responds(/^names$/g, () => {
            this.reply(NamesCommand.help);
        });

        this.responds(/^names <@(\d+)>$/g, (matches) => {
            let key = 'discord.user.' + matches[1];
            this.brain.get(key, (error, reply) => {
                let user = reply === null ? {} : JSON.parse(reply);

                if (user.usernames === undefined || user.usernames.length <= 1) {
                    this.sendMessage(
                        this.message.channel,
                        `${this.message.mentions[0].mention()} has no other usernames`
                    );

                    return;
                }

                let message = `${this.message.mentions[0].mention()} has used the following usernames: \n`;
                user.usernames.forEach((username) => {
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