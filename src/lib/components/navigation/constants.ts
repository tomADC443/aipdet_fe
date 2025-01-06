import House from 'lucide-svelte/icons/house';
import LandPlot from 'lucide-svelte/icons/land-plot';
import Satellite from 'lucide-svelte/icons/satellite';

import ChartArea from 'lucide-svelte/icons/chart-area';
import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
import type { ComponentType } from 'svelte';

type NavItem = {
	site: string;
	href: string;
	icon: ComponentType;
	label: string;
};

export const navItems: NavItem[] = [
	{ site: 'dashboard', href: '/app/dashboard', icon: House, label: 'Dashboard' },
	{ site: 'aoi', href: '/app/aoi', icon: LandPlot, label: 'AOIs' },
	{ site: 'task', href: '/app/task', icon: Satellite, label: 'Tasks' },
	{ site: 'report', href: '/app/report', icon: ChartArea, label: 'Reports' },
	{ site: 'alerting', href: '/app/alerting', icon: TriangleAlert, label: 'Alerting' }
];
