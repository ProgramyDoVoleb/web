import {url, date, domain} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import enums from '@/stores/enums/elections.js'

export default {
	name: 'EventItem',
	props: ['item', 'party', 'data', 'noTag', 'link', 'bod', 'short'],
	data: function () {
		return {
			enums
		}
	},
	methods: {
		url, date, domain, colorByItem
	},
	computed: {
		color: function () {
			var c = 'var(--blue)';

			if (this.item.csu_id && this.item.csu_table != 'csu_volby') {
				if (this.party.ZKRATKA) {
					c = colorByItem(this.party, this.data, 'VSTRANA')
				} else if (this.party.PSTRANA) {
					c = colorByItem(this.party, this.data, 'PSTRANA')
				} else {
					c = colorByItem(this.party, this.data, 'NSTRANA')
				}
			}

			return c;
		}
	}
};
