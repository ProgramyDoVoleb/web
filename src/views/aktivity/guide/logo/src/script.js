
import { colorByItem, logoByItem } from '@/pdv/helpers';

export default {
	name: 'ActivityLogo',
	props: ['party', 'data'],
	methods: {colorByItem, logoByItem}
};
