import {useData} from '@/stores/data';
import { useCore, cdn, api } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, type} from '@/pdv/helpers';
import {ga, ge} from '@/pdv/analytics';
import SearchTown from '@/components/search-town/do.vue';
import ReportModal from '@/components/report-modal/do.vue';
import ListElected from '@/views/obce/detail/elected/do.vue';
import ElectionDetail from '@/views/obce/volby/detail/do.vue';
import StatsTiny from '@/components/stats/stats-tiny/do.vue';
import StatsTimeline from '@/views/obce/detail/timeline/do.vue';
import HistoryCandidates from '@/components/history/town/do.vue';
import axios from 'axios';

import { colorByItem, logoByItem } from '@/components/results/helpers';

export default {
	name: 'layout-town',
	props: ['num'],
	data: function () {
		return {
			cdn,
			showAll: false,
			showHistory: false,
			showHistoryCandidates: false,
			guidelink: '/pruvodce/krajske-a-senatni-volby-2024'
		}
	},
  components: {
	SearchTown,
	ListElected,
	ReportModal,
	ElectionDetail,
	StatsTiny,
	StatsTimeline,
	HistoryCandidates
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
		town: function () {
			var d = this.$store.getters.pdv('town/core/' + this.obec);

			if (d) {
				ga(d.list[0].$core[0].NAZEV);

				this.guidelink = '/pruvodce/krajske-a-senatni-volby-2024?';

				if (d.list[0].$core[0].OBVOD) {
					this.guidelink += 'obvod=' + d.list[0].$core[0].OBVOD + '&';
				}
				
				if (d.list[0].$core[0].KRAJ) {
					this.guidelink += 'kraj=' + d.cis.kraj.find(x => x.NUMNUTS === d.list[0].$core[0].KRAJ).KRAJ + '&';
				}

				this.guidelink += 'obec=' + encodeURIComponent(d.list[0].$core[0].NAZEV) + '&';
				this.guidelink += 'num=' + this.num;
			}

			return d;
		},
		current: function () {
			return this.town ? this.$store.getters.pdv('town/current/' + this.obec) : null;
		},
		history: function () {
			return this.showHistory ? this.$store.getters.pdv('town/history/' + this.obec) : null;
		},
		$core: function () {
			return this.town ? this.town.list[0].$core[0] : null
		},
		$elections: function () {
			var d = this.town ? this.town.list[0].$elections : null;

			if (d) {
				d.past = d.past.sort((a, b) => b.$volby.datum.localeCompare(a.$volby.datum, 'cs')).filter(x => x.$volby.status === 3);

				d.next = [];

				d.upcoming.filter(x => ["EP", "PREZ", "PS"].indexOf(x.typ) > -1).forEach(x => d.next.push(x));
				d.upcoming.filter(x => x.typ === "KV" && x.radne === 1).forEach(x => d.next.push(x));
				d.upcoming.filter(x => x.typ === "KV" && x.radne === 0 && String(x.dotcene).split(this.obec).length > 1).forEach(x => d.next.push(x));
				d.upcoming.filter(x => x.typ === "KZ" && this.$core.KRAJ > 1999).forEach(x => d.next.push(x));
				// if (d.upcoming.find(x => x.typ === "SENAT")) d.upcoming.filter(x => x.typ === "SENAT" && String(x.dotcene).split(',').find(y => y == d.past.find(y => y.$volby.typ === 'SENAT').$data.obvod)).forEach(x => d.next.push(x));
				d.upcoming.filter(x => x.typ === 'SENAT' && this.town.list[0].$core[0].OBVOD && String(x.dotcene).split(',').find(y => Number(y) === Number(this.town.list[0].$core[0].OBVOD))).forEach(x => d.next.push(x));

				d.next.sort((a, b) => (a.datum || '2099-12-31').localeCompare((b.datum || '2099-12-31'), 'cs'));

				console.log(d.past);
				console.log(d.next);

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

				if (this.showHistory === true) {
					if (this.history) {
						d.past.forEach(el => {
							el.$data = this.history.list[0].$elections.past.find(x => x.$data['volby'] === el.$data['volby']).$data;
						});
					}
				}

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
			return this.town ? this.town.list[0].$data : null
		},
		cis: function () {
			return this.town ? this.town.cis : null
		},
		_lastKV: function () {
			return this.town ? this.$elections.past.find(x => x.$volby.typ === "KV") : null;
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
		send_coalition: function () {
			var coal = [];
			var ids = [];

			Object.keys(this.$refs).forEach(key => {
				if (this.$refs[key] && this.$refs[key][0] && this.$refs[key][0].checked) {
					var k = key.split('_party_')[1].split(':');

					coal.push(k[0]);
					ids.push(k[1]);
				}
			});

			if (coal.length > 0 && this.$refs.coal_source) {
					axios.post(api + 'suggest/coalition', {
						obec: this.obec,
						coalition: String(coal.join(',')),
						meta: String(ids.join(',')),
						source: this.$refs.coal_source.value,
						name: this.$refs.coal_name ? this.$refs.coal_name.value : null,
						comment: this.$refs.coal_comment ? this.$refs.coal_comment.value : null
					}).then(response => {
						this.$refs.suggest_coalition.opened = false;
					});
			}
		},
		send_mayor: function () {

			var option = this.$refs.mayor_person.selectedOptions;

			if (this.$refs.mayor_source) {
					axios.post(api + 'suggest/mayor', {
						obec: this.obec,
						mayor: option[0].innerText,
						mayor_id: option[0]._value,
						source: this.$refs.mayor_source.value,
						name: this.$refs.mayor_name ? this.$refs.mayor_name.value : null,
						comment: this.$refs.mayor_comment ? this.$refs.mayor_comment.value : null
					}).then(response => {
						this.$refs.suggest_mayor.opened = false;
					});
			}
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
  },
  watch: {
	num: function () {
		window.scrollTo(0, 1);
		this.showHistory = false;
		this.showAll = false;
	}
  } 
};