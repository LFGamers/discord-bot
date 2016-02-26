const AbstractCommand = require('discord-bot-base').AbstractCommand;
const chalk           = require('chalk');

const MAX_LENGTH       = 1000;
const DEFAULT_MESSAGES = 25;

class RestartCommand extends AbstractCommand {
    static get name() {
        return 'prune';
    }

    static get description() {
        return "Prunes messages, Can be passed an amount, and also a user - Requires admin";
    }

    handle() {
        this.responds(/^prune$/i, () => {
            if (this.message.isPm() || this.client.admin.id !== this.message.author.id) {
                return;
            }

            this.deleteMessages(DEFAULT_MESSAGES);
            this.client.deleteMessage(this.message.message);
        });

        this.responds(/^prune (\d+)$/i, (matches) => {
            if (this.message.isPm() || this.client.admin.id !== this.message.author.id) {
                return;
            }

            this.deleteMessages(matches[1]);
            this.client.deleteMessage(this.message.message);
        });

        this.responds(/^prune <@(\d+)>$/i, (matches) => {
            if (this.message.isPm() || this.client.admin.id !== this.message.author.id) {
                return;
            }

            let user = this.client.users.get('id', matches[1]);
            this.deleteMessages(DEFAULT_MESSAGES, user);
            this.client.deleteMessage(this.message.message);
        });

        this.responds(/^prune (\d+) <@(\d+)>$/i, (matches) => {
            if (this.message.isPm() || this.client.admin.id !== this.message.author.id) {
                return;
            }

            let user = this.client.users.get('id', matches[2]);
            this.deleteMessages(matches[1], user);
            this.client.deleteMessage(this.message.message);
        });

        this.responds(/^prune <@(\d+)> (\d+)$/i, (matches) => {
            if (this.message.isPm() || this.client.admin.id !== this.message.author.id) {
                return;
            }

            let user = this.client.users.get('id', matches[1]);
            this.deleteMessages(matches[2], user);
            this.client.deleteMessage(this.message.message);
        });
    }

    deleteMessages(count, user) {
        let start = 0,
            deleted = 0;

        this.container.get('helper.channel').getChannelLogs(this.message.channel, MAX_LENGTH)
            .then(logs => {
                for (let index in logs) {
                    if (!logs.hasOwnProperty(index)) {
                        continue;
                    }

                    if (deleted > count) {
                        break;
                    }

                    let message = logs[index];
                    if (user === undefined || user.id === message.author.id) {
                        this.client.deleteMessage(message);
                        deleted++;
                        start++;
                    }
                }

                this.reply(`Deleted ${deleted} messages of the last ${logs.length}.`, 0, 3000);
            })
            .catch(error => {
                this.logger.error(error);
                this.reply("There was an error pruning messages.");
            });
    }
}

module.exports = RestartCommand;