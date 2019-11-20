const config = require("../../resources/config");
const tickets = require("../../resources/tickets");

module.exports.run = (client) => {
    client.user.setStatus("online");
    let index = 0;
    setInterval(() => {
        index++;
        if(index === config.activities.length) index = 0;
        let activityParts = config.activities[index].split("---");
        let activity = activityParts[1];
        activity = activity.replace("%tickets%", getTickets(client).toString());
        activity = activity.replace("%users%", client.users.size.toString());
        activity = activity.replace("%guilds%", client.guilds.size.toString());
        activity = activity.replace("%prefix%", config.prefix);
        client.user.setActivity(activity, {
            type: activityParts[0],
            url: "https://discord.gg/aYtgqnt"
        });
    }, config.clientuserActivitySwitchTime);
};

function getTickets(client) {
    let count = 0;
    for (let guildId in tickets) {
        if(tickets[guildId].createTicketChannel === undefined) continue;
        for (let channelId in tickets[guildId].tickets) {
            if(!client.guilds.get(guildId).channels.has(channelId)) continue;
            count++;
        }
    }
    return count;
}