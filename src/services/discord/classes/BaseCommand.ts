// Local Typings Imports
import type { CommandContext } from './CommandContext';

// External Typings Imports
import type { PermissionResolvable } from 'discord.js';

interface ICommandData {
	name: string;
	alias: string[];
	description: string;
	permissions: {
		user: PermissionResolvable[];
		bot: PermissionResolvable[];
	};
	run: (ctx: CommandContext) => Promise<void>;
}

export class BaseCommand {
	name: string;
	alias: string[];
	description: string;
	permissions: { user: PermissionResolvable[]; bot: PermissionResolvable[] };
	run: (ctx: CommandContext) => Promise<void>;
	constructor(commandData: ICommandData) {
		this.name = commandData.name;
		this.alias = commandData.alias;
		this.description = commandData.description;
		this.permissions = commandData.permissions;
		this.run = commandData.run;
	}
}
