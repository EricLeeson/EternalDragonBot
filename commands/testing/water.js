const { SlashCommandBuilder } = require('discord.js');
const cron = require('cron');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('water')
        .setDescription('Creates a new Water Practice Scheduled Event.'),
    async execute(interaction) {
        const guild = await interaction.guild;
        const scheduledStartTime = new Date('October 2, 2023, 12:00:00');
        const scheduledEndTime = new Date('October 2, 2023, 14:00:00');
        const description = 'Water Practice';
        const entityMetaData = {location : '1 Athletes Way'};
        await guild.scheduledEvents.create({
            name: 'Water Practice',
            scheduledStartTime,
            scheduledEndTime,
            privacyLevel : 2,
            entityType : 3,
            description,
            entityMetaData
        });
    },
};