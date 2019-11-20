const discord = require("discord.js");

const fs = require("fs");

const config = require("../../resources/config");
const tickets = require("../../resources/tickets");

module.exports = {
    name: "settings",
    execute(message, args) {
        let language = tickets[message.guild.id].settings.language;
        if(
            message.guild.ownerID !== message.author.id &&
            !message.guild.members.get(message.author.id).hasPermission("MANAGE_GUILD")
        ) {
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send({
                        embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription(
                                "You do not have the necessary permissions to change settings, <@" + message.author.id + ">."
                            )
                    })
                    .then(r =>
                        r.delete(config.deleteMessagesTime)
                    );
            }else if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({
                        embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription(
                                "Du hast nicht die nötigen Berechtigungen, um Einstellungen ändern zu können, <@" + message.author.id + ">."
                            )
                    })
                    .then(r =>
                        r.delete(config.deleteMessagesTime)
                    );
            }
            return;
        }
        if(args[0] === undefined) args[0] = "list";
        if(args[0].toLowerCase() === "list") {
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription(
                                "**language [german; english]** - `Change the language of the bot.`\n" +
                                "**pingrole [rolename; roleid, false]** - `Change the role that should be marked\nwhen a tickets is opened or disable this feature.`\n" +
                                "**ticketformat [example: 🎫-; false]** - `Change the text in front of the ticketid\nor deactivate this additional text.`\n"
                            )
                    });
            }else if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription(
                                "**language [german; english]** - `Verändere die Sprache des Bots.`\n" +
                                "**pingrole [RollenName; RollenId, false]** - `Verändere die Rolle, die beim eröffnen\neines Tickets markiert werden soll bzw. deaktiviere diese Funktion.`\n" +
                                "**ticketformat [bspw.: 🎫-; false]** - `Verändere den Text, der vor der TicketId steht\nbzw. deaktiviere diesen zusätzlichen Text.`\n"
                            )
                    });
            }
            return;
        }
        if(args[0].toLowerCase() === "language") {
            if(args[1] === undefined) {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("`" + config.prefix + "settings language [german; english]`**!**")
                    });
                return;
            }
            if(
                args[1].toLowerCase() !== "german" &&
                args[1].toLowerCase() !== "english"
            ) {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("`" + config.prefix + "settings language [german; english]`**!**")
                    });
                return;
            }
            tickets [message.guild.id].settings.language = args[1].toLowerCase();
            fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
                if(err) throw err;
            });
            if(args[1].toLowerCase() === "english") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("You have successfully changed the language of the bot to `English`.")
                    });
                return;
            }
            if(args[1].toLowerCase() === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Du hast die Sprache des Bots erfolgreich auf `Deutsch` geändert.")
                    });
                return;
            }
        }
        if(args[0].toLowerCase() === "pingrole") {
            if (args[1] === undefined) {
                if (language === "english") {
                    message.guild.channels.get(message.channel.id)
                        .send({
                            embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("`" + config.prefix + "settings pingrole [rolename; roleid, false]`**!**")
                        });
                } else if (language === "german") {
                    message.guild.channels.get(message.channel.id)
                        .send({
                            embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("`" + config.prefix + "settings pingrole [RollenName; RollenId, false]`**!**")
                        });
                }
                return;
            }
            if(args[1].toLowerCase() === "false") {
                tickets [message.guild.id].settings.ticketCreationPing = args[1].toLowerCase();
                fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
                    if(err) throw err;
                });
                if(language === "english") {
                    message.guild.channels.get(message.channel.id)
                        .send({embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("You have successfully deactivated the marking of a role when opening a ticket.")
                        });
                    return;
                }
                if(language === "german") {
                    message.guild.channels.get(message.channel.id)
                        .send({embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("Du hast die Markierung einer Rolle bei der Eröffnung eines Tickets erfolgreich deaktiviert.")
                        });
                    return;
                }
            }
            let role;
            if (message.guild.roles.find(role => role.name.toLowerCase() === args[1].toLowerCase()) instanceof discord.Role) {
                role = message.guild.roles.find(role => role.name.toLowerCase() === args[1].toLowerCase());
            } else if (message.guild.roles.has(args[1])) {
                role = message.guild.roles.get(args[1]);
            } else {
                if (language === "english") {
                    message.guild.channels.get(message.channel.id)
                        .send({
                            embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("`" + config.prefix + "settings pingrole [rolename; roleid, false]`**!**")
                        });
                }
                if (language === "german") {
                    message.guild.channels.get(message.channel.id)
                        .send({
                            embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("`" + config.prefix + "settings pingrole [RollenName; RollenId, false]`**!**")
                        });
                }
                return;
            }
            tickets [message.guild.id].settings.ticketCreationPing = role.id;
            fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
                if(err) throw err;
            });
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("You have successfully changed the role to be marked\nwhen opening a ticket to `" + role.name + "`.")
                    });
                return;
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Du hast die Rolle, die bei der Eröffnung eines Tickets markiert werden soll,\nerfolgreich zu `" + role.name + "` geändert.")
                    });
                return;
            }
        }
        if(args[0].toLowerCase() === "ticketformat") {
            if (args[1] === undefined) {
                if (language === "english") {
                    message.guild.channels.get(message.channel.id)
                        .send({
                            embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("`" + config.prefix + "settings ticketformat [example: 🎫-; false]`**!**")
                        });
                } else if (language === "german") {
                    message.guild.channels.get(message.channel.id)
                        .send({
                            embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("`" + config.prefix + "settings ticketformat [bspw.: 🎫-; false]`**!**")
                        });
                }
                return;
            }
            if(args[1].toLowerCase() === "false") {
                tickets [message.guild.id].settings.ticketchannelFormat = args[1].toLowerCase();
                fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
                    if(err) throw err;
                });
                if(language === "english") {
                    message.guild.channels.get(message.channel.id)
                        .send({embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("You have successfully deactivated the additional text in front of the ticketid.")
                        });
                    return;
                }
                if(language === "german") {
                    message.guild.channels.get(message.channel.id)
                        .send({embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("Du hast den zusätzlichen Text, der vor der TicketId steht, erfolgreich deaktiviert.")
                        });
                    return;
                }
            }
            if(args[1].length > 10) {
                if(language === "english") {
                    message.guild.channels.get(message.channel.id)
                        .send({embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("You can not specify more than 10 characters.")
                        });
                    return;
                }
                if(language === "german") {
                    message.guild.channels.get(message.channel.id)
                        .send({embed: new discord.RichEmbed()
                                .setColor("#7c0101")
                                .setTitle("__**" + message.client.user.username + "**__")
                                .setDescription("Du kannst nicht mehr als 10 Zeichen angeben.")
                        });
                    return;
                }
            }
            tickets [message.guild.id].settings.ticketchannelFormat = args[1].toLowerCase();
            fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
                if(err) throw err;
            });
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("You have successfully changed the additional text\nin front of the ticketid to `" + args[1].toLowerCase() + "`.")
                    });
                return;
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Du hast den zusätzlichen Text vor der TicketId erfolgreich\nzu `" + args[1].toLowerCase() + "` geändert.")
                    });
                return;
            }
        }
    }
};