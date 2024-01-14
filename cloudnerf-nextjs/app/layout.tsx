import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Layout } from "antd";
import HeaderComponent from "./components/HeaderComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "CloudNeRF",
	description: `Explore cutting-edge 3D model synthesis with our NeRF Evaluation
  App. Select, compare, and evaluate different Neural Radiance Fields methods on
  various datasets. Experience seamless integration of Next.js and Supabase,
  enhanced with Docker for reproducibility. Dive into the future of neural
  rendering and view synthesis, optimized for researchers and enthusiasts in 3D
  modeling and AI.`,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AntdRegistry>
					<Layout>
						<HeaderComponent />
						{children}
					</Layout>
				</AntdRegistry>
			</body>
		</html>
	);
}
