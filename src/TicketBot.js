const fs = require("fs");

const discord = require("discord.js");
const client = new discord.Client();

client.commands = new discord.Collection();
const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require("./commands/" + file);
    client.commands.set(command.name, command);
}

const readyListener = require("./listener/readyListener");
const rawListener = require("./listener/rawListener");
const guildCreateListener = require("./listener/guildCreateListener");
const guildDeleteListener = require("./listener/guildDeleteListener");


const config = require("../resources/config");
const tickets = require("../resources/tickets");
const interactCooldown = {};


client.login(config.token);


client.on("ready", () => {
    for(let guildId in tickets) {
        if(!client.guilds.has(guildId)) {
            delete tickets [guildId];
            fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
                if(err) throw err;
            });
        }
    }
    client.guilds.forEach(guild => {
        if(tickets[guild.id] === undefined) {
            tickets [guild.id] = {
                settings: {
                    language: "english",
                    ticketchannelFormat: "🎫-",
                    ticketCreationPing: client.guilds.get(guild.id).defaultRole.id
                }
            };
            fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
                if(err) throw err;
            });
        }
    });
    readyListener.run(client);
});
client.on("guildCreate", (guild) => {
    guildCreateListener.run(guild);
});
client.on("guildDelete", (guild) => {
    guildDeleteListener.run(guild);
});
client.on("raw", packet => {
    if (packet.t !== "MESSAGE_REACTION_ADD") return;
    if(tickets[packet.d["guild_id"]].createTicketChannel === undefined) return;
    let guild = client.guilds.get(packet.d["guild_id"]);
    if(!checkTicketSystem(guild)) return;
    let channel = guild.channels.get(packet.d["channel_id"]);
    let user = guild.members.get(packet.d["user_id"]);
    if(user.user.bot) return;
    channel.fetchMessage(packet.d["message_id"]).then(message => {
        if(message.id === tickets[guild.id].createTicketChannel.messageId) {
            if(packet.d.emoji.name !== "🎫") return;
        } else if(() => {
            for (let ticketId in tickets[message.guild.id].tickets) {
                if(ticketId === channel.id) return true;
            }
            return false;
        }) {
            if (tickets[guild.id].tickets[channel.id].messageId !== message.id) return;
            if (
                packet.d.emoji.name !== "🚫" &&
                packet.d.emoji.name !== "🔒" &&
                packet.d.emoji.name !== "🔓"
            ) return;
        } else return;
        if(interactCooldown[message.author.id] + config.interactCooldown >= new Date().getTime()) {
            let language = tickets[message.guild.id].settings.language;
            if(language === "english") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("You can only interact with the bot every " + (config.interactCooldown / 1000).toString() + " seconds.")
                    })
                    .then(r =>
                        r.delete(config.deleteMessagesTime));
            }
            if(language === "german") {
                message.guild.channels.get(message.channel.id)
                    .send({embed: new discord.RichEmbed()
                            .setColor("#7c0101")
                            .setTitle("__**" + message.client.user.username + "**__")
                            .setDescription("Du kannst nur alle " + (config.interactCooldown / 1000).toString() + " Sekunden mit dem Bot interagieren.")
                    })
                    .then(r =>
                        r.delete(config.deleteMessagesTime));
            }
            if(message.reactions.find(messageReaction => messageReaction.emoji.name === packet.d.emoji.name) instanceof discord.MessageReaction) {
                message.reactions.find(messageReaction => messageReaction.emoji.name === packet.d.emoji.name)
                    .remove(user)
                    .then(messageReaction => {
                        if(!messageReaction.users.has(client.user.id)) {
                            if (messageReaction.emoji.name === "🎫") {
                                messageReaction.message.react(messageReaction.emoji.name);
                            } else if (messageReaction.emoji.name === "🚫") {
                                messageReaction.message.react(messageReaction.emoji.name);
                            } else if (messageReaction.emoji.name === "🔒") {
                                messageReaction.message.react(messageReaction.emoji.name);
                            } else if (messageReaction.emoji.name === "🔓") {
                                messageReaction.message.react(messageReaction.emoji.name);
                            }
                        }
                    });
            }
            return;
        }
        interactCooldown[message.author.id] = new Date().getTime();
        rawListener.run(packet, message);
    });
});


client.on("message", message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    if (message.channel.type !== "text") return;
    if(!message.guild.channels.get(message.channel.id).permissionsFor(client.user).has("SEND_MESSAGES")) return;
    if(interactCooldown[message.author.id] + config.interactCooldown >= new Date().getTime()) {
        let language = tickets[message.guild.id].settings.language;
        if(language === "english") {
            message.guild.channels.get(message.channel.id)
                .send({embed: new discord.RichEmbed()
                        .setColor("#7c0101")
                        .setTitle("__**" + message.client.user.username + "**__")
                        .setDescription("You can only interact with the bot every " + (config.interactCooldown / 1000).toString() + " seconds.")
                })
                .then(r =>
                    r.delete(config.deleteMessagesTime));
        }
        if(language === "german") {
            message.guild.channels.get(message.channel.id)
                .send({embed: new discord.RichEmbed()
                        .setColor("#7c0101")
                        .setTitle("__**" + message.client.user.username + "**__")
                        .setDescription("Du kannst nur alle " + (config.interactCooldown / 1000).toString() + " Sekunden mit dem Bot interagieren.")
                })
                .then(r =>
                    r.delete(config.deleteMessagesTime));
        }
        return;
    }
    interactCooldown[message.author.id] = new Date().getTime();
    let args = message.content.slice(config.prefix.length).split(/ +/);
    let command = args.shift().toLowerCase();
    if(
        tickets[message.guild.id].createTicketChannel === undefined &&
        command !== "install" &&
        command !== "settings" &&
        command !== "help" &&
        command !== "info") return;
    if(!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        let language = tickets[message.guild.id].settings.language;
        if(language === "english") {
            message.guild.channels.get(message.channel.id)
                .send({embed: new discord.RichEmbed()
                        .setColor("#7c0101")
                        .setTitle("__**" + message.client.user.username + "**__")
                        .setDescription("An error occurred while executing the command.")
                })
            ;
        }
        if(language === "german") {
            message.guild.channels.get(message.channel.id)
                .send({embed: new discord.RichEmbed()
                        .setColor("#7c0101")
                        .setTitle("__**" + message.client.user.username + "**__")
                        .setDescription("Beim Ausführen des Befehls ist ein Fehler aufgetreten.")
                })
            ;
        }
    }
});

async function checkTicketSystem(guild) {
    let count = 0;
    let idsToCheck = [
        tickets[guild.id].categoryTicketId,
        tickets[guild.id].categoryArchivId,
        tickets[guild.id].createTicketChannel.channelId,
        tickets[guild.id].ticketSupportRolePlusId,
        tickets[guild.id].ticketSupportRoleNormalId,
        tickets[guild.id].ticketBanRoleId
    ];
    idsToCheck.forEach(id => {
        if(guild.channels.has(id)) {
            count++;
        }else if(guild.roles.has(id)) {
            count++;
        }
    });
    return count === 6;
}