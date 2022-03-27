export {};

// External Typings Imports
import { Client as BSClient } from 'brawlstats';

// Local Imports
import { BrawlStarsClientConfig } from './config';

// Local Typings Imports
import type { BrawlStatsClient } from '../../client';

const config = new BrawlStarsClientConfig();

export class BrawlStarsClient extends BSClient {
	config: BrawlStarsClientConfig;
	log: {
		error: (message: string) => void;
		warn: (message: string) => void;
		info: (message: string) => void;
		debug: (message: string) => void;
	};
	client: BrawlStatsClient;
	constructor(client: BrawlStatsClient, options: any) {
		super(options);

		// Client
		this.client = client;

		// Logs
		this.log = {
			error: (message: string): void =>
				this.client.log.error(
					`[ ${this.client.logColors.magenta('BS')} ] ${message}`
				),
			warn: (message: string): void =>
				this.client.log.warn(
					`[ ${this.client.logColors.magenta('BS')} ] ${message}`
				),
			info: (message: string): void =>
				this.client.log.info(
					`[ ${this.client.logColors.magenta('BS')} ] ${message}`
				),
			debug: (message: string): void =>
				this.client.log.debug(
					`[ ${this.client.logColors.magenta('BS')} ] ${message}`
				),
		};

		// Config
		this.config = config;
	}

	async start(): Promise<void> {
		this.log.info(
			`Starting ${this.client.logColors.cyan('Brawl Stars Client')}...`
		);
	}
}

module.exports = (client: BrawlStatsClient): BrawlStarsClient =>
	new BrawlStarsClient(client, {
		token: config.api.token,
	});
