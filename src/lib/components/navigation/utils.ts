export const getNavFromPath = (pathname: string): string | undefined => {
	const splittedRoute = pathname.split('/')[2];
	if (splittedRoute) {
		return splittedRoute.replace('/', '');
	}
	return undefined;
};
