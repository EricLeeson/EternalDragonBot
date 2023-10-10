const googleSheets = require('./googleSheets');

async function execute(scheduledEvent) {
    const logChannel = await scheduledEvent.client.channels.cache.get(process.env.LOGS_CHANNEL_ID);
    const subs = await scheduledEvent.fetchSubscribers({withMember : true});
    const nicknames = getNicknames(subs);
    googleSheets.takeAttendance(nicknames);
    await logChannel.send(`Took attendance. There are ${nicknames.length} people signed up.`);
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