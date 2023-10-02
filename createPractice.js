const dotenv = require('dotenv');
dotenv.config();

function getDate(type) {
    const practiceTime = new Date();
    practiceTime.setDate(practiceTime.getDate() + 1);
    if (type === 'start') {
        practiceTime.setHours(16);
        practiceTime.setMinutes(30);
    } else if (type === 'end') {
        practiceTime.setHours(18);
    }
    return practiceTime;
}

async function execute(client, practiceType) {
    console.log('wut');
    const guild = await client.channels.cache.get(process.env.GUILD_ID);
    
    const name = `${practiceType} Practice`;
    const scheduledStartTime = getDate('start');
    const scheduledEndTime = getDate('end');
    const description = `${practiceType} Practice`;
    const entityMetaData = {location : '1 Athletes Way'};
    await guild.scheduledEvents.create({
        name,
        scheduledStartTime,
        scheduledEndTime,
        privacyLevel : 2,
        entityType : 3,
        description,
        entityMetaData
    });
    console.log('wut');
}
module.exports = {
    execute
}