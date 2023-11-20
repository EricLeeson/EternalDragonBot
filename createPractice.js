const dotenv = require('dotenv');
dotenv.config();

const googleSheets = require('./googleSheets');
const takeAttendance = require('./takeAttendance');

function getStartDate(practiceType) {
    const practiceTime = new Date();
    practiceTime.setDate(practiceTime.getDate() + 2);
    if (practiceType == 'Water') {
        practiceTime.setHours(16);
        practiceTime.setMinutes(0);
    }
    if (practiceType == 'Land') {
        practiceTime.setHours(15);
        practiceTime.setMinutes(30);
    }
    return practiceTime;
}

function getEndDate(practiceType) {
    const practiceTime = new Date();
    practiceTime.setDate(practiceTime.getDate() + 2);
    practiceTime.setHours(18);
    practiceTime.setMinutes(0);
    
    return practiceTime;
}

function getDescription(practiceType) {
    if (practiceType == 'Water') {
        return `Hone your dragon boat technique at this week's ${practiceType} Practice!`;
    }
    if (practiceType == 'Land') {
        return `Train your strength at this week's ${practiceType} Practice!`;
    }
}

function getLocation(practiceType) {
    if (practiceType == 'Water') {
        return '1 Athletes Way';
    }
    if (practiceType == 'Land') {
        return 'Eric Hamber Secondary in Room A307';
    }
}

function numToMonth(num) {
    const months = 'January February March April May June July August September October November December'.split(' ');

    return months[num];
}

async function execute(client, practiceType) {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    
    const name = `${practiceType} Practice`;
    const scheduledStartTime = getStartDate(practiceType)
    const scheduledEndTime = getEndDate(practiceType);
    const description = getDescription(practiceType);
    const location = getLocation(practiceType);
    const entityMetadata = {location};
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

    await googleSheets.createNewAttendanceColumn(eventMonth, eventDate, practiceType);
    const timer = getAttendanceTimer(event);
    setTimeout( () => takeAttendance.execute(event), timer);
}

function getAttendanceTimer(event) {
    const attendanceTime = event.scheduledStartAt;
    attendanceTime.setHours(16, 0);
    const timer = attendanceTime - Date.now();
    return timer;
}

module.exports = {
    execute
}