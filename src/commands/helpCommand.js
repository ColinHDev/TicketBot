const Discord = require("discord.js");

const config = require("../../resources/config");
const tickets = require("../../resources/tickets");

module.exports = {
    name: "help",
    execute(message) {
        let language = tickets[message.guild.id].settings.language;
        if(language === "english") {
            let embed = new Discord.RichEmbed()
                .setColor("#1105c5")
                .setTitle("__**" + message.client.user.username + "**__")
                .setFooter(
                    "Made with ❤ and NodeJS by @Colin#2052! (https://github.com/ColinHDev/)",
                    "https://avatars3.githubusercontent.com/u/54852588?s=400&v=4");
            if(message.guild.ownerID === message.author.id || message.guild.members.get(message.author.id).hasPermission("MANAGE_GUILD")) {
                embed.setDescription(
                    "**" + config.prefix + "help** - `Receive the help page of the bot.`\n" +
                    "**" + config.prefix + "info** - `Receive information about the bot.`\n" +
                    "**" + config.prefix + "add @[Username / Nickname / Userid]** - `Add a user to a ticket.`\n" +
                    "**" + config.prefix + "install** - `Initialize the ticket-system.`\n" +
                    "**" + config.prefix + "deactivate** - `Deactivate the ticket-system.`\n" +
                    "**" + config.prefix + "settings [Setting] [Input]** - `Change the settings for the ticket-system.`"
                );
            }else{
                embed.setDescription(
                    "**" + config.prefix + "help** - `Receive the help page of the bot.`\n" +
                    "**" + config.prefix + "info** - `Receive information about the bot.`\n" +
                    "**" + config.prefix + "add @[Username / Nickname / Userid]** - `Add a user to a ticket.`\n"
                );
            }
            message.guild.channels.get(message.channel.id).send({embed: embed});
            return;
        }
        if(language === "german") {
            let embed = new Discord.RichEmbed()
                .setColor("#1105c5")
                .setTitle("__**" + message.client.user.username + "**__")
                .setFooter(
                    "Made with ❤ and NodeJS by @Colin#2052! (https://github.com/ColinHDev/)",
                    "https://avatars3.githubusercontent.com/u/54852588?s=400&v=4");
            if(message.guild.ownerID === message.author.id || message.guild.members.get(message.author.id).hasPermission("MANAGE_GUILD")) {
                embed.setDescription(
                    "**" + config.prefix + "help** - `Erhalte die Hilfeseite des Bots.`\n" +
                    "**" + config.prefix + "info** - `Erhalte Informationen über den Bot.`\n" +
                    "**" + config.prefix + "add @[Nutzername / Nickname / NutzerId]** - `Füge einen Nutzer zu einem Ticket hinzu.`\n" +
                    "**" + config.prefix + "install** - `Initialisiere das Ticket-System.`\n" +
                    "**" + config.prefix + "deactivate** - `Deaktiviere das Ticket-System.`\n" +
                    "**" + config.prefix + "settings [Einstellung] [Wert]** - `Ändere die Einstellung für das Ticket-System.`"
                );
            }else{
                embed.setDescription(
                    "**" + config.prefix + "help** - `Erhalte die Hilfeseite des Bots.`\n" +
                    "**" + config.prefix + "info** - `Erhalte Informationen über den Bot.`\n" +
                    "**" + config.prefix + "add @[Nutzername / Nickname / NutzerId]** - `Füge einen Nutzer zu einem Ticket hinzu.`\n"
                );
            }
            message.guild.channels.get(message.channel.id).send({embed: embed});
            return;
        }
    }
};