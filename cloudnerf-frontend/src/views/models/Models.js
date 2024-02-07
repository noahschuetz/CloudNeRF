import { Button } from "antd";

export default function Models() {
	return (
		<main>
			<RunModelButton />
		</main>
	);
}

function RunModelButton({ id }) {
	return (
		<Button
			onClick={async () => {
				const res = await fetch(
					"http://localhost:5000/run_model/instantngp/chair",
				);
				console.log(res);
			}}
		>
			Run Instant NGP
		</Button>
	);
}
