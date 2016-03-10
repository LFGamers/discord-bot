const AbstractCommand = require('discord-bot-base').AbstractCommand,
      _               = require('lodash');

const PLUS_MESSAGES = [
    'has pleased the gods!',
    'is in good favor!',
    'is ascending!',
    'is doing good things!',
    'leveled up!',
    'is on the rise!',
    '+1!'
];

const NEGATIVE_MESSAGE = [
    'has upset the gods!',
    'is in poor favor!',
    'is descending!',
    'is doing bad things...',
    'took a hit! Ouch.',
    'lost a level.',
    'lost a life.',
    'took a dive.',
    '-1!'
];

class KarmaCommand extends AbstractCommand {
    static get name() {
        return 'karma';
    }

    static get description() {
        return "Manages Karma";
    }

    static get help() {
        return `Mention a user, and place \`++\` or \`--\` after, to give or remove karma from a user.

You can also type, \`karma top [amount]\` to see the top karma users, and \`karma bottom [amount]\` to see the bottom.

If you are the server owner, you can run \`karma clear\` to clear the karma.`
    }

    handle() {
        this.brain = this.container.get('brain.redis');

        this.responds(/^karma$/, () => {
            this.reply(KarmaCommand.help);
        });

        this.responds(/^karma clear$/, () => {
            if (this.isPm()) {
                return this.reply('This has to be ran in a server');
            }

            if (!this.isOwner()) {
                return false;
            }

            this.brain.set('discord.karma.' + this.server.id, JSON.stringify([]));
            this.reply('Karma has been cleared');
        });

        this.responds(/^karma clean$/, () => {
            if (this.isPm()) {
                return this.reply('This has to be ran in a server');
            }

            this.brain.get('discord.karma.' + this.server.id, (err, reply) => {
                let karma    = reply === null ? [] : JSON.parse(reply),
                    newKarma = [];

                karma.forEach((info) => {
                    let user = this.client.users.get('id', info.user_id);
                    if (user !== null && user !== undefined) {
                        newKarma.push(info);
                    }
                });

                this.brain.set('discord.karma.' + this.server.id, JSON.stringify(newKarma));
                this.reply("Karma has been cleaned up");
            });
        });

        this.responds(/^karma (top|best|bottom|worst)[\s]?(\d+)?$/, (matches) => {
            if (this.isPm()) {
                return this.reply('This has to be ran in a server');
            }

            this.brain.get('discord.karma.' + this.server.id, (err, reply) => {
                let karma  = reply === null ? [] : JSON.parse(reply),
                    amount = matches[2] === undefined ? 5 : matches[2];

                if (matches[1] === 'top' || matches[1] === 'best') {
                    karma.sort((a, b) => {
                        return Number(b.karma) - Number(a.karma);
                    });
                } else {
                    karma.sort((a, b) => {
                        return Number(a.karma) - Number(b.karma);
                    });
                }

                let message = `The current ${matches[1]} karma: \n\n`;
                for (let i = 0; i < amount; i++) {
                    if (karma[i] === undefined) {
                        continue;
                    }

                    let info = karma[i],
                        user = this.client.users.get('id', info.user_id);

                    message += `${i + 1}) ${user.mention()} - ${info.karma}\n`;
                }

                this.reply(message);
            });
        });

        this.hears(/^<@(\d+)>[\s+]?(\+\+|\-\-)$/g, (matches) => {
            if (this.isPm()) {
                return this.reply('This has to be ran in a server');
            }

            let throttleKey = this.author.id + ":" + this.mentions[0].id;
            if (this.isThrottled('karma:' + throttleKey, 5)) {
                return false;
            }

            let selfKarma = false;
            if (this.author.id === this.mentions[0].id && matches[2] === '++') {
                this.reply("You can't karma yourself. You get negative karma.");
                matches[2] = '--';
                selfKarma  = true;
            }

            let message = _.sample(matches[2] === '++' ? PLUS_MESSAGES : NEGATIVE_MESSAGE);

            this.brain.get('discord.karma.' + this.server.id, (err, reply) => {
                let karma = reply === null ? [] : JSON.parse(reply),
                    index = this.findKarma(karma, this.mentions[0].id);

                if (index === -1) {
                    karma.push({user_id: this.mentions[0].id, karma: 0});
                    index = karma.length - 1;
                }

                karma[index].karma += matches[2] === '++' ? 1 : -1;

                this.brain.set('discord.karma.' + this.server.id, JSON.stringify(karma));
                this.reply(
                    this.mentions[0].mention() + ' ' + message + " (Karma: " + karma[index].karma + ")",
                    selfKarma ? 500 : 0
                );
            });
        });
    }

    findKarma(karma, id) {
        for (let index in karma) {
            if (!karma.hasOwnProperty(index)) {
                continue;
            }

            if (karma[index].user_id == id) {
                return index;
            }
        }

        return -1;
    }
}

module.exports = KarmaCommand;