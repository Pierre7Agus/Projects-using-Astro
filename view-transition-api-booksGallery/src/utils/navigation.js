const getPage = async (url) => {
	const promise = await fetch(url);
	const text = await promise.text();
	const [, data] = text.match(/<body[^>]*>([\s\S]*)<\/body>/i);
	return data;
};

export const startViewTransition = () => {
	if (document.startViewTransition) {
		window.navigation.addEventListener("navigate", (event) => {
			const toUrl = new URL(event.destination.url);

			if (location.origin !== toUrl.origin) return;

			event.intercept({
				async handler() {
					const data = await getPage(toUrl.pathname);

					document.startViewTransition(() => {
						document.body.innerHTML = data;
						document.documentElement.scrollTop = 0;
					});
				}
			});
		});
	}
};
