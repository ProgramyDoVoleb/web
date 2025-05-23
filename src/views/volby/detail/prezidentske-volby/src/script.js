import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, con, gradient, color, pct} from '@/pdv/helpers';
import ReportModal from '@/components/report-modal/do.vue';
import ElectionTable from '@/components/results/people/table/do.vue';
import ElectionGraph from '@/components/results/people/graph/do.vue';
import ElectionDuel from '@/components/results/people/duel/do.vue';
import ElectionGrid from '@/components/results/people/grid/do.vue';
import ElectionStats from '@/components/results/people/stats/do.vue';
import ElectionProfiles from '@/components/results/people/profiles/do.vue';

export default {
	name: 'layout-volby-detail-prezident',
	props: ['data', 'prev', 'obvod'],
	data: function () {
		return {
			cdn, today,
			qenum: [
				{type: 2, label: 'Volební témata', hash: 'tema'},
				{type: 1, label: 'Otázky pro kandidáty', hash: 'otazka'},
				{type: 3, label: 'Volební kalkulačka', hash: 'kalkulacka'}
			]
		}
	},
  components: {
	ReportModal, 
	ElectionTable, 
	ElectionGraph, 
	ElectionDuel, 
	ElectionGrid,
	ElectionStats,
	ElectionProfiles
  },
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		current: function () {
			return this.data ? this.data.list[0] : null
		},
		previous: function () {
			return this.prev ? this.prev.list[0] : null
		},
		hasSecondRound: function () {
			return this.current.$kandidati.find(x => x.HLASY_K2)
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		pct,
		colorByItem: function (item, data) {

			var res = con(item.$data, 'color', color(item.JMENO + ' ' + item.PRIJMENI));

			return res || '#aaa';
		},
		logoByItem: function (item, data) {

			var res = con(item.$data, 'logo');
			var s = (data || this.data).cis.strany.find(x => x.VSTRANA === item.VSTRANA);

			if (!res && s) {
				res = con(s.$data, 'logo');
			}

			return res;
		},
		photoByItem: function (item, data) {
			var res = con(item.$data, 'photo');
			return res;
		},
		sortByVotes: function (list) {
			var arr = [];

			list.forEach(x => arr.push(x));

			if (this.current.status === 3) arr.sort((a, b) => b.HLASY_K1 - a.HLASY_K1);
			if (this.current.status < 3) arr.sort((a, b) => a.PRIJMENI.localeCompare(b.PRIJMENI, 'cs'));

			var res = this.parties(arr);

			return res;
		},
		parties: function (list) {

			var res = [];

			var HLASY_K1 = list.reduce((a, b) => a + b.HLASY_K1, 0);
			var HLASY_K2 = list.reduce((a, b) => a + b.HLASY_K2, 0);

			list.forEach(item => {

				var o = {
					label: item.JMENO + ' ' + item.PRIJMENI,
					short: item.PRIJMENI,
					initials: (item.JMENO + ' ' + item.PRIJMENI).split('-').join(' ').split(' ').map(x => x.substring(0, 1)).join(''),
					// party: item.VSTRANA ? this.data.cis.strany.find(x => x.VSTRANA === item.VSTRANA).NAZEV : null,
					link: '/volby/prezidentske-volby/' + item.volby + '/kandidat/' + item.id,
					color: this.colorByItem(item),
					no: item.CKAND,
					data: item.$data,
					logo: this.logoByItem(item),
					photo: this.photoByItem(item),
					round1: {
						pct: pct(item.HLASY_K1, HLASY_K1, 2),
						votes: item.HLASY_K1,
						graph: pct(item.HLASY_K1, list[0].HLASY_K1 * 1.2)
					},
					round2: {
						pct: pct(item.HLASY_K2, HLASY_K2, 2),
						votes: item.HLASY_K2,
						graph: pct(item.HLASY_K2, list[0].HLASY_K2 * 1.2)
					},
					mandate: item.ZVOLEN_K1 === 1 || item.ZVOLEN_K2 === 1,
					passed: item.ZVOLEN_K1 > 0,
					PSTRANA: item.PSTRANA,
					VSTRANA: item.VSTRANA,
					NSTRANA: item.NSTRANA
				}

				if (item.VEK) {
					o.about = item.VEK + ' let, ' + item.POVOLANI + ', ' + item.BYDLISTEN
				}

				var p = this.data.cis.strany.find(x => x.VSTRANA === item.VSTRANA);

				if (p && p.$coalition) {
					o.coal = [];

					p.$coalition.forEach(x => {
						var m = {
							logo: this.logoByItem(x),
							color: this.colorByItem(x),
							short: x.ZKRATKA,
							VSTRANA: x.VSTRANA
						}

						o.coal.push(m);
					});
				}

				res.push(o)
			});

			return res;
		}
  },
  mounted: function () {
  }
};
