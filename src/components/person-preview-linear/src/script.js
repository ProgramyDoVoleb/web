import { colorByItem, logoByItem } from '@/pdv/helpers';
import { con, type, isWoman } from '@/pdv/helpers';
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
		},
		elected: function () {
			return (this.cand.MANDAT === 'A' || (this.cand.ZVOLEN_K1 && this.cand.ZVOLEN_K1 === 1) || (this.cand.ZVOLEN_K2 && this.cand.ZVOLEN_K2 === 1))
		},
		rnd2: function () {
			return (this.cand.ZVOLEN_K1 && this.cand.ZVOLEN_K1 === 2 && (!this.cand.ZVOLEN_K2 || this.cand.ZVOLEN_K2 === 3));
		}
	},
	methods: {
		colorByItem, logoByItem, con, type, isWoman,
		checkDuplicates: function (list) {
			var arr = [];

			list.forEach(x => {
				if (!arr.find(y => y.value === x.value)) arr.push(x);
			});

			return arr;
		},
	}
};
