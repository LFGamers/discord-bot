const _      = require('lodash');
const moment = require('moment');

const User = require('../Model/User');

class UserListener {
    constructor(client) {
        this.client = client;
    }

    listen() {
        this.client.on('userUpdated', this.onUserUpdate.bind(this));
        this.client.on('presence', this.onUserPresence.bind(this));

        this.client.users.forEach((user) => { this.onUserUpdate(user, user); });
    }

    onUserUpdate(original, changed) {
        User.findOne({identifier: original.id}, (err, user) => {
            if (user === null) {
                user = new User({identifier: original.id});
            }

            user.names.push(changed.username);
            user.names = _.unique(user.names);

            user.save();
        });
    }

    onUserPresence(user, status, game) {
        User.findOne({identifier: user.id}, (err, user) => {

            user.status = status;
            if (status === 'offline') {
                user.lastOnline    = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
                user.lastAvailable = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
            } else if (status === 'idle') {
                user.lastAvailable = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
                user.lastOnline    = undefined;
            } else {
                user.lastOnline    = undefined;
                user.lastAvailable = undefined;
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

            user.save();
        });
    }
}

module.exports = UserListener;