const dotenv = require('dotenv');
dotenv.config();

const { Events, GuildScheduledEvent, GuildScheduledEventManager } = require('discord.js');

module.exports = {
    name : Events.GuildScheduledEventUserRemove,
    once: false,
    async execute(scheduledEvent, user) {
        if (scheduledEvent.description.includes('Practice')) {
            try {
                const client = scheduledEvent.client;
                const logChannel = await client.channels.cache.get(process.env.LOGS_CHANNEL_ID);
                const guild = await client.guilds.cache.get(process.env.GUILD_ID);
                const member = await guild.members.cache.get(user.id);
                const practiceType = (scheduledEvent.description.endsWith('Water Practice!')) ? 'Water' : 'Land';
                await logChannel.send(`${member.nickname} unsigned up from ${practiceType} Practice. (${scheduledEvent.id})`);
            } catch (error) {
                console.error(error);
            }
        }
    }
}