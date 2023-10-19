const dotenv = require("dotenv");
dotenv.config();

let cron = require('node-cron');
const createPractice = require('../createPractice');
const takeAttendance = require('../takeAttendance');
const { waterPracticeAnnouncementDays, landPracticeAnnouncementDays } = require('../announcementDays')


const { Events } = require('discord.js');

module.exports = {
    name : Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}!`);
        cron.schedule(`0 0 * * ${waterPracticeAnnouncementDays}`, () => createPractice.execute(client, 'Water'));
        cron.schedule(`0 0 * * ${landPracticeAnnouncementDays}`, () => createPractice.execute(client, 'Land'));
        setAttendanceTimers(client);
    },
};

async function setAttendanceTimers(client) {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const scheduledEvents = await guild.scheduledEvents.cache;
    for (const event of scheduledEvents.values()) {
        const attendanceTime = event.scheduledStartAt;
        attendanceTime.setHours(16, 0);
        const timer = attendanceTime - Date.now();
        if (timer > 0) setTimeout( () => takeAttendance.execute(event), timer);
    }
}