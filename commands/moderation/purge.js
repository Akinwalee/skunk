const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Delete a specified number of messages from a channel.")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The number of messages to delete.")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: "You do not have permission to use this command.",
                ephemeral: true,
            });
        }

        const amount = interaction.options.getInteger("amount");

        if (amount < 1 || amount > 100) {
            return interaction.reply({
                content: "Please provide a number between 1 and 100.",
                ephemeral: true,
            });
        }

        try {
            const messages = await interaction.channel.bulkDelete(amount, true);
            return interaction.reply({
                content: `Successfully deleted ${messages.size} message(s).`,
                ephemeral: true,
            });
        } catch (error) {
            console.error("Error deleting messages:", error);
            return interaction.reply({
                content: "There was an error trying to delete messages in this channel.",
                ephemeral: true,
            });
        }
    }
};