const dotenv = require('dotenv');
dotenv.config;

const { Events, ChannelType } = require('discord.js');
const createPrivateThread = require('../createPrivateThread');

module.exports = {
    name : Events.GuildMemberAdd,
    once: false,
    async execute(member) {
        const channel = await member.guild.channels.fetch(process.env.THREADS_CHANNEL_ID);
        try {
            console.log(`${member.user.username} is interested`);
            createPrivateThread.execute(member, channel);
        } catch (error) {
            console.error(error);
        }
    }
};