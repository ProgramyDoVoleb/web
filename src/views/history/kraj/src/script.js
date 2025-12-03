import {useData} from '@/stores/data';
import { useCore, cdn, api } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, type, sortBy} from '@/pdv/helpers';
import {ga, ge} from '@/pdv/analytics';
import ReportModal from '@/components/report-modal/do.vue';
import ListElected from '@/views/history/cr/elected/do.vue';
import ElectionDetail from '@/views/history/volby/detail/do.vue';
import StatsTiny from '@/components/stats/stats-tiny/do.vue';
import StatsTimeline from '@/views/history/cr/timeline/do.vue';
import axios from 'axios';

import { colorByItem, logoByItem } from '@/pdv/helpers';

export default {
	name: 'layout-history-region',
	props: ['id'],
	data: function () {
		return {
			cdn,
			showAll: false,
			showHistory: true,
			showHistoryCandidates: false,
			senateView: 1,
			senatePartyView: 1,
			w: 0,
		}
	},
  components: {
	ListElected,
	ReportModal,
	ElectionDetail,
	StatsTiny,
	StatsTimeline,
  },
	computed: {
		$store: function () {
			return useData()
		},
		core: function () {
			return useCore()
		},
		enums: function () {
			return useEnums()
		},
		election_types: function () {
			return this.enums.elections;
		},
		obec: function () {
			return String(this.num).split('-')[0];
		},
		data: function () {
			var d = this.$store.getters.pdv('history/core/kraj/' + this.id);

			if (d) {
				ga(this.enums.regions[this.id - 1]);
			}

			return d;
		},
		current: function () {
			return this.data ? this.$store.getters.pdv('history/current/kraj/' + this.id) : null;
		},
		history: function () {
			return this.showHistory ? this.$store.getters.pdv('history/history/kraj/' + this.id) : null;
		},
		$core: function () {
			return this.data ? this.data.list[0].$core[0] : null
		},
		$elections: function () {
			var d = this.data ? this.data.list[0].$elections : null;

			if (d) {
				d.past = d.past.sort((a, b) => b.$volby.datum.localeCompare(a.$volby.datum, 'cs')).filter(x => x.$volby.status === 3);

				d.next = [];

				d.upcoming.filter(x => ["EP", "PREZ", "PS"].indexOf(x.typ) > -1).forEach(x => d.next.push(x));
				d.upcoming.filter(x => x.typ === "KV" && x.radne === 1).forEach(x => d.next.push(x));
				d.upcoming.filter(x => x.typ === "KV" && x.radne === 0 && String(x.dotcene).split(this.obec).length > 1).forEach(x => d.next.push(x));
				d.upcoming.filter(x => x.typ === "KZ" && this.$core.KRAJ > 1999).forEach(x => d.next.push(x));
				// if (d.upcoming.find(x => x.typ === "SENAT")) d.upcoming.filter(x => x.typ === "SENAT" && String(x.dotcene).split(',').find(y => y == d.past.find(y => y.$volby.typ === 'SENAT').$data.obvod)).forEach(x => d.next.push(x));
				d.upcoming.filter(x => x.typ === 'SENAT' && this.data.list[0].$core[0].OBVOD && String(x.dotcene).split(',').find(y => Number(y) === Number(this.data.list[0].$core[0].OBVOD))).forEach(x => d.next.push(x));

				d.next.sort((a, b) => (a.datum || '2099-12-31').localeCompare((b.datum || '2099-12-31'), 'cs'));

				// console.log(d.past);
				// console.log(d.next);

				d.next.forEach(el => {

					var typ = this.election_types.find(x => x.key === el.typ);

					if (["EP", "PREZ", "PS"].indexOf(el.typ) > -1) {
						el.link = '/volby/' + typ.hash + '/' + el.id;
					}
					if (el.typ === "KV") {
						el.link = '/volby/' + typ.hash + '/' + el.id + '/obec/' + this.obec;
					}
					if (el.typ === "SENAT") {
						el.link = '/volby/' + typ.hash + '/' + el.id + (d.past.find(y => y.$volby.typ === 'SENAT') ? '/obvod/' + d.past.find(y => y.$volby.typ === 'SENAT').$data.obvod : '');
					}
					if (el.typ === "KZ") {
						el.link = '/volby/' + typ.hash + '/' + el.id + '/kraj/' + this.cis.okres.find(y => y.NUMNUTS === this.$core.OKRES).KRAJ;
					}
				});

				// if (this.showHistory === true) {
				// 	if (this.history) {
				// 		d.past.forEach(el => {
				// 			el.$data = this.history.list[0].$elections.past.find(x => x.$data['$volby'] === el.$data['$volby']).$data;
				// 		});
				// 	}
				// }

				// d.past.forEach(el => {
				// 	el.$data['$ucast'] = []; // d.results.ucast[el.$volby.typ].filter(x => x.volby === el.$volby.id);
				// 	el.$data['$vysledky'] = []; // d.results.vysledky[el.$volby.typ].filter(x => x.volby === el.$volby.id);
				// });
			}


			return d;
		},
		$elected: function () {
			return this.current ? this.current.list[0] : null
		},
		$meta: function () {
			return this.data ? this.data.list[0].$data : null
		},
		cis: function () {
			return this.data ? this.data.cis : null
		},
		_lastKV: function () {
			return this.data ? this.$elections.past.find(x => x.$volby.typ === "KV") : null;
		},
		_listElected: function () {
			var data = {};

			if (this.current) {
				data.cis = this.current.cis;

				var lastData = {
					$vysledky: this._lastKV.$data.$vysledky,
					$strany: this.$elected.$strany,
					$zvoleni: this.$elected.$kandidati.filter(x => x.MANDAT === "A"),
					$dotcene: this.$elected.$obec,
					id: this._lastKV.$volby.id		
				}

				data.list = [lastData];
			}

			return data;
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		colorByItem,
		logoByItem,
		type,
		sortBy,
		gps: function (val) {
			var s = val.split(',');
			return 'https://mapy.cz/zakladni?source=coor&x=' + s[1] + '&y=' + s[0] + '&z=14';
		},
		electionLabel: function (election) {

			if (election.$data.KRZAST) {
				return this.cis.kraj.find(x => x.KRAJ === election.$data.KRZAST).NAZEV;
			} else if (election.$data.obvod) {
				return election.$data.obvod + ' · ' + this.cis.obvod.find(x => x.OBVOD === election.$data.obvod).NAZEV;
			} else if (election.$volby.typ === 'KV') {
				return election.$data.NAZEVZAST
			} else {
				return null;
			}
		},
		statsGraph: function (list) {
			var arr = [];

			try {
				list.forEach(item => {
					arr.push({
						label: Number(item.$volby.datum.split('-').join('')),
						value: item.$data.$ucast[0].UCAST
					})
				})
			} catch (e) {
				// console.log('CHYBA')
			}
			arr.reverse();

			return {values: arr};
		},
		populationGraph: function (list) {
			var arr = [];

			list.forEach(item => {
				arr.push({
					label: Number(item.updated.split(' ')[0].split('-').join('')),
					value: item.value
				})
			})

			arr.reverse();

			return {values: arr};
		},
		click_showHistory: function () {
			this.showHistory = true;
			ge({event: 'history', value: this.id});
		},
		click_showHistoryCandidates: function () {
			this.showHistoryCandidates = true;
			ge({event: 'historyCandidates', value: this.id});
		},
  },
  mounted: function () {
    window.scrollTo(0, 1);
	this.w = window.innerWidth;
	window.addEventListener('resize', () => this.w = window.innerWidth);
  },
  watch: {
	num: function () {
		window.scrollTo(0, 1);
		this.showHistory = false;
		this.showAll = false;
	}
  } 
};