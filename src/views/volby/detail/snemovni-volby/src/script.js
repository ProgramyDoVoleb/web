import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, con, gradient, color, pct, sortBy, shuffle} from '@/pdv/helpers';
import ReportModal from '@/components/report-modal/do.vue';
import ElectionTable from '@/components/results/parties/table/do.vue';
import ElectionGraph from '@/components/results/parties/graph/do.vue';
import ElectionList from '@/components/results/parties/list/do.vue';
import ElectionGrid from '@/components/results/parties/grid/do.vue';
import ElectionStats from '@/components/results/stats/do.vue';
import ElectionCompare from '@/views/volby/detail/snemovni-volby/compare/do.vue';
import PartyPreview from '@/components/party-preview/do.vue'
import PartyPreviewLarge from '@/components/party-preview-large/do.vue'
import PersonPreviewBlock from '@/components/person-preview-block/do.vue'
import MapPro from '@/components/map-pro-2/do.vue';
import PollsPreview from '@/components/polls-preview/do.vue';
import PollOfPolls from '@/views/polls/pollofpolls/do.vue';
import EngagementBlock1 from '@/components/engagement/poll-166-1/do.vue';
import EngagementBlock from '@/components/engagement/block/do.vue';
import PopUp from '@/components/pop-up/do.vue';
import EditableSuggest from '@/components/editable/suggest/do.vue';
import { colorByItem, logoByItem } from '@/components/results/helpers';

export default {
	name: 'layout-volby-detail-snemovni',
	props: ['data', 'prev', 'news'],
	data: function () {
		return {
			cdn, today,
			qenum: [
				{type: 2, label: 'Volební témata', hash: 'tema'},
				{type: 1, label: 'Otázky pro kandidáty', hash: 'otazka'},
				{type: 3, label: 'Volební kalkulačka', hash: 'kalkulacka'}
			],
			compactList: true
		}
	},
  components: {
	ReportModal, 
	ElectionTable, 
	ElectionGraph, 
	ElectionStats, 
	ElectionList,
	ElectionGrid,
	ElectionCompare,
	PartyPreview,
	PartyPreviewLarge,
	PersonPreviewBlock,
	MapPro,
	PollsPreview,
	PollOfPolls,
	EngagementBlock1, EngagementBlock,
	PopUp, EditableSuggest
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
		polls: function () {
			return this.$store.getters.pdv('polls/election/' + (this.data ? this.data.list[0].id : 0))
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		pct,
		sortBy,
		colorByItem,
		shuffle,
		// colorByItem: function (item, data) {

		// 	var res = con(item.$data, 'color');
		// 	var s = (data || this.data).cis.strany.find(x => x.VSTRANA === item.VSTRANA);

		// 	if (!res && s && s.$coalition) {
		// 		var arr = [];

		// 		s.$coalition.forEach(member => {
		// 			arr.push(con(member.$data, 'color', color(member.NAZEV)))
		// 		});

		// 		res = gradient(arr);
		// 	}

		// 	if (!res && s) {
		// 		res = con(s.$data, 'color', color(s.NAZEV));
		// 	}

		// 	return res || '#aaa';
		// },
		// logoByItem: function (item, data) {

		// 	var res = con(item.$data, 'logo');
		// 	var s = (data || this.data).cis.strany.find(x => x.VSTRANA === item.VSTRANA);

		// 	if (!res && s) {
		// 		res = con(s.$data, 'logo');
		// 	}

		// 	return res;
		// },
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
					VSTRANA: d.VSTRANA,
					program: d.$data.program
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
					o.program = item.program;
	
					o.list = [];
					
					elected.filter(x => x.KSTRANA === item.KSTRANA).forEach(person => {
						var p = {};

						p.name = person.JMENO;
						p.family = person.PRIJMENI;
						if (person.VOLKRAJ) p.region = this.enums.regionsShort[person.VOLKRAJ - 1];
						p.link = '/volby/snemovni-volby/' + this.current.id + '/kandidat/' + person.id;
						p.PORCISLO = person.PORCISLO;

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
