const AbstractCommand = require('discord-bot-base').AbstractCommand;
const _               = require('lodash');

class Over9000Command extends AbstractCommand {
    static get name() { return 'over9000'; }

    static get description() { return "Mention anything \`over 9000\` to get a response from Nappa."; }

    handle() {
        this.hears(/over 9000/i, () => {
            this.reply("WHAT?! NINE THOUSAND?!");
        });
    }
}

module.exports = Over9000Command;
