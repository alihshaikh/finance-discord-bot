const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute any player from voice chat for an inputted period of time')
        .addUserOption(option =>
            option.setName('name')
            .setDescription('The alias of the user you would like to mute')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('duration')
            .setDescription('Mute duration in minutes')
            .setRequired(true)
            ),
    async execute(interaction) {

        let inputGuildMember = interaction.options.getUser('name');
        let duration = parseInt(interaction.options.getString('duration'));

        /* Validate User Calling Mute Permissions*/
        try {
            let canMute = interaction.member.permissions.has('MUTE_MEMBERS') 
        }  catch {
            return await interaction.reply('You do not permission to use this command!');
        }
        
        /* Validate Inputs */
        if(!inputGuildMember) return await interaction.reply(`User does not exist.`);
        if (inputGuildMember === interaction.user) return await interaction.reply(`Cannot mute oneself.`);
        if(duration < 0) return await interaction.reply('Invalid mute duration! (negative duration)');
        if(duration > 120) return await interaction.reply('Cannot mute player for longer than 2 hours.');

        const guildMemberId = interaction.guild.members.cache.get(inputGuildMember.id);

        const voiceChannel = guildMemberId.voice.channel;

        if(voiceChannel) {
            guildMemberId.voice.setMute(true);

            await interaction.reply(`${interaction.options.getUser('name')} has been muted for ${interaction.options.getString('duration')} minutes(s).`)
            setTimeout(() => {
                guildMemberId.voice.setMute(false);
            }, duration * 60 * 1000);
        }
        else {
            await interaction.reply('The user is not in a voice channel.');
        }

    }
};
