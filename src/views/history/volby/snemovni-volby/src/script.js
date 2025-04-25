import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, con, gradient, color, pct} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import ReportModal from '@/components/report-modal/do.vue';
import ElectionTable from '@/components/results/parties/table/do.vue';
import ElectionGraph from '@/components/results/parties/graph/do.vue';
import ElectionList from '@/components/results/parties/list/do.vue';
import ElectionGrid from '@/components/results/parties/grid/do.vue';
import ElectionStats from '@/components/results/stats/do.vue';

export default {
	name: 'layout-volby-detail-snemovni',
	props: ['data', 'local'],
	data: function () {
		return {
			cdn, today
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
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		pct,
		sortByVotes: function (list, parties) {
			var arr = [];
			var arr2 = [];

			list.filter(x => x.MANDATU).forEach(x => arr.push(x));
			list.filter(x => !x.MANDATU).forEach(x => arr2.push(x));

			arr.sort((a, b) => b.HLASU - a.HLASU);
			// arr.sort((a, b) => b.MANDATU - a.MANDATU);
			arr2.sort((a, b) => b.HLASU - a.HLASU);

			var l = arr.concat(arr2);

			var res = this.parties(l, parties);

			return res;
		},
		parties: function (list, parties) {

			var res = [];

			list.forEach(item => {

				var d = parties.find(x => item.KSTRANA === x.KSTRANA)

				var o = {
					label: truncate(d.NAZEV, 10),
					short: d.ZKRATKA,
					link: '/volby/snemovni-volby/' + this.current.id + '/strana/' + d.id,
					color: colorByItem(d, this.data),
					logo: logoByItem(d, this.data),
					votes: item.HLASU,
					pct: item.PROCENT,
					mandates: item.MANDATU,
					graph: pct(item.PROCENT, list[0].PROCENT * 1.2),
					passed: !!item.MANDATU,
					KSTRANA: d.KSTRANA,
					VSTRANA: d.VSTRANA
				}

				if (this.local) {
					o.ref = {
						pct: o.pct,
						votes: o.votes,
						graph: o.graph
					}

					var result = this.local.$vysledky.find(x => x.KSTRANA === item.KSTRANA);

					o.votes = result ? result.HLASU : 0;
					o.pct = pct(o.votes, this.local.$ucast[0].PLATNYCH, 2);
					o.graph = pct(o.votes, this.local.$vysledky.find(x => x.KSTRANA === list[0].KSTRANA).HLASU * 1.2)
				}

				var p = this.data.cis.strany.find(x => x.VSTRANA === d.VSTRANA);

				if (p && p.$coalition) {
					o.coal = [];

					p.$coalition.forEach(x => {
						var m = {
							logo: logoByItem(x, this.data),
							color: colorByItem(x, this.data),
							short: x.ZKRATKA,
							VSTRANA: x.VSTRANA
						}

						o.coal.push(m);
					});
				}
				
				if (!o.logo && !o.coal) {
					o.logo = cdn + 'empty.png';
				}

				res.push(o)
			});

			return res;
		},
		people: function (list, elected, condition) {

			var arr = [];

			list.forEach(item => {
				if (condition || item.mandates) {
					var o = {};

					o.name = item.label;
					o.short = item.short;
					o.link = item.link;
					o.color = item.color;
					o.logo = item.logo;
					o.size = item.mandates;
	
					o.list = [];
					
					elected.filter(x => x.KSTRANA === item.KSTRANA).forEach(person => {
						var p = {};

						p.name = person.JMENO;
						p.family = person.PRIJMENI;
						if (person.VOLKRAJ) p.region = this.enums.regionsShort[person.VOLKRAJ - 1];
						p.link = '/volby/snemovni-volby/' + this.current.id + '/kandidat/' + person.id;

						if (person.NSTRANA != item.VSTRANA) {
							p.color = colorByItem(this.data.cis.strany.find(x => x.VSTRANA === person.NSTRANA), this.data)
						}

						o.list.push(p);
					});

					if (item.coal) {
						o.coal = [];

						item.coal.forEach(member => {
							var m = {}

							m.short = member.short;
							m.logo = member.logo;
							m.color = member.color;
							m.size = elected.filter(x => x.NSTRANA === member.VSTRANA).length

							o.coal.push(m);
						});
					}
	
					arr.push(o);
				}
			});

			return arr;
		}
  },
  mounted: function () {
  }
};
