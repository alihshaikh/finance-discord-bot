const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, Client } = require('discord.js');
const { execute } = require('../fun/ping');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Creates a server invitation link shareable with friends'),
    async execute(interaction) {
        let invitationLifetimeInSeconds = 86400;
        let maximumInvitationUses = 5;
        const inviteURL = await interaction.guild.invites.create(
            interaction.channel, {
                maxAge: invitationLifetimeInSeconds,
                maxUses: maximumInvitationUses
            }
        );

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.guild.name} Server Invitation`)
            // .setAuthor(`name: ${interaction.user.username}`) // fix this
            .setDescription(`Invite Link: ${inviteURL}`)
            .setFooter({text: `This invitation will be valid for ${invitationLifetimeInSeconds / 3600} hours and a maximum of ${maximumInvitationUses} uses.`})
            .setTimestamp()

        await interaction.reply({embeds: [embed]});
    },
};