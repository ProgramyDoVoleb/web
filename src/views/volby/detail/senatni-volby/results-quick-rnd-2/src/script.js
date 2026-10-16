import {useData} from '@/stores/data';
import axios from 'axios';
import {date, sortBy, truncate, number, con} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';

import ElectionDuel from '@/components/results/people/duel/do.vue';

export default {
	name: 'volby-senat-results-quick',
	props: ['data', 'obvod'],
	components: {
		ElectionDuel
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
		},
		obvodData: function () {
			var res = [];

			if (this.obvod != 'all' && this.data) {
				var obvod = this.csu.OBVOD.find(x => x.$attributes.CISLO === this.obvod);

				obvod.KANDIDAT.forEach(cand => {
					if (typeof cand.$attributes.HLASY_2KOLO != 'undefined') {

						var o = {...this.data.list[0].$kandidati.find(x => x.CKAND == cand.$attributes.PORADOVE_CISLO)};

						o.color = colorByItem(o, this.data, 'NSTRANA');
						o.graph = cand.HLASY_PROC_2KOLO;
						o.logo = logoByItem(o, this.data, 'NSTRANA');
						o.label = o.JMENO + ' ' + o.PRIJMENI;
						o.initials = o.JMENO[0] + o.PRIJMENI[0];
						o.link = '/volby/senatni-volby/' + o.volby + '/kandidat/' + o.id;
						o.mandate = false;
						o.no = o.CKAND;
						o.party = o.NAZEV_VS;
						o.passed = true;
						o.pct = cand.HLASY_PROC_2KOLO || 50;
						o.photo = con(o.$data, 'photo', logoByItem(o, this.data, 'NSTRANA'));
						o.short = o.PRIJMENI;
						o.votes = cand.HLASY_2KOLO;		
						
						o.round2 = {
							pct: o.pct,
							graph: o.graph,
							votes: o.votes
						}

						res.push(o);
					}
				});
			}

			return res;
		}
	},
	methods: {
		date, sortBy, truncate,	colorByItem, logoByItem, number,
		loadCSU: async function () {
			var url = this.sources.se173;

			if (this.loadInProgress === false) {
				this.loadInProgress = true;

				axios.post('https://admin.programydovoleb.cz/api.php?action=/elections/results-quick-rnd-2/' + this.obvod + '?c=' + (new Date()).getTime(), {
					url
				}).then(response => {
					if (response.status === 200 && response.data.code === 200) {
						this.csu = response.data.csu;
					}

					setTimeout(() => this.loadInProgress = false, 2500);
				});
			}
		},
		best: function (obvod) {
			var res = 'čeká na data';

			var list = this.s(obvod.KANDIDAT);

			if (list.find(x => x.$attributes.HLASY_2KOLO > 0)) {
				if (list[0].$attributes.HLASY_PROC_2KOLO > 50) {
					res = list[0].$attributes.PRIJMENI + ' ' + list[0].$attributes.HLASY_PROC_2KOLO;
				} else {
					res = list[0].$attributes.PRIJMENI + ' ' + list[0].$attributes.HLASY_PROC_2KOLO + ' · ' + list[1].$attributes.PRIJMENI + ' ' + list[1].$attributes.HLASY_PROC_2KOLO;
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
			arr.sort((a,b) => b.$attributes.HLASY_PROC_2KOLO - a.$attributes.HLASY_PROC_2KOLO);
			return arr;
		}
	},
	mounted: function () {
		this.loadCSU();

		setInterval(() => this.loadCSU(), 1000 * 60 * 5); // every 5 minutes
	}
};
