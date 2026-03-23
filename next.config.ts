import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "apod.nasa.gov",
				pathname: "/apod/image/**",
			},
			{
				protocol: "https",
				hostname: "images-assets.nasa.gov",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "api.nasa.gov",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
