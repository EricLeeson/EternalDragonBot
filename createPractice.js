const dotenv = require('dotenv');
dotenv.config();

const googleSheets = require('./googleSheets');
const takeAttendance = require('./takeAttendance');

function getDate(type, practiceType) {
    const practiceTime = new Date();
    practiceTime.setDate(practiceTime.getDate() + 2);
    let hours = 0;
    if (type === 'start') {
        if (practiceType == 'Water') hours = 16;
        else if (practiceType == 'Land') hours = 15;
        practiceTime.setHours(16);
        practiceTime.setMinutes(30);
    } else if (type === 'end') {
        if (practiceTime == 'Water') hours = 18;
        else if (practiceTime == 'Land') {
            hours = 17;
            practiceTime.setMinutes(30);
        }
        practiceTime.setHours(18);
    }
    return practiceTime;
}

function numToMonth(num) {
    const months = 'January February March April May June July August September October November December'.split(' ');

    return months[num];
}

async function execute(client, practiceType) {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    
    const name = `${practiceType} Practice`;
    const scheduledStartTime = getDate('start', practiceType);
    const scheduledEndTime = getDate('end', practiceType);
    const description = `Hone your dragon boat technique at this week's ${practiceType} Practice!`;
    const entityMetadata = {location : '1 Athletes Way'};
    const image = './eternaldragonconcord2023.jpg';
    const event = await guild.scheduledEvents.create({
        name,
        scheduledStartTime,
        scheduledEndTime,
        privacyLevel : 2,
        entityType : 3,
        description,
        entityMetadata,
        image
    });

    const eventMonth = numToMonth(scheduledStartTime.getMonth());
    const eventDate = scheduledStartTime.getDate().toString();

    googleSheets.createNewAttendanceColumn(eventMonth, eventDate, practiceType);

    setTimeout( () => takeAttendance.execute(event), 230400000);
}

module.exports = {
    execute
}