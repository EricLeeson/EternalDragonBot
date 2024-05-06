const googleSheets = require('./googleSheets');

async function execute(scheduledEvent) {
    if (scheduledEvent) {
        const logChannel = await scheduledEvent.client.channels.cache.get(process.env.LOGS_CHANNEL_ID);
        const subs = await scheduledEvent.fetchSubscribers({withMember : true});
        const nicknames = getNicknames(subs);
        // await googleSheets.takeAttendance(nicknames, scheduledEvent);
        // await logChannel.send(`Took attendance. There are ${nicknames.length} people signed up.`);
    }
}

module.exports = {
    execute
}

function getNicknames(subs) {
    const nicknames = [];
    const users = subs.values();
    for (const sub of users) {
        if (isPaddler(sub.member)) nicknames.push(sub.member.nickname);
    }
    return nicknames;
}

function isPaddler(member) {
    return member.roles.cache.has(process.env.PADDLER_ROLE_ID);
}