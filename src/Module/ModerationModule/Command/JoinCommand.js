const AbstractCommand = require('discord-bot-base').AbstractCommand;

class JoinCommand extends AbstractCommand {
    static get name() {
        return 'join';
    }

    static get description() {
        return "Joins the given server";
    }

    handle() {
        this.responds(
            /^join (?:(?:https?:\/\/)?(?:discord.gg|discordapp.com\/invite)\/)?([A-Za-z0-9-]+)$/m,
            (matches) => {
                let invite = matches[1];

                this.client.joinServer(invite, (error, server) => {
                    if (error) {
                        return this.reply("Couldn't join that server.");
                    }

                    let prefix = this.container.getParameter('prefix');
                    this.reply("Server joined.");
                    this.sendMessage(
                        server,
                        `I was invited by ${this.author.mention()}. Type \`${prefix}help\` to see what i do`
                    );
                });
            }
        );
    }
}

module.exports = JoinCommand;
