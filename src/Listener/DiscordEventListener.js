class DiscordEventListener {
    constructor(client, server, channelName) {
        this.client      = client;
        this.server      = server;
        this.channelName = channelName;
    }

    listen() {
        this.channel = this.server.channels.get('name', this.channelName);
        if (this.channel === null || this.channel === undefined) {
            return this.client.createChannel(this.server, this.channelName, 'text', (error, channel) => {
                if (error) {
                    return console.log(`Could not create channel in ${this.server.name}: ${this.channelName}`);
                }

                this.addListeners();
            });
        }

        this.addListeners();
    }

    addListeners() {
        this.client.on('ready', client => this.logEvent('Bot is ready'));

        this.client.on('channelCreated', this.onChannel.bind(this, 'created'));
        this.client.on('channelDeleted', this.onChannel.bind(this, 'deleted'));
        this.client.on('channelUpdated', this.onChannel.bind(this, 'updated'));

        this.client.on('serverNewMember', this.onServerUser.bind(this, 'new'));
        this.client.on('serverMemberRemoved', this.onServerUser.bind(this, 'removed'));

        this.client.on('userBanned', this.onUser.bind(this, 'ban'));
        this.client.on('userUnbanned', this.onUser.bind(this, 'unban'));

        this.client.on('voiceJoin', this.onVoice.bind(this, 'voice_join'));
        this.client.on('voiceLeave', this.onVoice.bind(this, 'voice_leave'));

        this.client.on('presence', this.onUserPresence.bind(this));
    }

    logEvent(message) {
        this.client.sendMessage(this.channel, message);
    }

    onChannel(type, channel, updatedChannel) {
        if (channel.server === undefined) {
            return;
        }

        if (channel.server.id !== this.server.id) {
            return;
        }

        if (type !== 'updated') {
            return this.logEvent(`Channel ${type}: \`${channel.name}\``);
        }

        if (channel.name !== updatedChannel.name) {
            this.logEvent(`Channel name changed: \`${channel.name}\` -> \`${updatedChannel.name}\``);
        }
    }

    onServerUser(type, server, user) {
        if (server.id !== this.server.id) {
            return;
        }

        this.logEvent(`${user.username} has ${type === 'new' ? 'joined' : 'left'} the server.`);
    }

    onUser(type, user, server) {
        if (server.id !== this.server.id) {
            return;
        }

        this.logEvent(`${user.username} has been ${type}ned`);
    }

    onVoice(type, channel, user) {
        if (channel.server.id !== this.server.id) {
            return;
        }

        this.logEvent(
            `${user.username} has ${type === 'voice_join' ? 'joined' : 'left'} the voice channel:  ${channel.name}.`
        );
    }

    /**
     * @todo
     *      Add the users game to the list of games they play
     *      log on avatar change
     *
     * @param old
     * @param newUser
     */
    onUserPresence(old, newUser) {
        if (old.status !== newUser.status) {
            if (newUser.status === 'idle' || old.status === 'idle') {
                return;
            }

            let type = newUser.status === 'online' ? 'come online' : 'gone offline';

            return this.logEvent(`${user.username} has ${type}.`)
        }

        if (old.username !== newUser.username) {
            return this.logEvent(`${old.username} has changed their name to ${newUser.username}`);
        }

        if (old.avatar !== newUser.avatar) {
            return this.logEvent(`${newUser.username} has changed their avatar`);
        }
    }
}

module.exports = DiscordEventListener;