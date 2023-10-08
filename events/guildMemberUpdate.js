const dotenv = require('dotenv');
dotenv.config;

const { Events, ChannelType } = require('discord.js');
const createPrivateThread = require('../createPrivateThread');

module.exports = {
    name : Events.GuildMemberUpdate,
    once: false,
    async execute(oldMember, newMember) {
        const channel = await newMember.guild.channels.fetch(process.env.THREADS_CHANNEL_ID);
        const isPaddler = newMember.roles.cache.has(process.env.PADDLER_ROLE_ID);
        if (!isPaddler) {
            if (oldMember.nickname != newMember.nickname) {
                try {
                    const role = await newMember.guild.roles.fetch(process.env.PADDLER_ROLE_ID);

                    await newMember.roles.add(role);

                    createPrivateThread.execute(newMember, channel);

                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
};