const { Events, GuildScheduledEvent } = require('discord.js');
const googleSheets = require('../googleSheets');

module.exports = {
    name : Events.GuildScheduledEventUserAdd,
    once: false,
    async execute(scheduledEvent, user) {
        const id = scheduledEvent.id;
        if (scheduledEvent.description.includes('Practice')) {
            try {
                const subs = await scheduledEvent.fetchSubscribers({withMember : true});
                const nicknames = getNicknames(subs);
                googleSheets.takeAttendance(nicknames);
            } catch (error) {
                console.error(error);
            }
        }
    },
};

function getNicknames(subs) {
    const users = subs.toJSON();
    const nicknames = [];
    for (let i = 0; i < users.length; i++) {
        nicknames[i] = users[i].member.nickname;
    }
    return nicknames;
}