import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, slide, date, number, truncate, con, gradient, unique, indicator, color, pct, sortBy, isWoman, type, townInRegularElectionsAlsoVotesInSenat, partyInCis, getMedia, toggleItem, colorByItem, logoByItem} from '@/pdv/helpers';
import ReportModal from '@/components/report-modal/do.vue';
import ElectionTable from '@/components/results/parties/table/do.vue';
import ElectionGraph from '@/components/results/parties/graph/do.vue';
import ElectionList from '@/components/results/parties/list/do.vue';
import ElectionGrid from '@/components/results/parties/grid/do.vue';
import ElectionStats from '@/components/results/stats/do.vue';
import ElectionResults from '@/views/history/volby/detail/do.vue';
import PartyPreview from '@/components/party-preview/do.vue'
import PartyPreviewLarge from '@/components/party-preview-large/do.vue'
import PartyPreviewFull from '@/components/party-preview-full/do.vue'
import PersonPreviewBlock from '@/components/person-preview-block/do.vue'
import PopUp from '@/components/pop-up/do.vue';
import EditableSuggest from '@/components/editable/suggest/do.vue';
import HistoryCandidates from '@/components/history/town/do.vue';
import EngagementAddProgram from '@/components/engagement/add-program/do.vue';
import EngagementSupport from '@/components/engagement/support/do.vue';
import CandidateStats from '@/components/candidate-stats/do.vue';
import WidgetEmbed from '@/components/widget-block/do.vue';
import ResultsQuick from '@/views/volby/detail/komunalni-volby/results-quick/do.vue';

export default {
	name: 'layout-volby-detail-komunalni-obec-detail',
	props: ['data', 'prev', 'town'],
	data: function () {
		return {
			cdn, today,
			qenum: [
				{type: 2, label: 'Volební témata', hash: 'tema'},
				{type: 1, label: 'Otázky pro strany', hash: 'otazka', designated: 1},
				{type: 1, label: 'Otázky pro kandidáty', hash: 'otazka', designated: 2},
				{type: 3, label: 'Kalkulačka', hash: 'kalkulacka'}
			],
			compactList: window.width < 1240 ? 1 : 2,
			dhondt: [],
			majority: 0,
			possibleCoalitions: [],
			possibleCoalitionsCheckDone: false,
			possibleCoalitionsLimit: [],
			possibleCoalitionsAvoid: [],
			list: null,
		}
	},
  components: {
	ReportModal, 
	ElectionTable, 
	ElectionGraph, 
	ElectionStats, 
	ElectionList,
	ElectionGrid,
	ElectionResults,
	PartyPreview,
	PartyPreviewLarge,
	PartyPreviewFull,
	PersonPreviewBlock,
	PopUp,
	EditableSuggest,
	HistoryCandidates,
	EngagementAddProgram, EngagementSupport,
	CandidateStats,
	WidgetEmbed,
	ResultsQuick
  },
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		current: function () {
			return this.data ? this.data.list[0] : null;
		},
		prevData: function () {
			return this.$store.getters.pdv('elections/fetch/' + this.current.predchozi + ':' + this.town);
		},
		previous: function () {
			return this.prevData ? this.prevData.list[0] : null;
		},
		obvody: function () {
			return this.current.$dotcene.find(x => x.OBVODY === 2) ? this.current.$dotcene.filter(x => x.OBVODY === 2 && x.COBVODU) : this.current.$dotcene
		},
		core: function () {
			return this.$store.getters.pdv('town/core/' + this.town);
		},
		leadership: function () {
			return this.$store.getters.pdv('town/mayor/' + this.town + ':' + this.data.list[0].id);
		},
		partyList: function () {
			return this.$store.getters.pdv('parties/as-of/' + this.data.list[0].datum + ';1,7,47,53,166,703,720,721,768,1114,714,5,1227,1245,1265,1178,1298,1722');
		},
		media: function () {
			return this.$store.getters.pdv('elections/specific/2026-media');
		},
		localPartyMandates: function () {
			var arr = [];

			this.current.$strany.filter(x => x.SLOZENI === 80 && this.previous.$strany.find(y => y.NAZEV === x.NAZEV)).forEach(party => {
				var o = {
					party,
					previous: 0,
					current: 0
				}

				o.current = this.current.$kandidati.filter(x => x.MANDAT === 'A' && x.POR_STR_HL === party.POR_STR_HL).length;
				o.previous = this.previous.$kandidati.filter(x => x.MANDAT === 'A' && x.POR_STR_HL === this.previous.$strany.find(y => y.NAZEV === party.NAZEV).POR_STR_HL).length;

				arr.push(o);
			})

			return arr;
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		pct,
		sortBy,
		isWoman,
		type,
		townInRegularElectionsAlsoVotesInSenat,
		partyInCis,
		slide,
		getMedia,
		toggleItem,
		unique,
		indicator,
		colorByItem,
		logoByItem,
		colorByItem2: function (item, data) {

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
				res = con(s.$data, 'color', color(item.NAZEV));
			}

			res = res ? res.split('rgb(249,89,231)').join('#f959e722').split('rgb(249, 89, 231)').join('#f959e722') : res;

			return res || '#aaa';
		},
		logoByItem2: function (item, data) {

			var res = con(item.$data, 'logo');
			var s = (data || this.data).cis.strany.find(x => x.VSTRANA === item.VSTRANA);

			if (!res && s) {
				res = con(s.$data, 'logo');
			}

			return res;
		},
		sbv: function (obvod, index) {
			return this.sortByVotes(this.current.$vysledky, this.current.$strany, obvod.OBVODY === 2 ? index + 1 : null);
		},
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

			this.list = res;

			if (this.possibleCoalitionsCheckDone === false) {
				this.possibleCoalitionsCheckDone = true;

				this.majority = Math.ceil(this.current.$dotcene[0].MANDATY / 2);
				this.possibleCoalitions = [];

				this.checkPossibleCoalitions(obvod, res.filter(x => x.mandates > 0), 0, []);
			}

			return res;
		},
		parties: function (list, parties) {

			var res = [];

			// console.log(2, list, parties);

			list.forEach(item => {

				var d;

				if (list === parties) {
					d = item;
				} else {
					d = parties.find(x => (item.KSTRANA || item.POR_STR_HL) === x.POR_STR_HL && (item.OBVOD === x.COBVODU || !item.OBVOD))
				}
				

				var o = {
					id: d.OSTRANA,
					label: truncate(d.NAZEV, 10),
					short: d.ZKRATKA,
					link: '/volby/komunalni-volby/' + this.current.id + '/strana/' + this.current.$strany.filter(x => x.OSTRANA === d.OSTRANA).map(x => x.id).join(','),
					color: this.colorByItem(d, this.data),
					logo: this.logoByItem(d, this.data),
					votes: item.HLASU,
					pct: item.PROCENT,
					mandates: item.MANDATU,
					graph: pct(item.PROCENT, list[0].PROCENT * 1.2),
					passed: !!item.MANDATU,
					KSTRANA: d.POR_STR_HL,
					VSTRANA: d.VSTRANA,
					OSTRANA: d.OSTRANA,
					OBVOD: d.COBVODU || d.OBVOD,
					program: d.$data.program
				}

				var p = this.data.cis.strany.find(x => x.VSTRANA === d.VSTRANA);

				if (p && p.$coalition) {
					o.coal = [];

					p.$coalition.forEach(x => {
						var m = {
							logo: this.logoByItem(x, this.data),
							color: this.colorByItem(x, this.data),
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

			// console.log(res)

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
					o.program = item.program;
	
					o.list = [];
					
					elected.filter(x => x.POR_STR_HL === item.KSTRANA && (!item.OBVOD || item.OBVOD === x.COBVODU)).forEach(person => {
						var p = {};

						p.name = person.JMENO;
						p.family = person.PRIJMENI;
						p.link = '/volby/komunalni-volby/' + person.volby + '/kandidat/' + person.id;
						p.local = person.OSTRANA;
						p.PORCISLO = person.PORCISLO;
						if (this.obvody.length > 1) p.region = person.COBVODU;

						if (person.NSTRANA && person.NSTRANA != item.VSTRANA && item.VSTRANA != 90 && item.VSTRANA != 80) {
							p.color = this.colorByItem(this.data.cis.strany.find(x => x.VSTRANA === person.NSTRANA), this.data)
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
						coal: item.coal,
						program: item.program
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
		},
		ico: function (val) {
			var s = String(val);

			while (s.length < 8) s = '0' + s;

			return s;
		},
		dhondtCalculate: function () {

			var arr = [];
			var mandates = this.current.$dotcene[0].MANDATY || this.current.$dotceneMinule[0].MANDATY;

			this.dhondt.filter(x => x.value >= 5).forEach(item => {
				for (var i = 1; i < mandates + 1; i++) {
					arr.push({
						value: 100 * item.value / i,
						item
					});
				}
			})

			arr.sort((a, b) => b.value - a.value);
			arr.splice(mandates, arr.length - mandates);

			this.dhondt.forEach(item => {
				item.mandates = arr.filter(x => x.item.id === item.id).length;
			});
		},
		checkPossibleCoalitions: function (obvod, list, index, coal) {
			// console.log('coal check', index);
			if (index === list.length) {
				if (this.majority <= coal.reduce((a, b) => a + b.mandates, 0)) {
					this.possibleCoalitions.push({obvod, coal, size: coal.length, power: coal.reduce((a, b) => a + b.mandates, 0)});
				} else {
					// console.log(coal, coal.reduce((a, b) => a + b.mandates, 0));
				}
			} else {
				this.checkPossibleCoalitions(obvod, list, index + 1, [].concat(coal, list[index]));
				this.checkPossibleCoalitions(obvod, list, index + 1, coal);
			}
		},
		checkPossibleCoalitionsMatch(obvod, list, avoid) {
			var result = true;

			if (avoid) {		
				result = false;

				this.possibleCoalitionsAvoid.forEach(x => {
					if (list.find(y => y.id === x)) result = true;
				});
			} else {

				this.possibleCoalitionsLimit.forEach(x => {
					if (!list.find(y => y.id === x)) result = false;
				});
			}

			// if (result === true) console.log(result, list, this.possibleCoalitionsLimit);

			return result;
		},
		checkPossibleCoalitionsAvoidMatch(obvod, list, avoid) {
			var result = true;

			this.possibleCoalitionsAvoid.forEach(x => {
				if (!list.find(y => y.id === x)) result = false;
			});

			return result;
		}
  },
  mounted: function () {
	window.scrollTo(0,1);
	sortBy(this.data.list[0].$strany, 'NAZEV', null, true).forEach(party => {
		this.dhondt.push({
			id: party.id,
			NAZEV: party.NAZEV,
			value: 0,
			mandates: 0
		});
	});
  },
  watch: {
	town: function () {
		window.scrollTo(0,1);
	}
  }
};
