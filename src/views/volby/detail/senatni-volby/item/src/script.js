import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, con, gradient, color, pct, sortBy} from '@/pdv/helpers';
import ReportModal from '@/components/report-modal/do.vue';
import ElectionTable from '@/components/results/parties/table/do.vue';
import ElectionGraph from '@/components/results/parties/graph/do.vue';
import ElectionList from '@/components/results/parties/list/do.vue';
import ElectionGrid from '@/components/results/parties/grid/do.vue';
import ElectionStats from '@/components/results/stats/do.vue';

export default {
	name: 'layout-volby-detail-senatni-item',
	props: ['data', 'prev', 'obvod', 'id'],
	data: function () {
		return {
			cdn, today,
			show: false
		}
	},
  components: {
	ReportModal, 
	ElectionTable, 
	ElectionGraph, 
	ElectionStats, 
	ElectionList,
	ElectionGrid
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
		sortBy,
		colorByItem: function (item, data) {

			var key = (data, this.data).list[0].status === 1 ? 'NSTRANA' : 'VSTRANA';

			var res = con(item.$data, 'color');
			var s = (data || this.data).cis.strany.find(x => x.VSTRANA === item[key]);

			if (!res && s && s.$coalition) {
				var arr = [];

				s.$coalition.forEach(member => {
					arr.push(con(member.$data, 'color', color(member.NAZEV)))
				});

				res = gradient(arr);
			}

			if (!res && s) {
				res = con(s.$data, 'color', color(s.PRIJMENI));
			}

			return res || '#aaa';
		},
		logoByItem: function (item, data) {

			var res = con(item.$data, 'logo');
			var s = (data || this.data).cis.strany.find(x => x.VSTRANA === item.VSTRANA);

			if (!res && s) {
				res = con(s.$data, 'logo');
			}

			s = (data || this.data).cis.strany.find(x => x.VSTRANA === item.NSTRANA);

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

			if (this.current.status === 3) {
				arr.sort((a, b) => b.HLASY_K1 - a.HLASY_K1);
			} else {
				arr.sort((a, b) => a.PRIJMENI.localeCompare(b.PRIJMENI, 'cs'));
			}

			var res = this.parties(arr);

			return res;
		},
		parties: function (list) {

			var res = [];
			var key = this.data.list[0].status === 1 ? 'NSTRANA' : 'VSTRANA';

			list.forEach(item => {

				var o = {
					id: item.id,
					label: item.JMENO + ' ' + item.PRIJMENI,
					short: item.PRIJMENI,
					initials: (item.JMENO + ' ' + item.PRIJMENI).split('-').join(' ').split(' ').map(x => x.substring(0, 1)).join(''),
					party: item[key] ? this.data.cis.strany.find(x => x.VSTRANA === item[key]).NAZEV : null,
					link: '/volby/senatni-volby/' + item.volby + '/kandidat/' + item.id,
					color: this.colorByItem(item),
					logo: this.logoByItem(item),
					photo: this.photoByItem(item),
					round1: {
						pct: item.PROC_K1,
						votes: item.HLASY_K1,
						graph: pct(item.PROC_K1, list[0].PROC_K1 * 1.2)
					},
					round2: {
						pct: item.PROC_K2,
						votes: item.HLASY_K2,
						graph: pct(item.PROC_K2, 75 * 1.2)
					},
					mandate: item.ZVOLEN_K1 === 1 || item.ZVOLEN_K2 === 1,
					passed: item.ZVOLEN_K1 > 0,
					PSTRANA: item.PSTRANA,
					VSTRANA: item.VSTRANA,
					NSTRANA: item.NSTRANA,
					hasAnswers: item.$odpovedi && item.$odpovedi > 0,
					hasProgram: item.$data.program && item.$data.program.length > 0,
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
