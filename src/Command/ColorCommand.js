const AbstractCommand = require('discord-bot-base').AbstractCommand;

class ColorCommand extends AbstractCommand {
    static get name() {
        return 'color';
    }

    static get description() {
        return "Changes the color of a roll";
    }

    handle() {
        if (this.message.server.owner.id !== this.message.author.id) {
            return false;
        }

        this.responds(/^color (.+)$/m, (matches) => {
            let roleName = matches[1],
                role     = this.message.server.roles.get('name', roleName);

            this.reply(`${role.name} has a color of: ${role.colorAsHex()}`);
        });

        this.responds(/^color (.+) #([A-Fa-f0-9]{6})$/m, (matches) => {
            let roleName = matches[1],
                color    = parseInt(matches[2], 16),
                role     = this.message.server.roles.get('name', roleName);

            this.client.deleteMessage(this.message.message);
            this.client.updateRole(role, {color: color}, (error, role) => {
                if (error) {
                    console.log(error);

                    return;
                }

                this.reply(
                    `Updating ${role.name} role to #${matches[2]}.`,
                    0,
                    3000
                );
            });
        });
    }
}

module.exports = ColorCommand;