const { EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const { CHANNEL_ID } = process.env;

// Helper function to log moderation actions to a channel

async function logModerationAction(interaction, actionType, author, targetUser, reason) {
    const logChannelId = CHANNEL_ID;
    const logChannel = interaction.guild.channels.cache.get(logChannelId);

    if (!logChannel) {
        console.error(`Log channel with ID ${logChannelId} not found.`);
        return;
    }

    const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle(`Moderation Action: ${actionType}`)
        .addFields(
            { name: 'Target User', value: `${targetUser}`, inline: true },
            { name: 'Reason', value: `${reason}`, inline: true },
            { name: 'Moderator', value: `${author}`, inline: true }
        )
        .setTimestamp();
    
        try {
            await logChannel.send({ embeds: [embed] });
        }
        catch (error) {
            console.error("Error sending log message:", error);
            await interaction.reply({
                content: "There was an error trying to send the log message.",
                ephemeral: true,
            });
        }
    }

module.exports = {
    logModerationAction,
};