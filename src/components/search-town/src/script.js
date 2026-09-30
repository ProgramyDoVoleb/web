import {useData} from '@/stores/data';
import { url } from '@/pdv/helpers';
// import { colorByItem, logoByItem } from '@/pdv/helpers';

export default {
	name: 'search-town',
	props: ['elections', 'cb', 'link', 'date', 'prefill', 'num', 'unstyle'],
	data: function () {
		return {
			query: null,
			numUsed: false
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		list: function () {
			var link = 'town/list';

			if (this.date) link += '/' + this.date;
			if (this.elections && !this.date) link += '/' + this.elections;

			return this.$store.getters.pdv(link);
		},
		results: function () {
			var arr = [];

			if (this.query && this.list) {
				var str = url(this.query).split('-').join(' ');

				if (str === "as" || str === "es" || str.length > 2) {
					arr = this.list.list.filter(x => x.$index.includes(str));	
				}
			}

			if (arr.length > 0) {
				// arr.sort((a, b) => a.NAZEVZAST.localeCompare(b.NAZEVZAST, 'cs'));

				if (this.num && this.numUsed === false) {
					var obec = arr.find(x => x.obec == this.num);

					if (obec) {
						this.numUsed = true;
						this.$emit('update', obec);
					} 
				}
			}

			var primary = arr.filter(x => !x.NADRZASTUP).filter(x => x.$index.split(str).length > 1 && x.$index.split(str)[0] === '');
			var intown = arr.filter(x => x.NADRZASTUP).filter(x => x.$index.split(str).length > 1);
			var secondary = arr.filter(x => !x.NADRZASTUP).filter(x => x.$index.split(str).length > 1 && x.$index.split(str)[0] != '');

			return {primary, secondary, intown};
		}
	},
	methods: {
		click: function (item) {
			this.$emit('update', item);
		},
		clear: function () {
			this.query = null;
		}
	},
	mounted: function () {
		if (this.prefill) {
			this.query = this.prefill;
		}
	}
};
