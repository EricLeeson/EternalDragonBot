const { Events, GuildScheduledEvent } = require('discord.js');

module.exports = {
    name : Events.GuildScheduledEventUserAdd,
    once: false,
    async execute(scheduledEvent, user) {
        const id = scheduledEvent.id;
        if (scheduledEvent.description.includes('Practice')) {
            try {
                console.log(`${user.username} is interested`);
            } catch (error) {
                console.error(error);
            }
        }
    },
};