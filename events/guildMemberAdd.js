const { Events, GuildScheduledEvent } = require('discord.js');

module.exports = {
    name : Events.GuildMemberAdd,
    once: false,
    async execute(member) {
    try {
        console.log(`${user.username} is interested`);
    } catch (error) {
        console.error(error);
        }
    }
};