const { Events, GuildScheduledEvent } = require('discord.js');

module.exports = {
    name : Events.GuildScheduledEventUserAdd,
    once: false,
    async execute(scheduledEvent, user) {
        const id = scheduledEvent.id;
        if (scheduledEvent.description.endsWith('Practice')) {
            try {
                console.log('+1');
            } catch (error) {
                console.error(error);
            }
        }
        try {
            console.log('+1');
        } catch (error) {
            console.error(error);
        }
    },
};