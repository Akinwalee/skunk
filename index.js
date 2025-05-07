const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');

dotenv.config();
const { DISCORD_TOKEN } = process.env;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

client.commands= new Collection();

const folderPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(folderPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(folderPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}


client.once(Events.ClientReady, readyClient => {
    console.log(`The client is ready! \n Logged in as ${readyClien.use.tag} (${readyClient.user.id})`);
});
client.on(Events.MessageCreate, message => {
    if (message.author.bot) return;
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
});

client.login(DISCORD_TOKEN)
    .then(() => {
        console.log('Logged in successfully!');
    })
    .catch(err => {
        console.error('Failed to log in:', err);
    });