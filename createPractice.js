const dotenv = require('dotenv');
dotenv.config();

const googleSheets = require('./googleSheets');
const takeAttendance = require('./takeAttendance');

function getDate(type) {
    const practiceTime = new Date();
    practiceTime.setDate(practiceTime.getDate() + 2);
    if (type === 'start') {
        practiceTime.setHours(16);
        practiceTime.setMinutes(30);
    } else if (type === 'end') {
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
    const scheduledStartTime = getDate('start');
    const scheduledEndTime = getDate('end');
    const description = `${practiceType} Practice`;
    const entityMetadata = {location : '1 Athletes Way'};
    const event = await guild.scheduledEvents.create({
        name,
        scheduledStartTime,
        scheduledEndTime,
        privacyLevel : 2,
        entityType : 3,
        description,
        entityMetadata
    });
    console.log(event);
    console.log(guild.scheduledEvents.cache.toJSON());

    const eventMonth = numToMonth(scheduledStartTime.getMonth());
    const eventDate = scheduledStartTime.getDate().toString();

    googleSheets.createNewAttendanceColumn(eventMonth, eventDate, practiceType);

    setTimeout( () => takeAttendance.execute(event), 230400000);
}

module.exports = {
    execute
}