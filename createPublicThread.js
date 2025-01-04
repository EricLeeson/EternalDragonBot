const dotenv = require('dotenv');
dotenv.config();

const { ChannelType } = require('discord.js');
const googleSheets = require('./googleSheets');

async function execute(channel, practiceType) {
    options = getOptions(practiceType);
    googleSheets.createNewAttendanceColumn(options.month, options.day, practiceType);

    // const inviteMessage = await getInviteMessage();
    // const thread = await channel.threads.create({
    //     name,
    //     type: ChannelType.PublicThread,
    //     invitable: false,
    // })
    // await thread.send(inviteMessage);
}

module.exports = {
    execute
}

function getOptions(practiceType) {
    date = getStartDate();
    name = getThreadTitle(date, practiceType);
    month = numToMonth(date.getMonth());
    day = date.getDate().toString();
    return {
        date,
        name,
        month,
        day
    }
}

function getStartDate() {
    const practiceTime = new Date();
    practiceTime.setDate(practiceTime.getDate() + 2);
    return practiceTime;
}

function getThreadTitle(date, practiceType) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
      
    const title = date.toLocaleDateString(undefined, options) + ' ' + practiceType + ' Practice Signup';
    return title;
}

function numToMonth(num) {
    const months = 'January February March April May June July August September October November December'.split(' ');

    return months[num];
}

async function getInviteMessage() {
    return `<@&${process.env.PADDLER_ROLE_ID}> Unsign-ups for practice are now up. To sign up, use the /unsignup command.`;
    // return `<@&${process.env.PADDLER_ROLE_ID}> Sign-ups for practice are now up. To sign up, use the /signup command.`;
}