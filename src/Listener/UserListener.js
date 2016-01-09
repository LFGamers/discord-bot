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

        this.client.users.forEach((user) => {
            this.onUserUpdate(user, user);
            this.onUserPresence(user, user.status, user.gameID);
        });
    }

    onUserUpdate(original, changed) {
        User.findOne({identifier: original.id}, (err, user) => {
            if (user === null || user === undefined) {
                user = new User({identifier: original.id});
            }

            if (user.names === undefined) {
                user.names = [];
            }

            user.names.push(changed.username);
            user.names = _.unique(user.names);

            user.save();
        });
    }

    onUserPresence(user, status, game) {
        let id = user.id

        User.findOne({identifier: id}, (err, user) => {
            if (user === null || user === undefined) {
                user = new User({identifier: id});
            }

            user.status = status;
            if (status === 'offline') {
                user.lastOnline    = moment().tz("America/Los_Angeles").format('dddd, MMMM Do YYYY, h:mm:ss a') + ' PST';
                user.lastAvailable = moment().tz("America/Los_Angeles").format('dddd, MMMM Do YYYY, h:mm:ss a') + ' PST';
            } else if (status === 'idle') {
                user.lastAvailable = moment().tz("America/Los_Angeles").format('dddd, MMMM Do YYYY, h:mm:ss a') + ' PST';
                user.lastOnline    = undefined;
            } else {
                user.lastOnline    = undefined;
                user.lastAvailable = undefined;
            }

            if (user.games === undefined) {
                user.games = [];
            }

            if (game !== null && game !== undefined) {
                user.games.push(
                    {
                        game: String(game),
                        date: moment().tz("America/Los_Angeles").format('dddd, MMMM Do YYYY, h:mm:ss a') + ' PST'
                    }
                );
            }

            user.save();
        });
    }
}

module.exports = UserListener;