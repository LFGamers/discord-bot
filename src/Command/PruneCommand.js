const AbstractCommand = require('discord-bot-base').AbstractCommand;
const chalk           = require('chalk');

const MAX_ATTEMPTS = 5;
const DEFAULT_MESSAGES = 25;

class RestartCommand extends AbstractCommand {
    static get name() { return 'prune'; }

    static get description() { return "Prunes messages, Can be passed an amount, and also a user - Requires admin"; }

    handle() {
        if (this.client.admin === undefined) {
            return false;
        }

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

    deleteMessages(count, user, deleted, attempt) {
        let start = 0;
        if (deleted === undefined) {
            deleted = 0;
        }

        if (attempt === undefined) {
            attempt = 1;
        }

        if (attempt > MAX_ATTEMPTS) {
            return;
        }

        this.client.getChannelLogs(
            this.message.channel,
            500,
            {before: this.message.message},
            (error, messages) => {
                if (error) {
                    this.reply("There was an error pruning messages.");

                    return;
                }

                for (let index in messages) {
                    if (!messages.hasOwnProperty(index)) {
                        continue;
                    }

                    if (deleted > count) {
                        break;
                    }

                    let message = messages[index];
                    if (user === undefined || user.id === message.author.id) {
                        this.client.deleteMessage(message);
                        deleted++;
                        start++;
                    }
                }

                if (deleted < count) {
                    this.deleteMessages(count, user, deleted, start > 0 ? attempt++ : attempt);
                }
            }
        )
    }
}

module.exports = RestartCommand;