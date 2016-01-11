'use strict';

const AbstractCommand = require('./AbstractCommand');
const chalk           = require('chalk');
const _               = require('lodash');

const User = require('../Model/User');

class LfgCommand extends AbstractCommand {
    static get name() { return 'lfg'; }

    static get description() { return "Lets you find out gamer information for a user"; }

    static get help() { return `Type \`lfg <user>\` to get gamer information about \`user\`. To set your information, pm me with lfg help`; }

    handle() {
        this.responds(/^lfg$/, () => {
            this.reply(LfgCommand.help);
        });

        this.responds(/^lfg <@(\d+)>$/, (matches) => {
            this.getUser(this.message.mentions[0], (user) => {
                let message = `User information about: ${this.message.mentions[0].mention()}\n`;

                if (user.platforms.length > 0) {
                    message += `\nNetwork Names:`;
                    user.platforms.forEach((platform) => {
                        let name = platform.name.replace('`', '\\`');

                        message += `\n\t${toTitleCase(platform.platform)}: \`${name}\``;
                    });
                }

                if (this.message.pm) {
                    this.reply(message);
                } else {
                    this.sendMessage(this.message.channel, message);
                }
            })
        });

        this.responds(/^lfg help(?: set)?/, () => {
            if (!this.message.pm) {
                this.reply("PM me this request please.");

                return;
            }

            this.reply(
                `To set your information, use the commands below:\n\n\`\`\`
- lfg set <platform> <name>
    Allowed platforms: (battlenet, twitch, steam, uplay, origin, xbl, and psn)
- lfg unset <platform> <name>
    Allowed platforms: (battlenet, twitch, steam, uplay, origin, xbl, and psn)
\`\`\``
            );
        });

        this.responds(/^(lfg )(.+)$/gmi, (matches) => {
            this.message.message.content = this.message.rawContent.replace(matches[1], '');

            this.responds(
                /^set (battlenet|battle|battletag|twitch|steam|uplay|origin|xbl|psn|xbox|playstation) (.*)/i,
                (matches) => {
                    if (!this.message.pm) {
                        this.client.deleteMessage(this.message.message);
                        this.reply("PM me this request please.");

                        return;
                    }

                    let platform = matches[1],
                        name     = matches[2];

                    if (['battle', 'battletag'].indexOf(platform) !== -1) {
                        platform = 'battlenet';
                    }

                    if (platform === 'xbox') {
                        platform = 'xbl';
                    }

                    if (platform === 'playstation') {
                        platform = 'psn';
                    }

                    console.log("Setting " + platform + ' to `' + name + '`.');

                    this.getUser(this.message.author, (user) => {
                        user.platforms.push({platform: platform, name: name});
                        user.save((err, user) => {
                            console.log(err, user);
                            this.reply("I've saved your information.");
                        });
                    });
                }
            );

            this.responds(
                /^unset (battlenet|battle|battletag|twitch|steam|uplay|origin|xbl|psn|xbox|playstation) (.*)/i,
                (matches) => {
                    if (!this.message.pm) {
                        this.client.deleteMessage(this.message.message);
                        this.reply("PM me this request please.");

                        return;
                    }

                    let platform = matches[1],
                        name     = matches[2];

                    if (['battle', 'battletag'].indexOf(platform) !== -1) {
                        platform = 'battlenet';
                    }

                    if (platform === 'xbox') {
                        platform = 'xbl';
                    }

                    if (platform === 'playstation') {
                        platform = 'psn';
                    }

                    console.log("Unsetting " + platform + ' to `' + name + '`.');

                    this.getUser(this.message.author, (user) => {
                        user.platforms.forEach((p, index) => {
                            if (p.platform == platform && p.name == name) {
                                user.platforms.splice(index, 1);
                            }
                        });
                        user.save((err, user) => {
                            this.reply("I've saved your information.");
                        });
                    });
                }
            );
        }, true);
    }

    getUser(user, callback) {
        User.findOne({identifier: user.id}, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }

            if (result === null) {
                result = new User({identifier: user.id});
                result.save((err, result) => {
                    if (err) return console.error(err);

                    return callback(result);
                });

                return;
            }

            return callback(result);
        });
    }
}

module.exports = LfgCommand;