const { SlashCommandBuilder } = require('@discordjs/builders');
const { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, getVoiceConnection } = require('@discordjs/voice');
const { filterFormats } = require('ytdl-core-discord');
const ytdl = require('ytdl-core');
const opus = require('@discordjs/opus')
const ytapi = require('googleapis');
const {youtubeApiKey} = require('../../config.json');
const { default: axios } = require('axios');

module.exports = {
    name: 'play',
    child: true,
    description: 'Play a song in the voice channel',
    help: 'Type /play URL to play a song in a youtube channel',
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song in the voice channel')
        .addStringOption(option =>
            option
                .setName('track')
                .setDescription('The name of the song/video to play')
                .setRequired(true)
        ),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            await interaction.reply('You need to be in a voice channel to use this command.');
            return;
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });

        const track = interaction.options.getString('track');
        
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                key: youtubeApiKey,
                part: 'snippet',
                q: track,
                maxResults: 1
            },
        });

        const videoId = response.data.items[0].id.videoId;

        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        if (!ytdl.validateURL(videoUrl)) return await interaction.reply('could not play a video for the requested track');


        const audioPlayer = createAudioPlayer();
        connection.subscribe(audioPlayer);

        try {
            const stream = ytdl(videoUrl, { quality: 'highestaudio' });
            const resource = createAudioResource(stream, {
                inputType: StreamType.Arbitrary,
                inlineVolume: true,
                encoder: new opus.OpusEncoder(48000, 2),
            });

            audioPlayer.play(resource);
            await interaction.reply(`Now playing: ${videoUrl}`);
        } catch (error) {
            console.error('Error playing audio:', error);
            await interaction.reply('An error occurred while playing audio.');
        }


    },
};