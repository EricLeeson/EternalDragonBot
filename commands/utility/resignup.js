const { Routes, SlashCommandBuilder } = require('discord.js');
const googleSheets = require('/Users/ericj/Documents/Co-opPrep/JavaScript/googleSheets.js');

module.exports = {
    cooldown: 30,
    data : new SlashCommandBuilder()
        .setName('resignup')
        .setDescription('Re-signs you for a practice.'),
    async execute(interaction) {
        const title = interaction.channel.name;
        if (isPaddler(interaction.member)) {
            if (!title.endsWith("ignup")) {
                await interaction.reply("This command can only be used in practice signup threads.");
            } else {
                const words = title.split(' ');
                const month = words[1];
                const date = words[2].substring(0, words[2].length - 1);
                const type = words[4];
                const count = await googleSheets.resignup_member(interaction.member.nickname, month, date, type);
    
                await interaction.reply(`${interaction.member} re-signed up from practice.\n**Current paddler count**: ${count}`);
            }
        }
    },
};

function isPaddler(member) {
    return member.roles.cache.has(process.env.PADDLER_ROLE_ID);
}