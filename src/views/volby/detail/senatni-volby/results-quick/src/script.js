import {useData} from '@/stores/data';
import axios from 'axios';
import {date, sortBy, truncate, number} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';

export default {
	name: 'volby-senat-results-quick',
	props: ['data', 'obvod'],
	components: {

	},
	data: function () {
		return {
			sources: {
				se173: 'https://volby.gov.cz/appdata/senat/20261009/odata/vysledky.xml'
			},
			csu: null,
			list: null,
			loadInProgress: false
		}
	},
	computed: {
		$store: function () {
			return useData()
		}
	},
	methods: {
		date, sortBy, truncate,	colorByItem, logoByItem, number,
		loadCSU: async function () {
			var url = this.sources.se173;
			this.loadInProgress = true;

			axios.post('https://admin.programydovoleb.cz/api.php?action=/elections/results-quick/' + this.obvod + '?c=' + (new Date()).getTime(), {
				url
			}).then(response => {
				if (response.status === 200 && response.data.code === 200) {
					this.csu = response.data.csu;
				}

				setTimeout(() => this.loadInProgress = false, 2500);
			});
		},
		best: function (obvod) {
			var res = 'čeká na data';

			var list = this.s(obvod.KANDIDAT);

			if (list.find(x => x.$attributes.HLASY_1KOLO > 0)) {
				if (list[0].$attributes.HLASY_PROC_1KOLO > 50) {
					res = list[0].$attributes.PRIJMENI + ' ' + list[0].$attributes.HLASY_PROC_1KOLO;
				} else {
					res = list[0].$attributes.PRIJMENI + ' ' + list[0].$attributes.HLASY_PROC_1KOLO + ' · ' + list[1].$attributes.PRIJMENI + ' ' + list[1].$attributes.HLASY_PROC_1KOLO;
				}
				
			}

			// obvod.KANDIDAT.forEach(c => {
			// 	if (Number(c.$attributes.HLASY_1KOLO) > 0 && (!cand || cand.$attributes.HLASY_1KOLO < c.$attributes.HLASY_1KOLO)) {
			// 		cand = c;
			// 	}
			// });

			return res;
		},
		s: function (list) {
			var arr = [];
			list.forEach(x => arr.push(x));
			arr.sort((a,b) => b.$attributes.HLASY_PROC_1KOLO - a.$attributes.HLASY_PROC_1KOLO);
			return arr;
		}
	},
	mounted: function () {
		this.loadCSU();

		setInterval(() => this.loadCSU(), 1000 * 60 * 5); // every 5 minutes
	}
};
