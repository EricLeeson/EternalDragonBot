const dotenv = require('dotenv');
dotenv.config();

const { Events } = require('discord.js');

module.exports = {
    name : Events.GuildScheduledEventCreate,
    once: true,
    async execute(scheduledEvent) {
        console.log('waddup');
        if (scheduledEvent.name.includes('Practice')) {
            const practiceAnnouncement = getPracticeAnnouncementMessage(scheduledEvent);
            const announcementChannel = scheduledEvent.client.channels.cache.get(process.env.ANNOUNCEMENT_CHANNEL_ID);

            try {
                await announcementChannel.send(practiceAnnouncement);
            } catch (error) {
                console.error(error);
            }
        }
    },
};

function getPracticeAnnouncementMessage(scheduledEvent) {
    const ANNOUNCEMENT = `${process.env.PADDLER_ROLE_ID} Sign-up for ${scheduledEvent.name} is now up!\n\nLet us know you're coming by responding to the event on the top left corner of the server.`;
    return ANNOUNCEMENT;
}