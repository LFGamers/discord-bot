const AbstractCommand = require('discord-bot-base').AbstractCommand;

class ColorCommand extends AbstractCommand {
    static get name() {
        return 'color';
    }

    static get description() {
        return "Changes the color of a roll";
    }

    handle() {
        if (!this.isOwner() && !this.isAdmin()) {
            return false;
        }

        this.responds(/^color ([\w\s]+)$/m, (matches) => {
            let role = this.server.roles.get('name', matches[1]);

            if (!role) {
                return this.reply('Role not found.', 0, 3000);
            }

            this.reply(`${role.name} has a color of: ${role.colorAsHex()}`);
        });

        this.responds(/^color ([\w\s]+) #([A-Fa-f0-9]{6})$/m, (matches) => {
            let role = this.server.roles.get('name', matches[1]);

            if (!role) {
                return this.reply('Role not found.', 0, 3000);
            }

            this.client.deleteMessage(this.message);
            this.client.updateRole(role, {color: parseInt(matches[2], 16)}, (error, role) => {
                if (error) {
                    this.reply("Failed to update role color.");

                    return this.logger.log(error);
                }

                this.reply(
                    `Updating ${role.name} role to #${role.colorAsHex()}.`,
                    0,
                    3000
                );
            });
        });
    }
}

module.exports = ColorCommand;