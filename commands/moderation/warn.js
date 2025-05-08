const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data:new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a member in the server.")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The member to warn.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("The reason for warning the member.")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({
                content: "You do not have permission to use this command.",
                ephemeral: true,
            });
        }

        const target = interaction.options.getMember("target");
        const reason = interaction.options.getString("reason") || "No reason provided.";
        if (!target) {
            return interaction.reply({
                content: "That user is not in this server!",
                ephemeral: true,
            });
        }
        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: "You cannot warn yourself!",
                ephemeral: true,
            });
        }
        if (target.id === interaction.guild.ownerId) {
            return interaction.reply({
                content: "You cannot warn the server owner!",
                ephemeral: true,
            });
        }
        if (target.id === interaction.client.user.id) {
            return interaction.reply({
                content: "You cannot warn the bot!",
                ephemeral: true,
            });
        }
        if (target.user.bot) {
            return interaction.reply({
                content: "You cannot warn a bot!",
                ephemeral: true,
            });
        }
        if (!target.kickable) {
            return interaction.reply({
                content: "I cannot warn this user!",
                ephemeral: true,
            });
        }
        try {
            await target.send(`You have been warned in **${interaction.guild.name}** for: ${reason}`);
            return interaction.reply({
                content: `Successfully warned ${target.user.tag} for: ${reason}`,
                ephemeral: true,
            });
        } catch (error) {
            console.error("Error sending warning message:", error);
            return interaction.reply({
                content: "There was an error trying to send the warning message.",
                ephemeral: true,
            });
        }
    }
};