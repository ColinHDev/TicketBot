const discord = require("discord.js");

const config = require("../../resources/config");
const tickets = require("../../resources/tickets");

module.exports = {
    name: "add",
    execute: function (message, args) {
        let language = tickets[message.guild.id].settings.language;
        if (tickets[message.guild.id].tickets[message.channel.id] === undefined) {
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("You can only run this command in a ticket, <@" + message.author.id + ">.")
                    })
                    .then(r =>
                        r.delete(config.deleteMessagesTime)
                    )
                ;
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Du kannst diesen Befehl nur in einem Ticket ausführen, <@" + message.author.id + ">.")
                    })
                    .then(r =>
                        r.delete(config.deleteMessagesTime)
                    )
                ;
            }
            return;
        }
        let add = args[0];
        if (
            message.author.id !== tickets[message.guild.id].tickets[message.channel.id].ownerId &&
            message.guild.members.get(message.author.id).roles.has(tickets[message.guild.id].ticketSupportRolePlusId) &&
            message.guild.members.get(message.author.id).roles.has(tickets[message.guild.id].ticketSupportRoleNormalId)
        ) {
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send({
                        embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("You do not have the necessary permissions to add users to this ticket, <@" + message.author.id + ">.")
                    })
                    .then(r =>
                        r.delete(config.deleteMessagesTime)
                    )
                ;
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({
                        embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Du hast nicht die nötigen Berechtigungen, um Nutzer zu diesem Ticket hinzufügen zu können, <@" + message.author.id + ">.")
                    })
                    .then(r =>
                        r.delete(config.deleteMessagesTime)
                    )
                ;
            }
            return;
        }
        if (message.guild.members.find(settings => settings.user.username === add) instanceof discord.GuildMember) {
            add = message.guild.members.find(settings => settings.user.username === add);
        } else if (message.guild.members.find(settings => settings.nickname === add) instanceof discord.GuildMember) {
            add = message.guild.members.find(settings => settings.nickname === add);
        } else if (message.guild.members.has(add)) {
            add = message.guild.members.get(add);
        } else {
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send({
                        embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription(
                                "This user could not be found.\n" +
                                "You can add users to a ticket by name,\n" +
                                "nickname, or their userid."
                            )
                    })
                    .then(r =>
                        r.delete(config.deleteMessagesTime)
                    )
                ;
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({
                        embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription(
                                "Dieser Nutzer konnte nicht gefunden werden.\n" +
                                "Du kannst Nutzer über ihren Namen, ihren Nickname oder\n" +
                                "über ihre NutzerId zu einem Ticket hinzufügen."
                            )
                    })
                    .then(r =>
                        r.delete(config.deleteMessagesTime)
                    )
                ;
            }
            return;
        }
        for (let i = 0; i < message.channel.members.size; i++) {
            if(add.id === message.channel.members[i].id) {
                if(language === "english") {
                    message.guild.channels.get(message.channel.id)
                        .send({
                            embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("This user is already a member of this ticket.")
                        })
                        .then(r =>
                            r.delete(config.deleteMessagesTime)
                        )
                    ;
                }
                if(language === "german") {
                    message.guild.channels.get(message.channel.id)
                        .send({
                            embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("Dieser Nutzer ist bereits Mitglied dieses Tickets.")
                        })
                        .then(r =>
                            r.delete(config.deleteMessagesTime)
                        )
                    ;
                }
                return;
            }
        }
        addMember(message, add)
            .then(channel => {
                if(language === "english") {
                    message.guild.channels.get(channel.id)
                        .send({embed: new discord.RichEmbed()
                                .setColor("#1105c5")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("You have successfully added <@" + add.id + "> to this ticket, <@" + message.author.id + ">."
                                )
                        })
                    ;
                }
                if(language === "german") {
                    message.guild.channels.get(channel.id)
                        .send({embed: new discord.RichEmbed()
                                .setColor("#1105c5")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("Du hast <@" + add.id + "> erfolgreich zu diesem Ticket hinzugefügt, <@" + message.author.id + ">."
                                )
                        })
                    ;
                }
            });
    }
};

async function addMember(message, add) {
    let channel = message.guild.channels.get(message.channel.id);
    await channel.overwritePermissions(add, {
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
    return channel;
}