const dotenv = require("dotenv");
dotenv.config();

let cron = require('node-cron');
const createPractice = require('../createPractice');
const takeAttendance = require('../takeAttendance');
const googleSheets = require('../googleSheets');
const { waterPracticeAnnouncementDays, landPracticeAnnouncementDays } = require('../announcementDays')


const { Events } = require('discord.js');

module.exports = {
    name : Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}!`);
        cron.schedule(`0 0 * * ${waterPracticeAnnouncementDays}`, () => createPractice.execute(client, 'Water'));
        cron.schedule(`0 0 * * ${landPracticeAnnouncementDays}`, () => createPractice.execute(client, 'Land'));
        await setAttendanceTimers(client);
        //createPractice.execute(client, "Water");
        //await test(client, 11, 3);
    },
};

async function setAttendanceTimers(client) {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const scheduledEvents = await guild.scheduledEvents.cache.values();
    for (const event of scheduledEvents) {
        const attendanceTime = structuredClone(event.scheduledStartAt);
        attendanceTime.setHours(16, 0);
        const timer = attendanceTime - Date.now();
        //const timer = 1;
        if (timer > 0) setTimeout( () => takeAttendance.execute(event), timer);
    }
}

// async function test(client, month, date) {
//     const guild = await client.guilds.fetch(process.env.GUILD_ID);
//     const members = await guild.members.cache.values();
//     const names = [];
//     for (const member of members) {
//         if (isPaddler(member)) names.push(member.nickname);
//     }
//     const practiceDate = new Date();
//     practiceDate.setMonth(month);
//     practiceDate.setDate(date);
//     const event = {scheduledStartAt: practiceDate}

//     googleSheets.takeAttendance(names, event);
// }

// function isPaddler(member) {
//     return member.roles.cache.has(process.env.PADDLER_ROLE_ID);
// }