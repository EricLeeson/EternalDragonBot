const googleSheets = require('./googleSheets');

async function execute(scheduledEvent) {
    const subs = await scheduledEvent.fetchSubscribers({withMember : true});
    const nicknames = getNicknames(subs);
    googleSheets.takeAttendance(nicknames);
    console.log('took attendance');
}

module.exports = {
    execute
}

function getNicknames(subs) {
    const users = subs.toJSON();
    const nicknames = [];
    for (let i = 0; i < users.length; i++) {
        nicknames[i] = users[i].member.nickname;
    }
    return nicknames;
}