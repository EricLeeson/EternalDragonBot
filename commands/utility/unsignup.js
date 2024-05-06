const { Routes, SlashCommandBuilder } = require('discord.js');
const googleSheets = require('/Users/ericj/Documents/Co-opPrep/JavaScript/googleSheets.js');

module.exports = {
    cooldown: 30,
    data : new SlashCommandBuilder()
        .setName('unsignup')
        .setDescription('Unsigns you for a practice.')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for absence')
                .setRequired(true)),
    async execute(interaction) {
        const title = interaction.channel.name;
        if (isPaddler(interaction.member)) {
            if (!title.endsWith("ignup")) {
                await interaction.reply("This command can only be used in practice signup threads.");
            } else {
                const words = title.split(' ');
                const month = words[1];
                const date = words[2].substring(0, 1);
                const type = words[4];
                const count = await googleSheets.unsignup_member(interaction.member.nickname, month, date, type);

                const reason = interaction.options.getString('reason');
    
                await interaction.reply(`${interaction.member} unsigned from practice. Reason: "${reason}".\n**Current paddler count**: ${count}`);
            }
        }
    },
};

function isPaddler(member) {
    return member.roles.cache.has(process.env.PADDLER_ROLE_ID);
}