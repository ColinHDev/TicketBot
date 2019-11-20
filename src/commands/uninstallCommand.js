const discord = require("discord.js");

const fs = require("fs");

const config = require("../../resources/config");
const tickets = require("../../resources/tickets");

module.exports = {
    name: "uninstall",
    execute(message) {
        let language = tickets[message.guild.id].settings.language;
        if(
            message.guild.ownerID !== message.author.id &&
            !message.guild.members.get(message.author.id).hasPermission("MANAGE_GUILD")
        ) {
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("You do not have the necessary permissions to deactivate the ticket system,, <@" + message.author.id + ">.")
                    })
                    .then(r =>
                        r.delete(config.deleteMessagesTime));
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Du hast nicht die nötigen Berechtigungen, um das Ticket-System zu deaktivieren, <@" + message.author.id + ">.")
                    })
                    .then(r =>
                        r.delete(config.deleteMessagesTime));
            }
            return;
        }
        if(tickets[message.guild.id] !== undefined) {
            uninstallTickets(message).then(() => {
                if(message.guild.channels.has(message.channel.id)) {
                    if(language === "english") {
                        message.guild.channels.get(message.channel.id)
                            .send({embed: new discord.RichEmbed()
                                    .setColor("#03a700")
                                    .setTitle("__**" + message.client.user.username + "**__")
                                    .setDescription("You have successfully deactivated the ticket system.")
                            })
                        ;
                    }
                    if(language === "german") {
                        message.guild.channels.get(message.channel.id)
                            .send({embed: new discord.RichEmbed()
                                    .setColor("#03a700")
                                    .setTitle("__**" + message.client.user.username + "**__")
                                    .setDescription("Du hast das Ticket-System erfolgreich deaktiviert.")
                            })
                        ;
                    }
                }
            });
        }
    }
};

async function uninstallTickets(message) {
    if(message.guild.channels.has(tickets[message.guild.id].categoryTicketId)) {
        await message.guild.channels.get(tickets[message.guild.id].categoryTicketId).delete();
    }
    if(message.guild.channels.has(tickets[message.guild.id].categoryArchivId)) {
        await message.guild.channels.get(tickets[message.guild.id].categoryArchivId).delete();
    }
    if(message.guild.channels.has(tickets[message.guild.id].createTicketChannel.channelId)) {
        await message.guild.channels.get(tickets[message.guild.id].createTicketChannel.channelId).delete();
    }
    if(message.guild.roles.has(tickets[message.guild.id].ticketSupportRolePlusId)) {
        await message.guild.roles.get(tickets[message.guild.id].ticketSupportRolePlusId).delete();
    }
    if(message.guild.roles.has(tickets[message.guild.id].ticketSupportRoleNormalId)) {
        await message.guild.roles.get(tickets[message.guild.id].ticketSupportRoleNormalId).delete();
    }
    if(message.guild.roles.has(tickets[message.guild.id].ticketBanRoleId)) {
        await message.guild.roles.get(tickets[message.guild.id].ticketBanRoleId).delete();
    }
    tickets [message.guild.id] = {
        settings: tickets[message.guild.id].settings,
    };
    fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
        if(err) throw err;
    });
}