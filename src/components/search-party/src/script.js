import {useData} from '@/stores/data';
import { url, date} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';

export default {
	name: 'search-party',
	props: ['elections', 'cb', 'link', 'datum'],
	data: function () {
		return {
			query: null
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		list: function () {
			var link = 'party/list-with-history';

			// if (this.date) link += '/' + this.datum;
			// if (this.elections && !this.datum) link += '/' + this.elections;

			var d = this.$store.getters.pdv(link);

			if (d) {
				d.list.forEach(item => {
					item.active = d.cis.strany.find(x => x.VSTRANA === item.VSTRANA).$data.active ? d.cis.strany.find(x => x.VSTRANA === item.VSTRANA).$data.active[0].value : 0
				});
			}

			return d;
		},
		results: function () {
			var arr = null;

			if (this.query.length > 2) {
				var q = url(this.query);
				arr = this.list.list.filter(x => x.indexNAZEV.split(q).length > 1 || x.indexZKRATKA.split(q).length > 1);
				arr.sort((a, b) => a.NAZEV.localeCompare(b.NAZEV, 'cs'));
			}

			return arr;
		}
	},
	methods: {
		colorByItem, logoByItem, date
	}
};
