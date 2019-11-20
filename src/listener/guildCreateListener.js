const fs = require("fs");

const tickets = require("../../resources/tickets");

module.exports.run = (guild) => {
    tickets [guild.id] = {
        settings: {
            language: "english",
            ticketchannelFormat: "🎫-",
            ticketCreationPing: guild.defaultRole.id
        }
    };
    fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
        if(err) throw err;
    });
};