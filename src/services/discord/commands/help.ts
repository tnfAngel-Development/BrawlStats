// Local Imports
import { BaseCommand } from '../classes/BaseCommand';

// Local Typings Imports
import type { CommandContext } from '../classes/CommandContext';

// External Imports
import { getBorderCharacters, table } from 'table';

module.exports = new BaseCommand({
	name: 'help',
	alias: ['ayuda', 'comandos', 'commands'],
	description: 'Muestra todos los comandos del bot',
	permissions: {
		user: [],
		bot: [],
	},
	run: async (ctx: CommandContext): Promise<void> => {
		const { message, client } = ctx;

		const commands = client.discord.extensions.commandManager.getCommands();

		const data = [['Nombre', 'Descripción']];

		commands.forEach((command: BaseCommand): void => {
			data.push([command.name, command.description]);
		});

		const tableConfig = {
			border: getBorderCharacters('norc'),
			header: {
				content: 'Comandos del bot',
			},
		};

		await message.reply({
			content: client.discord.util.toCodeBlock(
				'md',
				table(data, tableConfig)
			),
		});
	},
});
