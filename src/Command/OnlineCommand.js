const AbstractCommand = require('./AbstractCommand');

class OnlineCommand extends AbstractCommand {
    static get name() { return 'online'; }

    static get description() { return "Shows the last time a user was online"; }

    static get help() { return "Type `online <username>` to get the last time a user was online."; }

    handle() {
        this.responds(/^online$/g, () => {
            this.reply(OnlineCommand.help);
        });

        this.responds(/^online <@(\d+)>$/g, (matches) => {
            let user = this.client.users.get('id', matches[1]),
                key  = 'discord.user.' + matches[1];

            this.brain.get(key, (error, reply) => {
                let info = reply === null ? {} : JSON.parse(reply);

                if (user === undefined) {
                    this.reply("I couldn't find status information on that user!");

                    return;
                }

                if (user.status === 'offline') {
                    if (info.lastOnline === undefined) {
                        this.reply("I couldn't find status information on that user!");

                        return;
                    }

                    this.reply("The last time I saw that user online was: " + info.lastOnline);

                    return;
                }

                this.reply("That user is currently online.");
            });
        });
    }
}

module.exports = OnlineCommand;