const dotenv = require('dotenv');
dotenv.config();

const { ChannelType } = require('discord.js');

async function execute(member, channel) {
    const name = member.user.username;
    const inviteMessage = await getInviteMessage(member);
    const thread = await channel.threads.create({
        name,
        type: ChannelType.PrivateThread,
        invitable: false,
    })
    await thread.send(inviteMessage);
}

module.exports = {
    execute
}

async function getInviteMessage(member) {
    const coachRoleId = await member.guild.roles.fetch(process.env.COACH_ROLE_ID);
    const memberId = member.id;
    const dragonboatMamaId = await member.guild.roles.fetch(process.env.DRAGON_BOAT_MAMA_ROLE_ID);
    const teacherSponsorRoleId = await member.guild.roles.fetch(process.env.TEACHER_SPONSOR_ROLE_ID);
    return `${coachRoleId} ${dragonboatMamaId} ${teacherSponsorRoleId}\n\nHey <@${memberId}>, welcome to the Eternal Dragon 2023-24 Discord server! If you ever want to contact the coaches, just send a message to this thread.\n\n**Get started by telling us your full name to get complete access to the server!**`;
}