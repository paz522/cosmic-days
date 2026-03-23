declare module "puppeteer-core" {
	const puppeteer: {
		launch: (options?: any) => Promise<{
			newPage: () => Promise<{
				setContent: (html: string, options?: any) => Promise<void>;
				pdf: (options?: any) => Promise<Buffer>;
			}>;
			close: () => Promise<void>;
		}>;
		default: any;
	};
	export default puppeteer;
}
