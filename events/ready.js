const dotenv = require("dotenv");
dotenv.config();
let cron = require('node-cron');

const { Events } = require('discord.js');

function getDate(type) {
    const practiceTime = new Date();
    practiceTime.setDate(practiceTime.getDate() + 1);
    if (type === 'start') {
        practiceTime.setHours(16);
        practiceTime.setMinutes(30);
    } else if (type === 'end') {
        practiceTime.setHours(18);
    }
    return practiceTime;
}

async function makePractice(client, practiceType) {
    console.log('wut');
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    console.log('wut');

    const name = `${practiceType} Practice`;
    const scheduledStartTime = getDate('start');
    const scheduledEndTime = getDate('end');
    const description = `${practiceType} Practice`;
    const entityMetadata = {location : '1 Athletes Way'};
    await guild.scheduledEvents.create({
        name,
        scheduledStartTime,
        scheduledEndTime,
        privacyLevel : 2,
        entityType : 3,
        description,
        entityMetadata
    });
}

const WEEKDAYS = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ');

function getAnnouncementDays(days) {
    const announcementDays = [];
    for (let i = 0; i < days.length; i++) {
        announcementDays.push( (WEEKDAYS.indexOf(days[i]) + 6) % 7 );
    }
    return announcementDays.toString();
}

const waterPracticeAnnouncementDays = getAnnouncementDays(['Monday', 'Friday']);
const landPracticeAnnouncementDays = getAnnouncementDays(['Tuesday']);

module.exports = {
    name : Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}!`);
        cron.schedule(`* * * * ${waterPracticeAnnouncementDays}`, () => makePractice(client, 'water'));
        cron.schedule(`* * * * ${landPracticeAnnouncementDays}`, () => makePractice(client, 'land'));
    },
};