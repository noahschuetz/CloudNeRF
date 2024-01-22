export function assertValue<T>(value: T | undefined | null) {
	if (!value) {
		throw new Error(
			`The assertValue recevied undefined.
            This shouldn't happen!
            Good luck with the debugging :)`,
		);
	}

	return value;
}
