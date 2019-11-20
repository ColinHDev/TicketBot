const discord = require("discord.js");

const tickets = require("../../resources/tickets");

module.exports = {
    name: "info",
    execute(message) {
        let language = tickets[message.guild.id].settings.language;
        if(language === "english") {
            message.guild.channels.get(message.channel.id)
                .send({embed: new discord.RichEmbed()
                        .setColor("#1105c5")
                        .setTitle("__**" + message.client.user.username + "**__")
                        .addField(
                            "__Discord__",
                            "`@Colin#2052`"
                        )
                        .addField(
                            "__DiscordServer__",
                            "`https://discord.gg/aYtgqnt/`"
                        )
                        .addField(
                            "__GitHub-Project__",
                            "`https://github.com/ColinHDev/Colin-TicketBot`"
                        )
                        .setFooter(
                            "Made with ❤ and NodeJS by @Colin#2052! (https://github.com/ColinHDev/)",
                            "https://avatars3.githubusercontent.com/u/54852588?s=400&v=4"
                        )
                })
            ;
            return;
        }
        if(language === "german") {
            message.guild.channels.get(message.channel.id)
                .send({embed: new discord.RichEmbed()
                        .setColor("#1105c5")
                        .setTitle("__**" + message.client.user.username + "**__")
                        .addField(
                            "__Discord__",
                            "`@Colin#2052`"
                        )
                        .addField(
                            "__DiscordServer__",
                            "`https://discord.gg/aYtgqnt/`"
                        )
                        .addField(
                            "__GitHub-Projekt__",
                            "`https://github.com/ColinHDev/Colin-TicketBot`"
                        )
                        .setFooter(
                            "Made with ❤ and NodeJS by @Colin#2052! (https://github.com/ColinHDev/)",
                            "https://avatars3.githubusercontent.com/u/54852588?s=400&v=4"
                        )
                })
            ;
            return;
        }
    }
};