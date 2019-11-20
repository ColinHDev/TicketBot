const fs = require("fs");

const tickets = require("../../resources/tickets");

module.exports.run = (guild) => {
    delete tickets [guild.id];
    fs.writeFile("./resources/tickets.json", JSON.stringify(tickets, null, 10), err => {
        if(err) throw err;
    });
};