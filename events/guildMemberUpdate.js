const dotenv = require('dotenv');
dotenv.config;

const { Events, ChannelType } = require('discord.js');
const createPrivateThread = require('../createPrivateThread');
const googleSheets = require('../googleSheets');
const { google } = require('googleapis');

module.exports = {
    name : Events.GuildMemberUpdate,
    once: false,
    async execute(oldMember, newMember) {
        const isPaddler = newMember.roles.cache.has(process.env.PADDLER_ROLE_ID);
        const hasNoRoles = newMember.roles.cache.size == 1;
        const hadNoRoles = oldMember.roles.cache.size == 1;
        try {
            if (oldMember.nickname != newMember.nickname) {
                if (hasNoRoles) {
                    const paddlerRole = await newMember.guild.roles.fetch(process.env.PADDLER_ROLE_ID);
                    await newMember.roles.add(paddlerRole);
                    const channel = await newMember.guild.channels.fetch(process.env.THREADS_CHANNEL_ID);
                    const threadName = oldMember.nickname || oldMember.user.username;
                    const threadCollection = await channel.threads.fetchActive();
                    const thread = threadCollection.threads.find(x => x.name === threadName);
                    await thread.edit({name : newMember.nickname});
                    googleSheets.createNewNameRow(newMember.nickname);
                }
                if (!hadNoRoles && isPaddler) {
                    const channel = await newMember.guild.channels.fetch(process.env.THREADS_CHANNEL_ID);
                    const threadName = oldMember.nickname || newMember.user.username;
                    const thread = await channel.threads.cache.find(x => x.name === threadName);
                    await thread.edit({name : newMember.nickname});
                    googleSheets.updateName(oldMember.nickname, newMember.nickname);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
};