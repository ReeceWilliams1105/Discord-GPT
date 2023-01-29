/* eslint-disable brace-style */
/* eslint-disable indent */
const { Configuration, OpenAIApi } = require('openai');
const { SlashCommandBuilder } = require('discord.js');
const { OPENAI_API_KEY } = require('../config.json');

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('codegen')
		.setDescription('Generates Code from text using a GPT API')
        .addStringOption(option =>
            option
                .setName('request')
                .setDescription('Your request to generate code')),
	async execute(interaction) {
        const request = interaction.options.getString('request') ?? 'false';
        if (request == 'false') {
            await interaction.reply({ content: 'No request provided', ephemeral: true });
        } else {
            await interaction.deferReply();
            const response = await getResponse(request);
            console.log('here' + response);
            const response2 = '``` ' + response.trim() + '```';
            await interaction.editReply(response2);
            await interaction.followUp('Original Request: ' + request);
        }
	},
};

async function getResponse(req)
{
    try {
        const completion = await openai.createCompletion({
            model: 'code-davinci-002',
            prompt: req,
            temperature: 0,
            max_tokens: 250,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            n: 1,
        });
        return completion.data.choices[0].text;
      } catch (error) {
        if (error.response) {
          console.error(error.response.status, error.response.data);
        } else {
          console.error(`Error with OpenAI API request: ${error.message}`);
        }
        return ('error');
    }
}