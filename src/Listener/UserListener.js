const _      = require('lodash');
const moment = require('moment');

class UserListener {
    constructor(client, brain) {
        this.client = client;
        this.brain  = brain;
    }

    listen() {
        this.client.on('userUpdated', this.onUserUpdate.bind(this));
        this.client.on('presence', this.onUserPresence.bind(this));

        this.client.users.forEach((user) => { this.onUserUpdate(user, user); });
    }

    onUserUpdate(original, changed) {
        let key = 'discord.user.' + original.id;
        this.brain.get(key, (error, reply) => {
            let user = reply === null ? {} : JSON.parse(reply);

            if (user.usernames === undefined) {
                user.usernames = [];
            }

            user.usernames.push(changed.username);
            user.usernames = _.unique(user.usernames);

            this.brain.set(key, JSON.stringify(user));
        })
    }

    onUserPresence(user, status, game) {
        let key = 'discord.user.' + user.id;
        this.brain.get(key, (error, reply) => {
            let user = reply === null ? {} : JSON.parse(reply);

            user.status = status;
            if (status === 'offline') {
                user.lastOnline = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
            } else {
                user.lastOnline = undefined;
            }

            if (user.games === undefined) {
                user.games = [];
            }

            user.games.push(
                {
                    game: game,
                    date: moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
                }
            );

            this.brain.set(key, JSON.stringify(user));
        });
    }
}

module.exports = UserListener;