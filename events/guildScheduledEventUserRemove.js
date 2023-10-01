const { Events } = require('discord.js');

module.exports = {
    name : Events.GuildScheduledEventUserRemove,
    once: false,
    async execute(scheduledEvent, user) {
        const id = scheduledEvent.id;
        if (scheduledEvent.description.endsWith('Practice')) {
            try {
                await console.log('-1');
            } catch (error) {
                console.error(error);
            }
        }
        try {
            await console.log('-1');
        } catch (error) {
            console.error(error);
        }
    },
};