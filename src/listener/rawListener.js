const discord = require("discord.js");

const fs = require("fs");

const config = require("../../resources/config");
const tickets = require("../../resources/tickets");

module.exports.run = async (packet, message) => {
    let language = tickets[message.guild.id].settings.language;
    let user = message.guild.members.get(packet.d["user_id"]);
    if(packet.d.emoji.name === "🎫") {
        await message.reactions.find(reaction => reaction.emoji.name === "🎫").remove(user);
        if(message.guild.members.get(user.id).roles.has(tickets[message.guild.id].ticketBanRoleId)) {
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send("<@" + user.id + ">", {embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("You do not have the necessary permissions to create tickets.")
                    })
                    .then(message =>
                        message.delete(config.deleteMessagesTime)
                    );
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send("<@" + user.id + ">", {embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Du hast nicht die nötigen Berechtigungen, um Tickets erstellen zu können.")
                    })
                    .then(message =>
                        message.delete(config.deleteMessagesTime)
                    );
            }
            return;
        }
        for (let ticketId in tickets[message.guild.id].tickets) {
            let ticket = tickets[message.guild.id].tickets[ticketId];
            if (ticket.ownerId === user.id) {
                if (!message.guild.channels.has(ticket.channelId)) {
                    delete tickets[message.guild.id].tickets[ticket.channelId];
                    fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
                        if (err) throw err
                    });
                    continue;
                }
                if (message.guild.channels.get(ticket.channelId).parentID === tickets[message.guild.id].categoryArchivId) continue;
                let otherTicket = message.guild.channels.get(ticket.channelId);
                if (language === "english") {
                    message.guild.channels.get(tickets[message.guild.id].createTicketChannel.channelId)
                        .send({
                            embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("You already have an open ticket, <@" + user.id + ">. " + otherTicket.toString())
                        })
                        .then(message =>
                            message.delete(config.deleteMessagesTime));
                    otherTicket
                        .send("<@" + user.id + ">", {
                            embed: new discord.RichEmbed()
                                .setColor("#1105c5")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("Briefly describe your problem for a supporter to help you.")
                        })
                        .then(message =>
                            message.delete(config.deleteMessagesTime));
                }
                if (language === "german") {
                    message.guild.channels.get(tickets[message.guild.id].createTicketChannel.channelId)
                        .send({
                            embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("Du hast bereits ein offenes Ticket, <@" + user.id + ">. " + otherTicket.toString())
                        })
                        .then(message =>
                            message.delete(config.deleteMessagesTime));
                    otherTicket
                        .send("<@" + user.id + ">", {
                            embed: new discord.RichEmbed()
                                .setColor("#1105c5")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("Schildere kurz dein Problem, damit ein Supporter dir helfen kann.")
                        })
                        .then(message =>
                            message.delete(config.deleteMessagesTime));
                }
                return;
            }
        }
        let ticketCode = "";
        let channelFormat = tickets[message.guild.id].settings.ticketchannelFormat;
        if(tickets[message.guild.id].settings.ticketchannelFormat === "false") channelFormat = "";
        do {
            let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
            let i;
            for (i = 0; i < 5; i++ ) {
                ticketCode += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        } while (message.guild.channels.find(channel => channel.name === channelFormat + ticketCode && channel.type === "text") instanceof discord.GuildChannel);
        createTicket(message.guild, user, channelFormat + ticketCode, language)
            .then(channel => {
                if(
                    tickets[message.guild.id].settings.ticketCreationPing === "false" ||
                    !message.guild.roles.has(tickets[message.guild.id].settings.ticketCreationPing)
                ) {
                    if(language === "english") {
                        channel
                            .send("<@" + user.id + ">", {embed: new discord.RichEmbed()
                                    .setColor("#1105c5")
                                    .setTitle("__**" + message.client.user.username + "**__")
                                    .setDescription("Briefly describe your problem for a supporter to help you.")
                            })
                        ;
                    }
                    if(language === "german") {
                        channel
                            .send("<@" + user.id + ">", {embed: new discord.RichEmbed()
                                    .setColor("#1105c5")
                                    .setTitle("__**" + message.client.user.username + "**__")
                                    .setDescription("Schildere kurz dein Problem, damit ein Supporter dir helfen kann.")
                            })
                        ;
                    }
                    return;
                }
                if(language === "english") {
                    channel
                        .send("<@" + user.id + "> `-` " + message.guild.roles.get(tickets[message.guild.id].settings.ticketCreationPing).toString(), {embed: new discord.RichEmbed()
                                .setColor("#1105c5")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("Briefly describe your problem for a supporter to help you.")
                        })
                    ;
                }
                if(language === "german") {
                    channel
                        .send("<@" + user.id + "> `-` " + message.guild.roles.get(tickets[message.guild.id].settings.ticketCreationPing).toString(), {embed: new discord.RichEmbed()
                                .setColor("#1105c5")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("Schildere kurz dein Problem, damit ein Supporter dir helfen kann.")
                        })
                    ;
                }
            });
    }else if (packet.d.emoji.name === "🚫") {
        message.reactions.find(reaction => reaction.emoji.name === "🚫").remove(user);
        if (!message.guild.members.get(user.id).roles.has(tickets[message.guild.id].ticketSupportRolePlusId)) {
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send("<@" + user.id + ">", {embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("You do not have the necessary permissions to delete tickets.")
                    })
                    .then(message =>
                        message.delete(config.deleteMessagesTime)
                    );
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send("<@" + user.id + ">", {embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Du hast nicht die nötigen Berechtigungen, um Tickets löschen zu können.")
                    })
                    .then(message =>
                        message.delete(config.deleteMessagesTime)
                    );
            }
            return;
        }
        delete tickets[message.guild.id].tickets[message.channel.id];
        fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
            if (err) throw err
        });
        await message.channel.delete();
    }else if (packet.d.emoji.name === "🔒") {
        message.reactions.find(reaction => reaction.emoji.name === "🔒").remove(user);
        if(
            !message.guild.members.get(user.id).roles.has(tickets[message.guild.id].ticketSupportRolePlusId) &&
            !message.guild.members.get(user.id).roles.has(tickets[message.guild.id].ticketSupportRoleNormalId)
        ) {
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send("<@" + user.id + ">", {embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("You do not have the necessary permissions to close tickets.")
                    })
                    .then(message =>
                        message.delete(config.deleteMessagesTime)
                    );
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send("<@" + user.id + ">", {embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Du hast nicht die nötigen Berechtigungen, um Tickets schließen zu können.")
                    })
                    .then(message =>
                        message.delete(config.deleteMessagesTime)
                    );
            }
            return;
        }
        if(message.channel.parentID === tickets[message.guild.id].categoryArchivId) {
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("This ticket is already closed, <@" + user.id + ">.")
                    })
                    .then(message =>
                        message.delete(config.deleteMessagesTime))
                ;
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Dieses Ticket ist bereits geschlossen, <@" + user.id + ">.")
                    })
                    .then(message =>
                        message.delete(config.deleteMessagesTime))
                ;
            }
            return;
        }
        await message.channel.overwritePermissions(message.guild.roles.get(tickets[message.guild.id].ticketSupportRolePlusId), {
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
        await message.channel.overwritePermissions(message.guild.roles.get(tickets[message.guild.id].ticketSupportRoleNormalId), {
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
        for (let [userId, guildMember] of message.channel.members) {
            if(guildMember.user.bot) continue;
            if(tickets[message.guild.id].tickets[message.channel.id].ownerId !== userId) {
                if(message.guild.members.get(userId).roles.has(tickets[message.guild.id].ticketSupportRolePlusId)) continue;
                if(message.guild.members.get(userId).roles.has(tickets[message.guild.id].ticketSupportRoleNormalId)) continue;
            }
            await message.channel.overwritePermissions(guildMember, {
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
        }
        await message.channel.setParent(tickets[message.guild.id].categoryArchivId);
        if(language === "english") {
            message.guild.channels.get(message.channel.id)
                .send({embed: new discord.RichEmbed()
                        .setColor("#1105c5")
                        .setTitle("__**" + message.client.user.username + "**__")
                        .setDescription("You have successfully closed the ticket, <@" + user.id + ">.")
                })
            ;
        }
        if(language === "german") {
            message.guild.channels.get(message.channel.id)
                .send({embed: new discord.RichEmbed()
                        .setColor("#1105c5")
                        .setTitle("__**" + message.client.user.username + "**__")
                        .setDescription("Du hast das Ticket erfolgreich geschlossen, <@" + user.id + ">.")
                })
            ;
        }
    }else if(packet.d.emoji.name === "🔓") {
        message.reactions.find(reaction => reaction.emoji.name === "🔓").remove(user);
        if(
            !message.guild.members.get(user.id).roles.has(tickets[message.guild.id].ticketSupportRolePlusId) &&
            !message.guild.members.get(user.id).roles.has(tickets[message.guild.id].ticketSupportRoleNormalId)
        ) {
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send("<@" + user.id + ">", {embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("You do not have the necessary permissions to open tickets.")
                    })
                    .then(message =>
                        message.delete(config.deleteMessagesTime)
                    );
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send("<@" + user.id + ">", {embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Du hast nicht die nötigen Berechtigungen, um Tickets öffnen zu können.")
                    })
                    .then(message =>
                        message.delete(config.deleteMessagesTime)
                    );
            }
            return;
        }
        if(message.channel.parentID === tickets[message.guild.id].categoryTicketId) {
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("This ticket is already open, <@" + user.id + ">.")
                    })
                    .then(message =>
                        message.delete(config.deleteMessagesTime))
                ;
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Dieses Ticket ist bereits geöffnet, <@" + user.id + ">.")
                    })
                    .then(message =>
                        message.delete(config.deleteMessagesTime))
                ;
            }
            return;
        }
        await message.channel.overwritePermissions(message.guild.roles.get(tickets[message.guild.id].ticketSupportRolePlusId), {
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES_OR_PERMISSIONS: false,
            MANAGE_WEBHOOKS: false,
            READ_MESSAGES: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false
        });
        await message.channel.overwritePermissions(message.guild.roles.get(tickets[message.guild.id].ticketSupportRoleNormalId), {
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES_OR_PERMISSIONS: false,
            MANAGE_WEBHOOKS: false,
            READ_MESSAGES: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false
        });
        for (let [userId, guildMember] of message.channel.members) {
            if(guildMember.user.bot) continue;
            if(tickets[message.guild.id].tickets[message.channel.id].ownerId !== userId) {
                if(message.guild.members.get(userId).roles.has(tickets[message.guild.id].ticketSupportRolePlusId)) continue;
                if(message.guild.members.get(userId).roles.has(tickets[message.guild.id].ticketSupportRoleNormalId)) continue;
            }
            await message.channel.overwritePermissions(guildMember, {
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                MANAGE_ROLES_OR_PERMISSIONS: false,
                MANAGE_WEBHOOKS: false,
                READ_MESSAGES: true,
                SEND_MESSAGES: true,
                SEND_TTS_MESSAGES: false,
                MANAGE_MESSAGES: false,
                EMBED_LINKS: true,
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: false,
                ADD_REACTIONS: false
            });
        }
        await message.channel.setParent(tickets[message.guild.id].categoryTicketId);
        if(language === "english") {
            message.guild.channels.get(message.channel.id)
                .send({embed: new discord.RichEmbed()
                        .setColor("#1105c5")
                        .setTitle("__**" + message.client.user.username + "**__")
                        .setDescription("You have successfully opened the ticket, <@" + user.id + ">.")
                })
            ;
        }
        if(language === "german") {
            message.guild.channels.get(message.channel.id)
                .send({embed: new discord.RichEmbed()
                        .setColor("#1105c5")
                        .setTitle("__**" + message.client.user.username + "**__")
                        .setDescription("Du hast das Ticket erfolgreich geöffnet, <@" + user.id + ">.")
                })
            ;
        }
    }
};

async function createTicket(guild, user, ticketCode, language) {
    let channel = await guild.createChannel(ticketCode, {type: "text"});
    await channel.setParent(tickets[guild.id].categoryTicketId);
    await channel.overwritePermissions(guild.roles.get(guild.defaultRole.id), {
        CREATE_INSTANT_INVITE: false,
        MANAGE_CHANNELS: false,
        MANAGE_ROLES_OR_PERMISSIONS: false,
        MANAGE_WEBHOOKS: false,
        READ_MESSAGES: false,
        SEND_MESSAGES: false,
        SEND_TTS_MESSAGES: false,
        MANAGE_MESSAGES: false,
        EMBED_LINKS: false,
        ATTACH_FILES: false,
        READ_MESSAGE_HISTORY: false,
        MENTION_EVERYONE: false,
        USE_EXTERNAL_EMOJIS: false,
        ADD_REACTIONS: false
    });
    await channel.overwritePermissions(guild.roles.get(tickets[guild.id].ticketSupportRolePlusId), {
        CREATE_INSTANT_INVITE: false,
        MANAGE_CHANNELS: false,
        MANAGE_ROLES_OR_PERMISSIONS: false,
        MANAGE_WEBHOOKS: false,
        READ_MESSAGES: true,
        SEND_MESSAGES: true,
        SEND_TTS_MESSAGES: false,
        MANAGE_MESSAGES: false,
        EMBED_LINKS: true,
        ATTACH_FILES: true,
        READ_MESSAGE_HISTORY: true,
        MENTION_EVERYONE: false,
        USE_EXTERNAL_EMOJIS: false,
        ADD_REACTIONS: false
    });
    await channel.overwritePermissions(guild.roles.get(tickets[guild.id].ticketSupportRoleNormalId), {
        CREATE_INSTANT_INVITE: false,
        MANAGE_CHANNELS: false,
        MANAGE_ROLES_OR_PERMISSIONS: false,
        MANAGE_WEBHOOKS: false,
        READ_MESSAGES: true,
        SEND_MESSAGES: true,
        SEND_TTS_MESSAGES: false,
        MANAGE_MESSAGES: false,
        EMBED_LINKS: true,
        ATTACH_FILES: true,
        READ_MESSAGE_HISTORY: true,
        MENTION_EVERYONE: false,
        USE_EXTERNAL_EMOJIS: false,
        ADD_REACTIONS: false
    });
    await channel.overwritePermissions(user, {
        CREATE_INSTANT_INVITE: false,
        MANAGE_CHANNELS: false,
        MANAGE_ROLES_OR_PERMISSIONS: false,
        MANAGE_WEBHOOKS: false,
        READ_MESSAGES: true,
        SEND_MESSAGES: true,
        SEND_TTS_MESSAGES: false,
        MANAGE_MESSAGES: false,
        EMBED_LINKS: true,
        ATTACH_FILES: true,
        READ_MESSAGE_HISTORY: true,
        MENTION_EVERYONE: false,
        USE_EXTERNAL_EMOJIS: false,
        ADD_REACTIONS: false
    });
    let messageId;
    if(language === "english") {
        await channel
            .send({embed: new discord.RichEmbed()
                    .setColor("#1105c5")
                    .addField(
                        "Ticket: " + ticketCode + ".",
                        "Ticket from <@" + user.id + ">.\n" +
                        "🚫 -> Delete ticket.\n" +
                        "🔒 -> Close ticket.\n" +
                        "🔓 -> Open ticket."
                    )})
            .then((message) => {
                messageId = message.id;
                message.react("🚫").then(reaction => {
                    reaction.message.react("🔒").then(reaction => {
                        reaction.message.react("🔓")
                    });
                });
            });
    }
    if(language === "german") {
        await channel
            .send({embed: new discord.RichEmbed()
                    .setColor("#1105c5")
                    .addField(
                        "Ticket: " + ticketCode + ".",
                        "Ticket von <@" + user.id + ">.\n" +
                        "🚫 -> Ticket löschen.\n" +
                        "🔒 -> Ticket schließen.\n" +
                        "🔓 -> Ticket öffnen."
                    )})
            .then((message) => {
                messageId = message.id;
                message.react("🚫").then(reaction => {
                    reaction.message.react("🔒").then(reaction => {
                        reaction.message.react("🔓")
                    });
                });
            });
    }
    tickets [guild.id].tickets[channel.id] = {
        channelId: channel.id,
        messageId: messageId,
        ownerId: user.id
    };
    fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
        if(err) throw err});
    return channel;
}