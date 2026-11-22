import { colorByItem, logoByItem, con, isWoman, sortBy } from '@/pdv/helpers';

export default {
	name: 'layout-pointer-card',
	props: ['current', 'data', 'volby', 'strana'],
	data: function () {
		return {

		}
	},
	components: {

	},
	computed: {
		$volby: function () {
			return this.volby;
		},
		$strana: function () {
			return this.strana;
		}
	},
  	methods: {
		colorByItem,
		logoByItem,
		con, 
		isWoman,
		sortBy,
		shiftNK: function (list) {

			var arr = [].concat(list);

			var nkIndex = arr.findIndex(x => x.VSTRANA === 80);
			var nk = arr.find(x => x.VSTRANA === 80);

			if (nkIndex > -1) {
				arr.splice(nkIndex, 1);
				arr.push(nk);
			}

			return arr;
		},
		sortByKandidati: function (list) {
			var arr = [].concat(list);

			arr.sort((a, b) => this.current.$kandidati.filter(x => x.NSTRANA === b.VSTRANA && x.PLATNOST === 'A').length - this.current.$kandidati.filter(x => x.NSTRANA === a.VSTRANA && x.PLATNOST === 'A').length)

			return arr;
		}
  	}
};
