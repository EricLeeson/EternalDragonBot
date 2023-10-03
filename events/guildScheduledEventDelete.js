const dotenv = require('dotenv');
dotenv.config();

const { Events } = require('discord.js');

module.exports = {
    name : Events.GuildScheduledEventDelete,
    once: false,
    async execute(scheduledEvent) {
        try {
            console.log('hi');
        } catch (error) {
            console.error(error);
        }
    },
};