import { colorByItem, logoByItem } from '@/pdv/helpers';
import { con, type, truncate } from '@/pdv/helpers';
import { cdn, missing } from '@/stores/core';

export default {
	name: 'person-preview-block',
	props: ['cand', 'data', 'current', 'link'],
	data: function () {
		return {
			cdn,
			missing,
			width: window.innerWidth
		}
	},
	computed: {
		nominee: function () {
			return this.data.cis.strany.find(x => x.VSTRANA === this.cand.NSTRANA) || this.current
		},
		member: function () {
			return this.data.cis.strany.find(x => x.VSTRANA === this.cand.PSTRANA)
		},
		parties: function () {
			var list = [];

			if (this.cand.NSTRANA && this.cand.PSTRANA != 80) {
				if (!list.find(x => x.VSTRANA === this.cand.NSTRANA)) list.push(this.data.cis.strany.find(x => x.VSTRANA === this.cand.NSTRANA));
			}

			if (this.cand.PSTRANA && this.cand.PSTRANA != 99) {
				if (!list.find(x => x.VSTRANA === this.cand.PSTRANA)) list.push(this.data.cis.strany.find(x => x.VSTRANA === this.cand.PSTRANA));
			}

			if (this.cand.VSTRANA && [997,998,999].indexOf(this.cand.VSTRANA) === -1) {
				if (!list.find(x => x.VSTRANA === this.cand.VSTRANA) && !this.data.cis.strany.find(x => x.VSTRANA === this.cand.VSTRANA).$coalition) list.push(this.data.cis.strany.find(x => x.VSTRANA === this.cand.VSTRANA));

				if (this.data.cis.strany.find(x => x.VSTRANA === this.cand.VSTRANA).$coalition) {
					this.data.cis.strany.find(x => x.VSTRANA === this.cand.VSTRANA).$coalition.forEach(member => {
						if (!list.find(x => x.VSTRANA === member.VSTRANA)) list.push(member);
					})
				}
			}

			if (this.cand.$data.support) {
				this.cand.$data.support.filter(x => typeof x.value === 'number').forEach(sup => {
					if (!list.find(x => x.VSTRANA === sup.value)) list.push(this.data.cis.strany.find(x => x.VSTRANA === sup.value));
				});
			}

			list.splice(list.findIndex(x => x.VSTRANA === this.cand.NSTRANA), 1);

			return list;
		}
	},
	methods: {
		colorByItem, logoByItem, con, type, truncate,
		checkDuplicates: function (list) {
			var arr = [];

			list.forEach(x => {
				if (!arr.find(y => y.value === x.value)) arr.push(x);
			});

			return arr;
		},
	},
	mounted: function () {
		window.addEventListener('resize', () => this.width = window.innerWidth)
	}
};
