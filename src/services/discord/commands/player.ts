// Local Imports
import { BaseCommand } from '../classes/BaseCommand';

// Local Typings Imports
import type { CommandContext } from '../classes/CommandContext';

module.exports = new BaseCommand({
	name: 'player',
	alias: [
		'estadísticas',
		'estadisticas',
		'perfil',
		'stats',
		'user',
		'jugador',
	],
	description: 'Mira las estadísticas del perfil de un usuario.',
	permissions: {
		user: [],
		bot: [],
	},
	run: async (ctx: CommandContext): Promise<any> => {
		const { client, message, args } = ctx;

		if (!args[0])
			return message.reply({
				content: ':warning: Debes introducir el tag de un jugador.',
			});

		const playerTag = `#${args[0].replace('#', '')}`;

		const msg = await message.reply({
			content: ':stopwatch: Obteniendo información...',
		});

		const player = await client.bs.getPlayer(playerTag).catch(() => null);

		if (!player)
			return msg.edit({
				content:
					':warning: El tag del jugador introducido es invalido.',
			});

		const brawlers = await client.bs
			.getBrawlers()
			.then((brawlersMap) => [...brawlersMap.values()])
			.catch(() => null);

		if (!brawlers)
			return msg.edit({
				content:
					':warning: Error interno al obtener los brawlers del juego, intentalo de nuevo mas tarde.',
			});

		const playerIcon = `https://brawlace.com/assets/images/icons-players/${player.icon.id}.png`;

		const profileEmbed = new client.discord.MessageEmbed()
			.setAuthor({
				name: `${player.name}${
					player.club ? ` - ${player.club.name}` : ''
				}`,
				iconURL: playerIcon,
			})
			.setColor(parseInt(`0x${player.nameColor.slice(4)}`))
			.addField(
				'<:playerlevel:957733558905094215> Nivel',
				client.util.localeString(player.expLevel),
				true
			)
			.addField(
				'<:trophies:957733558934466620> Trofeos',
				client.util.localeString(player.trophies),
				true
			)
			.addField(
				'<:highesttrophies:957733559274197062> Récord de Trofeos',
				client.util.localeString(player.highestTrophies),
				true
			)
			.addField(
				'<:3v3:957733559349698610> Victorias 3 VS 3',
				client.util.localeString(player.trioVictories),
				true
			)
			.addField(
				'<:duoshowdown:957733558879920148> Victorias Duo',
				client.util.localeString(player.duoVictories),
				true
			)
			.addField(
				'<:showdown:957733558888329276> Victorias Solo',
				client.util.localeString(player.soloVictories),
				true
			)
			.addField(
				'<:brawlers:957738593756000277> Brawlers',
				`${client.util.localeString(
					player.brawlers ? player.brawlers.length : 0
				)}/${brawlers.length}`,
				true
			)
			.addField(
				'<:gadget:957738593730826360> Gadgets',
				`${client.util.localeString(
					player.brawlers
						? player.brawlers
								.map((brawler) => brawler.gadgets)
								.flat().length
						: 0
				)}/${brawlers.map((brawler) => brawler.gadgets).flat().length}`,
				true
			)
			.addField(
				'<:starpower:957738593747615804> Poderes Estelares',
				`${client.util.localeString(
					player.brawlers
						? player.brawlers
								.map((brawler) => brawler.starPowers)
								.flat().length
						: 0
				)}/${
					brawlers.map((brawler) => brawler.starPowers).flat().length
				}`,
				true
			);

		await msg.edit({ content: null, embeds: [profileEmbed] });
	},
});
