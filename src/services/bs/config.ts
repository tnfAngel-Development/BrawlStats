export class BrawlStarsClientConfig {
	api: { readonly token: string };
	constructor() {
		this.api = {
			get token() {
				return process.env.BRAWL_STARS_TOKEN as string;
			},
		};
	}
}
