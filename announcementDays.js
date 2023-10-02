const {waterPracticeDays, landPracticeDays} = require('./config.json');

const WEEKDAYS = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ');

function getAnnouncementDays(days) {
    const announcementDays = [];
    for (let i = 0; i < days.length; i++) {
        announcementDays.push( (WEEKDAYS.indexOf(days[i]) + 6) % 7 );
    }
    return announcementDays.toString();
}

const waterPracticeAnnouncementDays = getAnnouncementDays(waterPracticeDays);
const landPracticeAnnouncementDays = getAnnouncementDays(landPracticeDays);

module.exports = { waterPracticeAnnouncementDays, landPracticeAnnouncementDays };