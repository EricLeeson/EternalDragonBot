const dotenv = require('dotenv');
dotenv.config();

const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name : Events.GuildScheduledEventCreate,
    once: false,
    async execute(scheduledEvent) {
        if (scheduledEvent.name.includes('Practice')) {
            const practiceAnnouncement = getPracticeAnnouncementMessage(scheduledEvent);
            const announcementChannel = scheduledEvent.client.channels.cache.get(process.env.ANNOUNCEMENT_CHANNEL_ID);
            try {
                await announcementChannel.send(practiceAnnouncement);
                console.log('New practice successfully created.');
            } catch (error) {
                console.error(error);
            }
        }
    },
};

function getPracticeAnnouncementMessage(scheduledEvent) {
    const ANNOUNCEMENT = `<@&${process.env.PADDLER_ROLE_ID}> Sign-up for ${scheduledEvent.name} is now up!\n\n[**Let us know you're coming by clicking you're interested!**](${scheduledEvent.url})`;
    return ANNOUNCEMENT;
}