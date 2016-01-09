const AbstractCommand = require('./AbstractCommand');
const User = require('../Model/User')

class OnlineCommand extends AbstractCommand {
    static get name() { return 'online'; }

    static get description() { return "Shows the last time a user was online"; }

    static get help() { return "Type `online <username>` to get the last time a user was online."; }

    handle() {
        this.responds(/^online$/g, () => {
            this.reply(OnlineCommand.help);
        });

        this.responds(/^online <@(\d+)>$/g, (matches) => {
            let user = this.client.users.get('id', matches[1]);
            User.findOne({identifier: matches[1]}, (err, info) => {
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
                } else if (user.status === 'idle') {
                    if (info.lastAvailable === undefined) {
                        this.reply("I couldn't find status information on that user!");

                        return;
                    }

                    this.reply("The last time I saw that user available was: " + info.lastAvailable);

                    return;
                }

                this.reply("That user is currently online.");
            });
        });
    }
}

module.exports = OnlineCommand;