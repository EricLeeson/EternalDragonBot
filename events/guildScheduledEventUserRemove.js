const { Events } = require('discord.js');

module.exports = {
    name : Events.GuildScheduledEventUserRemove,
    once: false,
    async execute(scheduledEvent, user) {
        // Commented out due to current bug
        // const id = scheduledEvent.id;
        // const event = await scheduledEvent.guild.scheduledEvents.fetch( {guildScheduledEvent : id, force: true} );
        // if (event.name.endsWith('Practice')) {
        //     try {
        //         await console.log('-1');
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
        try {
            await console.log('-1');
        } catch (error) {
            console.error(error);
        }
    },
};