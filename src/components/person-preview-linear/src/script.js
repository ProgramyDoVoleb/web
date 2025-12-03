import { colorByItem, logoByItem } from '@/pdv/helpers';
import { con, type } from '@/pdv/helpers';
import { cdn } from '@/stores/core';

export default {
	name: 'person-preview-linear',
	props: ['cand', 'data', 'current', 'link'],
	data: function () {
		return {
			cdn
		}
	},
	computed: {
		nominee: function () {
			return this.data.cis.strany.find(x => x.VSTRANA === this.cand.NSTRANA) || this.current
		},
		member: function () {
			return this.data.cis.strany.find(x => x.VSTRANA === this.cand.PSTRANA)
		}
	},
	methods: {
		colorByItem, logoByItem, con, type,
		checkDuplicates: function (list) {
			var arr = [];

			list.forEach(x => {
				if (!arr.find(y => y.value === x.value)) arr.push(x);
			});

			return arr;
		},
	}
};
