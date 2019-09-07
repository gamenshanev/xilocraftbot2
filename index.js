const discord = require("discord.js");
const botConfig = require("./botconfig.json");

const fs = require("fs");

const bot = new discord.Client();
bot.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) =>{

    if(err)console.log(err);

    var jsFiles = files.filter(f => f.split(".").pop() === "js");

    if(jsFiles <=0) {
        console.log("Files not found. Sorry");
        return;        
    }

    jsFiles.forEach((f, i) => {

        var fileGet = require(`./commands/${f}`);
        console.log(`File ${f} is ready`);

        bot.commands.set(fileGet.help.name, fileGet);

    })

});


bot.on("ready", async () => {

    console.log(`${bot.user.username} is nu online en klaar voor gebruik.`);

    bot.user.setActivity(`!ticket`, { type: "WATCHING" });
    	
    bot.on("guildMemberAdd", member => {
        var role = member.guild.roles.find("name", "Bezoeker"); 
        if (!role) return;
        member.addRole(role);
 
        const channel = member.guild.channels.find("name", "👋welkom-leave👋");
        if (!channel) console.log("Kan het kanaal niet vinden.");
     
        var joinEmbed = new discord.RichEmbed()
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL)
            .setDescription(`Hoi ${member.user.username}, Welkom op **GoBots - BotMaker** Discord Server.`)
            .setColor("#00FF00")
            .setTimestamp()
            .setFooter("Gebruiker gejoined.");
     
        channel.send(joinEmbed);
 

      });   
    });
    bot.on("guildMemberRemove", member => {
 
        const channel = member.guild.channels.find("name", "👋welkom-leave👋");
        if (!channel) console.log("Kan het kanaal niet vinden.");
     
        var leaveEmbed = new discord.RichEmbed()
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL)
            .setColor("#FF0000")
            .setTimestamp()
            .setFooter("Gebruiker Geleaved.");
     
        channel.send(leaveEmbed);
     

});


bot.on("message", async message => {

    if (message.author.bot) return;

    if (message.channel.type === "dm") return;

    var prefix = botConfig.prefix;

    if(message.content.startsWith("!"));

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    var arguments = messageArray.slice(1);


    var commands = bot.commands.get(command.slice(prefix.length));

    if(commands) commands.run(bot,message, arguments);


    
});

bot.login(botConfig.token);
