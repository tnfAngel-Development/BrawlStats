// Local Imports
import { CommandContext } from '../classes/CommandContext';

// Local Typings Imports
import type { BrawlStatsClient } from '../../../client';

// External Typings Imports
import type { GuildChannel, Message, PermissionResolvable } from 'discord.js';

module.exports = async (
	client: BrawlStatsClient,
	message: Message
): Promise<any> => {
	if (message.channel.type === 'DM') return;

	const channel = message.channel as GuildChannel;

	const prefixes = [
		client.discord.config.bot.prefix,
		'BrawlStats ',
		`<@${client.discord.config.bot.id}> `,
		`<@!${client.discord.config.bot.id}> `,
	];

	let prefix: string | null = null;

	for (const testPrefix of prefixes) {
		if (message.content.toLowerCase().startsWith(testPrefix.toLowerCase()))
			prefix = testPrefix;
	}

	if (
		[
			`<@${client.discord.config.bot.id}>`,
			`<@!${client.discord.config.bot.id}>`,
		].includes(message.content)
	) {
		return message.reply({
			content: `:information_source: Mi prefijo en es ${client.discord.util.toCode(
				client.discord.config.bot.prefix
			)}. Usa ${client.discord.util.toCode(
				`${client.discord.config.bot.prefix}help`
			)} para ver los comandos del bot.`,
		});
	}

	if (!prefix) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const commandArg = args[0].toLowerCase();
	args.shift();

	const command =
		client.discord.extensions.commandManager.matchCommand(commandArg);

	if (command) {
		const missingUserPermissions: PermissionResolvable[] = [];
		const missingBotPermissions: PermissionResolvable[] = [];

		if (
			!channel
				.permissionsFor(message.author.id)
				?.has(command.permissions.user)
		) {
			command.permissions.user.forEach(
				(permission: PermissionResolvable): void => {
					if (
						!channel
							.permissionsFor(message.author.id)
							?.has(permission)
					)
						missingUserPermissions.push(permission);
				}
			);
		}

		if (
			!channel
				.permissionsFor(client.discord.config.bot.id)
				?.has(command.permissions.bot)
		) {
			command.permissions.bot.forEach(
				(permission: PermissionResolvable): void => {
					if (
						!channel
							.permissionsFor(client.discord.config.bot.id)
							?.has(permission)
					)
						missingUserPermissions.push(permission);
				}
			);
		}

		if (
			missingUserPermissions.length > 0 ||
			missingBotPermissions.length > 0
		) {
			const parsedMissingUserPermissions = missingUserPermissions
				.map((permission: PermissionResolvable): string =>
					client.discord.util.toCode(permission.toString())
				)
				.join(', ');
			const parsedMissingBotPermissions = missingBotPermissions
				.map((permission: PermissionResolvable): string =>
					client.discord.util.toCode(permission.toString())
				)
				.join(', ');

			if (
				missingUserPermissions.length > 0 &&
				missingBotPermissions.length > 0
			)
				return message.reply({
					content: `Permisos requeridos para el usuario: ${parsedMissingUserPermissions}\nPermisos requeridos para el bot: ${parsedMissingBotPermissions}.`,
				});

			if (
				missingUserPermissions.length > 0 &&
				missingBotPermissions.length === 0
			)
				return message.reply({
					content: `Permisos requeridos para el usuario: ${parsedMissingUserPermissions}.`,
				});

			if (
				missingUserPermissions.length === 0 &&
				missingBotPermissions.length > 0
			)
				return message.reply({
					content: `Permisos requeridos para el bot: ${parsedMissingBotPermissions}.`,
				});
		}

		const ctx = new CommandContext({
			client: client,
			message: message,
			args: args,
		});

		await command.run(ctx).catch(async (error: Error): Promise<void> => {
			console.error(error);
			await message.reply({
				content: `:warning: Ocurrió un error al ejecutar el comando.
				${client.discord.util.toCodeBlock(
					'ts',
					error.stack ?? `${error.name}: ${error.message}`
				)}`,
			});
		});
	}
};
