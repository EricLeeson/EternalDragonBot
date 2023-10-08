const dotenv = require("dotenv");
dotenv.config();

let cron = require('node-cron');
const createPractice = require('../createPractice');
const { waterPracticeAnnouncementDays, landPracticeAnnouncementDays } = require('../announcementDays')


const { Events } = require('discord.js');

module.exports = {
    name : Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}!`);
        //createPractice.execute(client, 'Water');
        cron.schedule(`0 0 * * ${waterPracticeAnnouncementDays}`, () => createPractice.execute(client, 'Water'));
        cron.schedule(`0 0 * * ${landPracticeAnnouncementDays}`, () => createPractice.execute(client, 'Land'));
    },
};