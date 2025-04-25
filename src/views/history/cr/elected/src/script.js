import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import { url, date, number, truncate, con, gradient, color, pct } from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/components/results/helpers';

// import ReportModal from '@/components/report-modal/do.vue';
// import ElectionTable from '@/components/results/parties/table/do.vue';
// import ElectionGraph from '@/components/results/parties/graph/do.vue';
import ElectionList from '@/components/results/parties/list/do.vue';
import ElectionGrid from '@/components/results/parties/grid/do.vue';
// import ElectionStats from '@/components/results/stats/do.vue';

export default {
	name: 'layout-obec-elected',
	props: ['data', 'prev', 'town'],
	data: function () {
		return {
			cdn, today
		}
	},
  components: {
	// ReportModal, 
	// ElectionTable, 
	// ElectionGraph, 
	// ElectionStats, 
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
		obvody: function () {
			return this.current.$dotcene.find(x => x.OBVODY === 2) ? this.current.$dotcene.filter(x => x.OBVODY === 2 && x.COBVODU) : this.current.$dotcene
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		pct,
		sortByVotes: function (list, parties, obvod) {
			var arr = [];
			var arr2 = [];

			// console.log(1, list, parties, obvod);

			list.filter(x => !obvod || x.OBVOD === obvod).filter(x => x.MANDATU).forEach(x => arr.push(x));
			list.filter(x => !obvod || x.OBVOD === obvod).filter(x => !x.MANDATU).forEach(x => arr2.push(x));

			arr.sort((a, b) => b.HLASU - a.HLASU);
			// arr.sort((a, b) => b.MANDATU - a.MANDATU);
			arr2.sort((a, b) => b.HLASU - a.HLASU);

			var l = arr.concat(arr2);

			var res = this.parties(l, parties);

			return res;
		},
		parties: function (list, parties) {

			var res = [];

			// console.log(2, list, parties);

			list.forEach(item => {

				var d = parties.find(x => item.KSTRANA === x.POR_STR_HL && (item.OBVOD === x.COBVODU || !item.OBVOD))

				var o = {
					id: d.OSTRANA,
					label: truncate(d.NAZEV, 10),
					short: d.ZKRATKA,
					link: '/volby/komunalni-volby/' + this.current.id + '/strana/' + this.current.$strany.filter(x => x.OSTRANA === d.OSTRANA).map(x => x.id).join(','),
					color: colorByItem(d, this.data),
					logo: logoByItem(d, this.data),
					votes: item.HLASU,
					pct: item.PROCENT,
					mandates: item.MANDATU,
					graph: pct(item.PROCENT, list[0].PROCENT * 1.2),
					passed: !!item.MANDATU,
					KSTRANA: d.POR_STR_HL,
					VSTRANA: d.VSTRANA,
					OSTRANA: d.OSTRANA,
					OBVOD: d.COBVODU
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

			// console.log(3, list, elected, condition);

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
					o.party = item.VSTRANA;
					o.local = item.OSTRANA;
					o.obvod = item.OBVOD;
					o.id = item.id;
	
					o.list = [];
					
					elected.filter(x => x.POR_STR_HL === item.KSTRANA && (!item.OBVOD || item.OBVOD === x.COBVODU)).forEach(person => {
						var p = {};

						p.name = person.JMENO;
						p.family = person.PRIJMENI;
						p.PORCISLO = person.PORCISLO;
						p.link = '/volby/komunalni-volby/' + person.volby + '/kandidat/' + person.id;
						p.local = person.OSTRANA;
						if (this.obvody.length > 1) p.region = person.COBVODU;

						if (person.NSTRANA && person.NSTRANA != item.VSTRANA && item.VSTRANA != 90 && item.VSTRANA != 80) {
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
							m.size = elected.filter(x => x.NSTRANA === member.VSTRANA && x.OSTRANA === item.OSTRANA).length

							o.coal.push(m);
						});
					}
	
					arr.push(o);
				}
			});

			return arr;
		},
		consolidate: function (list) {
			var parties = [];

			list.forEach(item => {

				var o = parties.find(x => x.local === item.local);

				if (!o) {
					var o = {
						color: item.color,
						logo: item.logo,
						name: item.name,
						short: item.short,
						link: item.link,
						list: [],
						id: item.id,
						local: item.local,
						party: item.party,
						coal: item.coal
					}

					parties.push(o);
				}

				item.list.forEach(x => o.list.push(x));
			});

			parties.forEach(o => {
				o.list.sort((a, b) => a.family.localeCompare(b.family, 'cs'));
			})

			// console.log(list, parties);

			return parties;
		}
  },
  mounted: function () {
  }
};
