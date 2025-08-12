import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, con, gradient, color, pct, sortBy, sortEvents, firstOfUnique, domain} from '@/pdv/helpers';
import ElectionTable from '@/components/results/parties/table/do.vue';
import ElectionGraph from '@/components/results/parties/graph/do.vue';
import ElectionList from '@/components/results/parties/list/do.vue';
import ElectionGrid from '@/components/results/parties/grid/do.vue';
import ElectionStats from '@/components/results/stats/do.vue';
import ReportModal from '@/components/report-modal/do.vue';
import ElectionCompare from '@/views/volby/detail/evropske-volby/compare/do.vue';
import ElectionPoll from '@/views/volby/detail/evropske-volby/poll/do.vue';
import MapPro from '@/components/map-pro-2/do.vue';
import EventItem from '@/components/event-item/do.vue'
import ReportForm from '@/components/report-form/do.vue'
import PartyPreview from '@/components/party-preview/do.vue'
import PartyPreviewLarge from '@/components/party-preview-large/do.vue'

export default {
	name: 'layout-volby-detail-evropske',
	props: ['data', 'prev', 'id', 'news'],
	data: function () {
		return {
			cdn, today,
			qenum: [
				{type: 2, designee: null, label: 'Volební témata', hash: 'tema'},
				{type: 1, designee: null, label: 'Otázky', hash: 'otazka'},
				{type: 1, designee: 1, label: 'Otázky pro strany', hash: 'otazka'},
				{type: 1, designee: 2, label: 'Otázky pro kandidáty', hash: 'otazka'},
				{type: 3, designee: null, label: 'Kalkulačka', hash: 'kalkulacka'}
			],
			compactList: window.width < 1240
		}
	},
  components: {
	ElectionTable,
	ElectionGraph,
	ElectionStats,
	ElectionList,
	ElectionGrid,
	ElectionPoll,
	ReportModal,
	ElectionCompare,
	MapPro,
	EventItem,
	ReportForm,
	PartyPreview, PartyPreviewLarge
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
		polls: function () {
			return this.$store.getters.pdv('polls/election/' + this.id);
		},
		width: function () {
			return window.innerWidth;
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		pct,
		sortBy,
		sortEvents, firstOfUnique,
		domain,
		colorByItem: function (item, data) {

			var res = con(item.$data, 'color');
			var s = (data || this.data).cis.strany.find(x => x.VSTRANA === item.VSTRANA);

			if (!res && s && s.$coalition) {
				var arr = [];

				s.$coalition.forEach(member => {
					arr.push(con(member.$data, 'color', color(member.NAZEV)))
				});

				res = gradient(arr);
			}

			if (!res && s) {
				res = con(s.$data, 'color', color(s.NAZEV));
			}

			return res || '#aaa';
		},
		logoByItem: function (item, data) {

			// console.log(item);

			var res = con(item.$data, 'logo');
			var s = (data || this.data).cis.strany.find(x => x.VSTRANA === item.VSTRANA);

			if (!res && s) {
				res = con(s.$data, 'logo');
			}

			return res;
		},
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

				var d = parties.find(x => item.ESTRANA === x.ESTRANA)

				var o = {
					label: truncate(d.NAZEV, 10),
					short: d.ZKRATKA,
					link: '/volby/evropske-volby/' + this.current.id + '/strana/' + d.id,
					color: this.colorByItem(d),
					logo: this.logoByItem(d),
					$data: item.$data,
					votes: item.HLASU,
					pct: item.PROCENT,
					mandates: item.MANDATU,
					graph: pct(item.PROCENT, list[0].PROCENT * 1.2),
					passed: !!item.MANDATU,
					ESTRANA: d.ESTRANA,
					VSTRANA: d.VSTRANA,
					program: d.$program,
					$priorit: d.$priorit
				}

				var p = this.data.cis.strany.find(x => x.VSTRANA === d.VSTRANA);

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
				
				if (!o.logo && !o.coal) {
					o.logo = cdn + 'empty.png';
				}

				res.push(o)
			});

			return res;
		},
		people: function (parties, list, condition) {

			var arr = [];

			parties.forEach(item => {
				if (condition || item.mandates) {
					var o = {};

					o.name = item.label;
					o.short = item.short;
					o.link = item.link;
					o.color = item.color;
					o.logo = item.logo;
					o.size = item.mandates;
					o.program = item.program;
					o.$data = item.$data;
	
					o.list = [];
					
					list.filter(x => x.ESTRANA === item.ESTRANA).forEach(person => {
						var p = {};

						p.name = person.JMENO;
						p.family = person.PRIJMENI;
						p.link = '/volby/evropske-volby/' + this.current.id + '/kandidat/' + person.id;
						p.PORCISLO = person.PORCISLO;

						if (person.NSTRANA && person.NSTRANA != item.VSTRANA) {
							p.color = this.colorByItem(this.data.cis.strany.find(x => x.VSTRANA === person.NSTRANA))
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
							m.size = list.filter(x => x.NSTRANA === member.VSTRANA).length

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
