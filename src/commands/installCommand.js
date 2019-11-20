const discord = require("discord.js");

const fs = require("fs");

const config = require("../../resources/config");
const tickets = require("../../resources/tickets");

module.exports = {
    name: "install",
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
                            .setDescription("You do not have the necessary permissions to initialize the ticket system, <@" + message.author.id + ">.")})
                    .then(r =>
                        r.delete(config.deleteMessagesTime));
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Du hast nicht die nötigen Berechtigungen, um das Ticket-System zu initialisieren, <@" + message.author.id + ">.")})
                    .then(r =>
                        r.delete(config.deleteMessagesTime));
            }
            return;
        }
        if(tickets[message.guild.id].createTicketChannel !== undefined) {
            deleteOldTicket(message).then(() => {
                if(message.guild.channels.has(message.channel.id)) {
                    if(language === "english") {
                        message.guild.channels.get(message.channel.id)
                            .send({embed: new discord.RichEmbed()
                                    .setColor("#03a700")
                                    .setTitle("__**" + message.client.user.username + "**__")
                                    .setDescription("The overrun of the ticket system has just been removed.")
                            })
                        ;
                    }
                    if(language === "german") {
                        message.guild.channels.get(message.channel.id)
                            .send({embed: new discord.RichEmbed()
                                    .setColor("#03a700")
                                    .setTitle("__**" + message.client.user.username + "**__")
                                    .setDescription("Überresste vom Ticket-System wurden soeben entfernt.")
                            })
                        ;
                    }
                }
            });
        }
        installTickets(message, language).then(() => {
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send({
                        embed: new discord.RichEmbed()
                            .setColor("#03a700")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("The ticket system was successfully initialized.")
                    })
                ;
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#03a700")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Das Ticket-System wurde erfolgreich initialisiert.")
                    })
                ;
            }
        });
    }
};

async function installTickets(message, language) {
    let ticketRolePlus = await message.guild.createRole({
        name: "🎫-Support+",
        color: "#c01d14",
        hoist: false,
        mentionable: true
    });
    let ticketRoleNormal = await message.guild.createRole({
        name: "🎫-Support",
        color: "#1105c5",
        hoist: false,
        mentionable: true
    });
    let ticketBanRole, categoryTicket, categoryArchiv, channel, ticketMessage;
    if(language === "english") {
        ticketBanRole = await message.guild.createRole({
            name: "🎫-Ban",
            color: "#818386",
            hoist: false,
            mentionable: true
        });
        categoryTicket = await message.guild.createChannel("🎫 Tickets", {type: "category"});
        categoryArchiv = await message.guild.createChannel("📁 Archive", {type: "category"});
        channel = await message.guild.createChannel("🎫-tickets", {type: "text"});
        ticketMessage = await channel
            .send({embed: new discord.RichEmbed()
                    .setColor("#1105c5")
                    .setTitle("__**" + message.client.user.username + "**__")
                    .setDescription("React with 🎫 to create a new ticket.")
            })
        ;
    }
    if(language === "german") {
        ticketBanRole = await message.guild.createRole({
            name: "🎫-Sperrung",
            color: "#818386",
            hoist: false,
            mentionable: true
        });
        categoryTicket = await message.guild.createChannel("🎫 Tickets", {type: "category"});
        categoryArchiv = await message.guild.createChannel("📁 Archiv", {type: "category"});
        channel = await message.guild.createChannel("🎫-tickets", {type: "text"});
        ticketMessage = await channel
            .send({embed: new discord.RichEmbed()
                    .setColor("#1105c5")
                    .setTitle("__**" + message.client.user.username + "**__")
                    .setDescription("Reagiere mit 🎫, um ein neues Ticket zu erstellen.")
            })
        ;
    }
    await ticketMessage.react("🎫");
    tickets [message.guild.id] = {
        settings: tickets[message.guild.id].settings,
        categoryTicketId: categoryTicket.id,
        categoryArchivId: categoryArchiv.id,
        createTicketChannel: {
            channelId: channel.id,
            messageId: ticketMessage.id
        },
        ticketSupportRolePlusId: ticketRolePlus.id,
        ticketSupportRoleNormalId: ticketRoleNormal.id,
        ticketBanRoleId: ticketBanRole.id,
        tickets: {}
    };
    fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
        if(err) throw err;
    });
    await channel.setParent(categoryTicket.id);
    await categoryTicket.overwritePermissions(message.guild.roles.get(message.guild.defaultRole.id), {
        CREATE_INSTANT_INVITE: false,
        MANAGE_CHANNELS: false,
        MANAGE_ROLES_OR_PERMISSIONS: false,
        MANAGE_WEBHOOKS: false,
        READ_MESSAGES: true,
        SEND_MESSAGES: false,
        SEND_TTS_MESSAGES: false,
        MANAGE_MESSAGES: false,
        EMBED_LINKS: false,
        ATTACH_FILES: false,
        READ_MESSAGE_HISTORY: true,
        MENTION_EVERYONE: false,
        USE_EXTERNAL_EMOJIS: false,
        ADD_REACTIONS: false
    });
    await channel.lockPermissions();
}

async function deleteOldTicket(message) {
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
}