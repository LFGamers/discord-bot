const moment = require('moment');

const FORMAT = "dddd, MMMM Do YYYY, h:mm:ss a";

class ReminderManager {
    constructor(dispatcher, client, brain) {
        this.dispatcher = dispatcher;
        this.client     = client;
        this.brain      = brain;

        this.dispatcher.on('new_reminder', this.onNewReminder.bind(this));

        this.checkBrain();
        setInterval(this.checkBrain.bind(this), 1000 * 1);
    }

    onNewReminder(event) {
        this.brain.get('discord.reminders', (err, reply) => {
            let reminders = reply === null ? [] : JSON.parse(reply);
            reminders.push(event);
            this.brain.set('discord.reminders', JSON.stringify(reminders));
        });
    }

    checkBrain() {
        this.brain.get('discord.reminders', (err, reply) => {
            let reminders = reply === null ? [] : JSON.parse(reply);

            reminders.forEach((reminder, index) => {
                let now  = moment(),
                    date = moment(reminder.date * 1000);

                if (now.diff(date) >= 0) {
                    this.client.sendMessage(
                        this.client.users.get('id', reminder.user),
                        "Meep! Reminding you to `" + reminder.action + "`"
                    );
                    reminders.splice(index, 1);
                }
            });

            this.brain.set('discord.reminders', JSON.stringify(reminders));
        })

    }
}

module.exports = ReminderManager;
