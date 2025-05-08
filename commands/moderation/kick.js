const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a member from the server.")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The member to kick.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("The reason for kicking the member.")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({
                content: "This command can only be used in a server.",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({
                content: "You do not have permission to use this command.",
                flags: MessageFlags.Ephemeral,
            });
        }

        const target = interaction.options.getMember("target");
        const reason = interaction.options.getString("reason") || "No reason provided.";
        if (!target) {
            return interaction.reply({
                content: "That user is not in this server!",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: "You cannot kick yourself!",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (target.id === interaction.guild.ownerId) {
            return interaction.reply({
                content: "You cannot kick the server owner!",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (target.id === interaction.client.user.id) {
            return interaction.reply({
                content: "You cannot kick me!",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (!target.kickable) {
            return interaction.reply({
                content: "I cannot kick this user!",
                flags: MessageFlags.Ephemeral,
            });
        }

        try {
            await target.kick(reason);
            return interaction.reply({
                content: `Successfully kicked ${target.user.tag} from the server. Reason: ${reason}`,
            });
        } catch (error) {
            console.error("Error kicking user:", error);
            return interaction.reply({
                content: "There was an error trying to kick that user.",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
};