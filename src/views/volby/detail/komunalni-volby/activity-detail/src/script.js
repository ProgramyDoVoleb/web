import {url, date, number, truncate, sortBy, domain, pct, unique} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/components/results/helpers';

export default {
	name: 'layout-volby-aktivity-detail',
	props: ['party', 'partyID', 'data', 'id', 'obec'],
  	methods: {
		url,
		date,
		number,
		truncate,
		sortBy,
		domain, unique, pct,
		colorByItem, logoByItem
  	}
};
