const AbstractCommand = require('./AbstractCommand');
const chalk           = require('chalk');
const _               = require('lodash');
const moment          = require('moment');
const juration        = require('juration');

class RemindCommand extends AbstractCommand {
    static get name() { return 'remind'; }

    static get description() { return "Lets users be reminded of things"; }

    static get help() {
        return `Type remind or remind me with what you want to be reminded with.\n
        \`\`\`$remind me in 50 minutes to check the news\`\`\``;
    }

    handle() {
        this.responds(/^remind( me)?$/, () => {
            this.reply(RemindCommand.help);
        });
        this.responds(/^remind(?: me)? (in|on|to) (.+?) (in|on|to) (.+?)$/m, (matches) => {
            try {
                let type, date, action;
                if (matches[1] === 'in') {
                    date   = moment().add(moment.duration(juration.parse(matches[2]), 'seconds'));
                    action = matches[4];
                } else if (matches[1] === 'on') {
                    date   = moment(matches[2]);
                    action = matches[4];
                } else {
                    action = matches[2];
                    if (matches[3] === 'in') {
                        date = moment().add(moment.duration(juration.parse(matches[4]), 'seconds'));
                    } else {
                        date = moment(matches[4]);
                    }
                }

                this.reply("Alright, I'll remind you.");

                this.dispatcher.emit('new_reminder', {action: action, date: date.unix(), user: this.message.author.id});
            } catch (e) {
                this.reply("Sorry, I couldn't understand your reminder");

                return false;
            }
        });
    }
}

module.exports = RemindCommand;