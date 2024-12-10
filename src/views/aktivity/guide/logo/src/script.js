
import { colorByItem, logoByItem } from '@/components/results/helpers';

export default {
	name: 'ActivityLogo',
	props: ['party', 'data'],
	methods: {colorByItem, logoByItem}
};
