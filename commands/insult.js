const { Configuration, OpenAIApi } = require('openai');
const { SlashCommandBuilder } = require('discord.js');
const { OPENAI_API_KEY } = require('../config.json');

const configuration = new Configuration({
	apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('insult')
		.setDescription('Generates an insult for the select user')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('User to insult')
				.setRequired(true)),
	async execute(interaction) {
		const target = interaction.options.getUser('target') ?? 'false';
		if (target == 'false') {
			await interaction.reply({ content: 'No request provided', ephemeral: true });
		}
		else {
			await interaction.deferReply();
			const request = 'Generate a disparaging remark about ' + target.username;
			const response = await getResponse(request);
			await interaction.editReply(response.trim());
		}
	},
};

async function getResponse(req) {
	try {
		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: req,
			temperature: 0.7,
			max_tokens:100,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 0.0,
			n: 1,
		});
		return completion.data.choices[0].text;
	}
	catch (error) {
		if (error.response) {
			console.error(error.response.status, error.response.data);
		}
		else {
			console.error(`Error with OpenAI API request: ${error.message}`);
		}
		return ('error');
	}
}