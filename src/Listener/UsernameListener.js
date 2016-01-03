const _ = require('lodash');

class UsernameListener {
    constructor(client, brain) {
        this.client = client;
        this.brain  = brain;
    }

    listen() {
        this.client.on('userUpdated', this.onUserUpdate.bind(this));

        this.client.users.forEach((user) => { this.onUserUpdate(user, user); });
    }

    onUserUpdate(original, changed) {
        let key = 'discord.username.' + original.id;
        this.brain.get(key, (error, reply) => {
            let usernames = reply === null ? [] : JSON.parse(reply);
            usernames.push(changed.username);
            this.brain.set(key, JSON.stringify(_.unique(usernames)));
        })
    }
}

module.exports = UsernameListener;