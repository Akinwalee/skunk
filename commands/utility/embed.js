const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Create an embed message.")
        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("The title of the embed.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("description")
                .setDescription("The description of the embed.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("color")
                .setDescription("The color of the embed in hex format (e.g., #FF5733).")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("footer")
                .setDescription("The footer text of the embed.")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("image")
                .setDescription("The image URL to include in the embed.")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("thumbnail")
                .setDescription("The thumbnail URL to include in the embed.")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("author")
                .setDescription("The author text of the embed.")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("url")
                .setDescription("The URL to link the title to.")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({
                content: "This command can only be used in a server.",
                flags: MessageFlags.Ephemeral,
            });
        }

        try{
            const title = interaction.options.getString("title");
            const description = interaction.options.getString("description");
            const color = interaction.options.getString("color") || "#FFFFFF";
            const footer = interaction.options.getString("footer");
            const image = interaction.options.getString("image");
            const thumbnail = interaction.options.getString("thumbnail");
            const author = interaction.options.getString("author");
            const url = interaction.options.getString("url");

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(color)
                .setFooter({ text: footer })
                .setImage(image)
                .setThumbnail(thumbnail)
                .setAuthor({ name: author, url: url })
                .setURL(url);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error creating embed:", error);
            return interaction.reply({
                content: "There was an error creating the embed.",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
};
