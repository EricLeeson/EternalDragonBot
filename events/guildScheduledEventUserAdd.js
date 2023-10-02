const { Events, GuildScheduledEvent } = require('discord.js');

module.exports = {
    name : Events.GuildScheduledEventUserAdd,
    once: false,
    async execute(scheduledEvent, user) {
        const guild = await scheduledEvent.guild;
        const scheduledStartTime = new Date('October 1, 2023, 12:00:00');
        const scheduledEndTime = new Date('October 1, 2023, 14:00:00');
        const description = 'Water Practice';
        const entityMetadata = {location : '1 Athletes Way'};
        await guild.scheduledEvents.create({
            name: 'Water Practice',
            scheduledStartTime,
            scheduledEndTime,
            privacyLevel : 2,
            entityType : 3,
            description,
            entityMetadata
        });
        const id = scheduledEvent.id;
        if (scheduledEvent.description.endsWith('Practice')) {
            try {
                console.log('+1');
            } catch (error) {
                console.error(error);
            }
        }
    },
};