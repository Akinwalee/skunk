const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { logModerationAction } = require('../../utils/log.js');
const { isOnCooldown, setCooldown, getRemainingCooldown } = require('../../utils/cooldown.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to ban.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for banning the member.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({
                content: 'This command can only be used in a server.',
                flags: MessageFlags.Ephemeral,
            });
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: 'You do not have permission to use this command.',
                flags: MessageFlags.Ephemeral,
            });
        }

        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        if (!target) {
            return interaction.reply({
                content: 'That user is not in this server!',
                flags: MessageFlags.Ephemeral,
            });
        }
        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: 'You cannot ban yourself!',
                flags: MessageFlags.Ephemeral,
            });
        }
        if (target.id === interaction.guild.ownerId) {
            return interaction.reply({
                content: 'You cannot ban the server owner!',
                flags: MessageFlags.Ephemeral,
            });
        }
        if (target.id === interaction.client.user.id) {
            return interaction.reply({
                content: 'You cannot ban me!',
                flags: MessageFlags.Ephemeral,
            });
        }
        if (target.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({
                content: 'You cannot ban a member with the same or higher role!',
                flags: MessageFlags.Ephemeral,
            });
        }
        if (target.user.bot) {
            return interaction.reply({
                content: 'You cannot ban a bot!',
                flags: MessageFlags.Ephemeral,
            });
        }
        if (!target.bannable) {
            return interaction.reply({
                content: 'I cannot ban this member!',
                flags: MessageFlags.Ephemeral,
            });
        }
        try {
            if (isOnCooldown(interaction.user.id, 'ban')) {
                const remainingTime = getRemainingCooldown(interaction.user.id, 'ban');
                return interaction.reply({
                    content: `You are on cooldown! Please wait ${remainingTime} seconds before using this command again.`,
                    flags: MessageFlags.Ephemeral,
                });
            }
            await target.ban({ reason });
            if (!target.user.bot) {
                await target.send(`You have been banned from **${interaction.guild.name}** for: ${reason}`);
            }
            await logModerationAction(interaction, 'ban', interaction.user.tag, target.user.tag, reason);
            setCooldown(interaction.user.id, 'ban', 1000);
            return interaction.reply({
                content: `Successfully banned ${target.user.tag} from the server.`,
                flags: MessageFlags.Ephemeral,
            });
        } catch (error) {
            console.error('Error banning member:', error);
            return interaction.reply({
                content: 'There was an error trying to ban that member.',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
};