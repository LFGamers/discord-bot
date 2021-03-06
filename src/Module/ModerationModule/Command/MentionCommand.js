const AbstractCommand = require('discord-bot-base').AbstractCommand,
      moment          = require('moment');

const MAX_MENTIONS = 200;

class MentionsCommand extends AbstractCommand {
    static get name() {
        return 'mentions';
    }

    static get description() {
        return "Lets users see what their most recent mentions are. ";
    }

    handle() {
        this.brain = this.container.get('brain.redis');

        this.hears(/<@(\d+)>/m, () => {
            this.mentions.forEach((mention) => {
                this.brain.get('discord.mentions.' + mention.id, (err, reply) => {
                    let mentions      = reply === null ? [] : JSON.parse(reply);
                    mention.author    = this.author.id;
                    mention.content   = this.rawContent;
                    mention.timestamp = moment().unix();
                    mentions.push(mention);
                    if (mentions.length > MAX_MENTIONS) {
                        mentions.shift();
                    }

                    this.brain.set('discord.mentions.' + mention.id, JSON.stringify(mentions));
                });
            });

            return false;
        });

        this.responds(/^mentions ?(\d+)?$/m, (matches) => {
            let count = matches[1] === undefined ? 5 : matches[1];
            if (count > MAX_MENTIONS) {
                count = MAX_MENTIONS;
            }

            this.brain.get('discord.mentions.' + this.author.id, (err, reply) => {
                let mentions = reply === null ? [] : JSON.parse(reply);

                mentions.reverse();

                let message = `Here are your last ${count > mentions.length ? mentions.length : count} mentions:`;
                for (let i = 0; i < count; i++) {
                    let mention = mentions[i];
                    if (mention === undefined) {
                        continue;
                    }

                    let author  = this.client.users.get('id', mention.author),
                        content = mention.content,
                        date    = moment.unix(mention.timestamp).format('MM/DD/YY h:mm:ssa');

                    message += `\n\n[${date}] ${author.mention()}: ${mention.content}`;
                }

                this.sendMessage(this.author, message);

                if (!this.isPm()) {
                    this.reply("I've PMed you your recent mentions.");
                }
            });
        });
    }
}

module.exports = MentionsCommand;