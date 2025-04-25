import {useData} from '@/stores/data';
import { api, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, unique, slide, domain, con} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import {ga} from '@/pdv/analytics';
import axios from 'axios';

import SearchTown from '@/components/search-town/do.vue'
import SearchParty from '@/components/search-party/do.vue'
import PartyPreview from '@/components/party-preview-large/do.vue'
import PersonPreviewBlock from '@/components/person-preview-block/do.vue'
import KrajskeVolbyResults from '@/views/history/volby/krajske-volby/do.vue';
import SenatniVolbyResults from '@/views/history/volby/senatni-volby/do.vue';
import ActivityLogoSet from '@/views/aktivity/guide/logo/do.vue';

export default {
	name: 'aktivity-guide-24-kz-senat',
	props: [],
	data: function () {
		return {
			town: null,
			krajID: null,
			obvodID: null,
			listOfObvod: [{"id": 1,"OBVOD": 1,"NAZEV": "Karlovy Vary","OKRES": 4102,"PORADI": 2}, {"id": 2,"OBVOD": 2,"NAZEV": "Sokolov","OKRES": 4103,"PORADI": 4}, {"id": 3,"OBVOD": 3,"NAZEV": "Cheb","OKRES": 4101,"PORADI": 6}, {"id": 4,"OBVOD": 4,"NAZEV": "Most","OKRES": 4205,"PORADI": 2}, {"id": 5,"OBVOD": 5,"NAZEV": "Chomutov","OKRES": 4202,"PORADI": 4}, {"id": 6,"OBVOD": 6,"NAZEV": "Louny","OKRES": 4204,"PORADI": 6}, {"id": 7,"OBVOD": 7,"NAZEV": "Plzeň-město","OKRES": 3203,"PORADI": 2}, {"id": 8,"OBVOD": 8,"NAZEV": "Rokycany","OKRES": 3206,"PORADI": 4}, {"id": 9,"OBVOD": 9,"NAZEV": "Plzeň-město","OKRES": 3203,"PORADI": 6}, {"id": 10,"OBVOD": 10,"NAZEV": "Český Krumlov","OKRES": 3102,"PORADI": 2}, {"id": 11,"OBVOD": 11,"NAZEV": "Domažlice","OKRES": 3201,"PORADI": 4}, {"id": 12,"OBVOD": 12,"NAZEV": "Strakonice","OKRES": 3106,"PORADI": 6}, {"id": 13,"OBVOD": 13,"NAZEV": "Tábor","OKRES": 3107,"PORADI": 2}, {"id": 14,"OBVOD": 14,"NAZEV": "České Budějovice","OKRES": 3101,"PORADI": 4}, {"id": 15,"OBVOD": 15,"NAZEV": "Pelhřimov","OKRES": 6103,"PORADI": 6}, {"id": 16,"OBVOD": 16,"NAZEV": "Beroun","OKRES": 2102,"PORADI": 2}, {"id": 17,"OBVOD": 17,"NAZEV": "Praha 12","OKRES": 1112,"PORADI": 4}, {"id": 18,"OBVOD": 18,"NAZEV": "Příbram","OKRES": 2111,"PORADI": 6}, {"id": 19,"OBVOD": 19,"NAZEV": "Praha 11","OKRES": 1100,"PORADI": 2}, {"id": 20,"OBVOD": 20,"NAZEV": "Praha 4","OKRES": 1104,"PORADI": 4}, {"id": 21,"OBVOD": 21,"NAZEV": "Praha 5","OKRES": 1100,"PORADI": 6}, {"id": 22,"OBVOD": 22,"NAZEV": "Praha 10","OKRES": 1100,"PORADI": 2}, {"id": 23,"OBVOD": 23,"NAZEV": "Praha 8","OKRES": 1108,"PORADI": 4}, {"id": 24,"OBVOD": 24,"NAZEV": "Praha 9","OKRES": 1100,"PORADI": 6}, {"id": 25,"OBVOD": 25,"NAZEV": "Praha 6","OKRES": 1100,"PORADI": 2}, {"id": 26,"OBVOD": 26,"NAZEV": "Praha 2","OKRES": 1102,"PORADI": 4}, {"id": 27,"OBVOD": 27,"NAZEV": "Praha 1","OKRES": 1100,"PORADI": 6}, {"id": 28,"OBVOD": 28,"NAZEV": "Mělník","OKRES": 2106,"PORADI": 2}, {"id": 29,"OBVOD": 29,"NAZEV": "Litoměřice","OKRES": 4203,"PORADI": 4}, {"id": 30,"OBVOD": 30,"NAZEV": "Kladno","OKRES": 2103,"PORADI": 6}, {"id": 31,"OBVOD": 31,"NAZEV": "Ústí nad Labem","OKRES": 4207,"PORADI": 2}, {"id": 32,"OBVOD": 32,"NAZEV": "Teplice","OKRES": 4206,"PORADI": 4}, {"id": 33,"OBVOD": 33,"NAZEV": "Děčín","OKRES": 4201,"PORADI": 6}, {"id": 34,"OBVOD": 34,"NAZEV": "Liberec","OKRES": 5103,"PORADI": 2}, {"id": 35,"OBVOD": 35,"NAZEV": "Jablonec nad Nisou","OKRES": 5102,"PORADI": 4}, {"id": 36,"OBVOD": 36,"NAZEV": "Česká Lípa","OKRES": 5101,"PORADI": 6}, {"id": 37,"OBVOD": 37,"NAZEV": "Jičín","OKRES": 5202,"PORADI": 2}, {"id": 38,"OBVOD": 38,"NAZEV": "Mladá Boleslav","OKRES": 2107,"PORADI": 4}, {"id": 39,"OBVOD": 39,"NAZEV": "Trutnov","OKRES": 5205,"PORADI": 6}, {"id": 40,"OBVOD": 40,"NAZEV": "Kutná Hora","OKRES": 2105,"PORADI": 2}, {"id": 41,"OBVOD": 41,"NAZEV": "Benešov","OKRES": 2101,"PORADI": 4}, {"id": 42,"OBVOD": 42,"NAZEV": "Kolín","OKRES": 2104,"PORADI": 6}, {"id": 43,"OBVOD": 43,"NAZEV": "Pardubice","OKRES": 5302,"PORADI": 2}, {"id": 44,"OBVOD": 44,"NAZEV": "Chrudim","OKRES": 5301,"PORADI": 4}, {"id": 45,"OBVOD": 45,"NAZEV": "Hradec Králové","OKRES": 5201,"PORADI": 6}, {"id": 46,"OBVOD": 46,"NAZEV": "Ústí nad Orlicí","OKRES": 5304,"PORADI": 2}, {"id": 47,"OBVOD": 47,"NAZEV": "Náchod","OKRES": 5203,"PORADI": 4}, {"id": 48,"OBVOD": 48,"NAZEV": "Rychnov nad Kněžnou","OKRES": 5204,"PORADI": 6}, {"id": 49,"OBVOD": 49,"NAZEV": "Blansko","OKRES": 6201,"PORADI": 2}, {"id": 50,"OBVOD": 50,"NAZEV": "Svitavy","OKRES": 5303,"PORADI": 4}, {"id": 51,"OBVOD": 51,"NAZEV": "Žďár nad Sázavou","OKRES": 6105,"PORADI": 6}, {"id": 52,"OBVOD": 52,"NAZEV": "Jihlava","OKRES": 6102,"PORADI": 2}, {"id": 53,"OBVOD": 53,"NAZEV": "Třebíč","OKRES": 6104,"PORADI": 4}, {"id": 54,"OBVOD": 54,"NAZEV": "Znojmo","OKRES": 6207,"PORADI": 6}, {"id": 55,"OBVOD": 55,"NAZEV": "Brno-město","OKRES": 6202,"PORADI": 2}, {"id": 56,"OBVOD": 56,"NAZEV": "Břeclav","OKRES": 6204,"PORADI": 4}, {"id": 57,"OBVOD": 57,"NAZEV": "Vyškov","OKRES": 6206,"PORADI": 6}, {"id": 58,"OBVOD": 58,"NAZEV": "Brno-město","OKRES": 6202,"PORADI": 2}, {"id": 59,"OBVOD": 59,"NAZEV": "Brno-město","OKRES": 6202,"PORADI": 4}, {"id": 60,"OBVOD": 60,"NAZEV": "Brno-město","OKRES": 6202,"PORADI": 6}, {"id": 61,"OBVOD": 61,"NAZEV": "Olomouc","OKRES": 7102,"PORADI": 2}, {"id": 62,"OBVOD": 62,"NAZEV": "Prostějov","OKRES": 7103,"PORADI": 4}, {"id": 63,"OBVOD": 63,"NAZEV": "Přerov","OKRES": 7104,"PORADI": 6}, {"id": 64,"OBVOD": 64,"NAZEV": "Bruntál","OKRES": 8101,"PORADI": 2}, {"id": 65,"OBVOD": 65,"NAZEV": "Šumperk","OKRES": 7105,"PORADI": 4}, {"id": 66,"OBVOD": 66,"NAZEV": "Olomouc","OKRES": 7102,"PORADI": 6}, {"id": 67,"OBVOD": 67,"NAZEV": "Nový Jičín","OKRES": 8104,"PORADI": 2}, {"id": 68,"OBVOD": 68,"NAZEV": "Opava","OKRES": 8105,"PORADI": 4}, {"id": 69,"OBVOD": 69,"NAZEV": "Frýdek-Místek","OKRES": 8102,"PORADI": 6}, {"id": 70,"OBVOD": 70,"NAZEV": "Ostrava-město","OKRES": 8106,"PORADI": 2}, {"id": 71,"OBVOD": 71,"NAZEV": "Ostrava-město","OKRES": 8106,"PORADI": 4}, {"id": 72,"OBVOD": 72,"NAZEV": "Ostrava-město","OKRES": 8106,"PORADI": 6}, {"id": 73,"OBVOD": 73,"NAZEV": "Frýdek-Místek","OKRES": 8102,"PORADI": 2}, {"id": 74,"OBVOD": 74,"NAZEV": "Karviná","OKRES": 8103,"PORADI": 4}, {"id": 75,"OBVOD": 75,"NAZEV": "Karviná","OKRES": 8103,"PORADI": 6}, {"id": 76,"OBVOD": 76,"NAZEV": "Kroměříž","OKRES": 7201,"PORADI": 2}, {"id": 77,"OBVOD": 77,"NAZEV": "Vsetín","OKRES": 7203,"PORADI": 4}, {"id": 78,"OBVOD": 78,"NAZEV": "Zlín","OKRES": 7204,"PORADI": 6}, {"id": 79,"OBVOD": 79,"NAZEV": "Hodonín","OKRES": 6205,"PORADI": 2}, {"id": 80,"OBVOD": 80,"NAZEV": "Zlín","OKRES": 7204,"PORADI": 4}, {"id": 81,"OBVOD": 81,"NAZEV": "Uherské Hradiště","OKRES": 7202,"PORADI": 6}],
			obvodAbout: {
				_17: "zahrnuje území městských částí Praha 12, Praha 16, Praha-Lipence, Praha-Lochkov, Praha-Slivenec, Praha-Velká Chuchle, Praha-Zbraslav, Praha-Kunratice, Praha-Šeberov, Praha-Újezd, Praha-Libuš, Praha-Petrovice a část území městské části Praha 4, tvořenou k. ú. Hodkovičky a k. ú. Lhotka",
				_20: "zahrnuje území městské části Praha 4, s výjimkou k. ú. Hodkovičky a k. ú. Lhotka",
				_23: "zahrnuje území městských částí Praha 8, Praha-Březiněves, Praha-Ďáblice, Praha-Dolní Chabry, Praha-Čakovice, Praha 18",
				_26: "zahrnuje území městské části Praha 2, s výjimkou k. ú. Nové Město a k. ú. Vyšehrad. Dále zahrnuje území městské části Praha 3, část území městské části Praha 10, tvořené částí k. ú. Vinohrady ležící na území městské části Praha 10, a část území městské části Praha 9, tvořenou k. ú. Hrdlořezy, k. ú. Hloubětín a částí k. ú. Malešice, ležící na území městské části Praha 9"
			},
			kraje2pad: [
				'',
				'',
				'Středočeského kraje',
				'Jihočeského kraje',
				'Plzeňského kraje',
				'Karlovarského kraje',
				'Ústeckého kraje',
				'Libereckého kraje',
				'Královéhradeckého kraje',
				'Pardubického kraje',
				'kraje Vysočina',
				'Jihomoravského kraje',
				'Olomouckého kraje',
				'Zlínského kraje',
				'Moravskoslezského kraje'
			],
			kraje6pad: [
				'',
				'',
				'Středočeském kraji',
				'Jihočeském kraji',
				'Plzeňském kraji',
				'Karlovarském kraji',
				'Ústeckém kraji',
				'Libereckém kraji',
				'Královéhradeckém kraji',
				'Pardubickém kraji',
				'kraji Vysočina',
				'Jihomoravském kraji',
				'Olomouckém kraji',
				'Zlínském kraji',
				'Moravskoslezském kraji'
			],
			partyList: [],
			priorityLimit: [3,3,3],
			focusKraj: null,
			focusSenat: null,
			selection: {
				useActivity: false,
				kraj: [],
				senat: []
			}
		}
	},
	components: {
		SearchTown,
		SearchParty,
		PartyPreview,
		PersonPreviewBlock,
		KrajskeVolbyResults,
		SenatniVolbyResults,
		ActivityLogoSet
	},
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		inKraj: function () {
			return this.krajID != null && this.krajID > 1
		},
		inSenat: function () {
			return this.obvodID != null && this.obvodID % 3 === 2
		},
		parties: function () {
			return this.$store.getters.pdv('elections/specific/162/parties');
		},
		activity: function () {
			var list = [];

			if (this.parties) {

				this.partyList.forEach(party => {
	
					var kraj = this.$store.getters.pdv('elections/activity/kz/162:' + party);
					var obvod = this.$store.getters.pdv('elections/activity/senat/163:' + party);
	
					var o = {
						party: this.parties.list.find(x => x.VSTRANA === party)
					}
	
					if (kraj) {
						o.kraj = {
							party: null,
							type: {
								support: false,
								coal: false,
								solemn: false
							}
						}
	
						var partykrzast = kraj.list.find(x => x.KRZAST === this.krajID);
	
						if (partykrzast) {
							o.kraj.party = partykrzast;
	
							if (partykrzast.VSTRANA === party) {
								o.kraj.type.solemn = true;
							} else if (kraj.cis.strany.find(x => x.VSTRANA === partykrzast.VSTRANA && x.$coalition && x.$coalition.find(y => y.VSTRANA === party))) {
								o.kraj.type.coal = true;
							}						
						}
					}
	
					if (obvod) {
						o.obvod = {
							cand: null,
							type: {
								support: false,
								coal: false,
								solemn: false,
								nominee: false,
								member: false
							}
						}
	
						obvod.list.filter(x => x.OBVOD == this.obvodID).forEach(cand => {
							if (cand.PSTRANA == party) {
								o.obvod.cand = cand;
								o.obvod.type.member = true
							}
							if (cand.NSTRANA == party) {
								o.obvod.cand = cand;
								o.obvod.type.nominee = true
							}
							if (cand.VSTRANA == party) {
								o.obvod.cand = cand;
								o.obvod.type.solemn = true
							}
							if (obvod.cis.strany.find(x => cand.VSTRANA === x.VSTRANA && x.$coalition && x.$coalition.find(y => y.VSTRANA == party ))) {
								o.obvod.cand = cand;
								o.obvod.type.coal = true
							}
							if (obvod.podpora.find(x => x.csu_id === cand.id)) {
								o.obvod.cand = cand;
								o.obvod.type.support = true
							}
						});
					}
	
					list.push(o);
				});
			}

			return list;
		},
		krajData: function () {
			var list = [];
			var detail = [];
			var data = this.inKraj ? this.$store.getters.pdv('elections/fetch/162:' + this.krajID) : null;
			var previous = this.$store.getters.pdv('elections/fetch/144:' + this.krajID);

			if (data) {
				if (this.selection.useActivity) {
					this.activity.forEach(party => {
						if (party.kraj && party.kraj.party && !list.find(x => x === party.kraj.party.id)) {
							list.push(data.list[0].$strany.find(x => x.id === party.kraj.party.id).id);
							detail.push(this.$store.getters.pdv('pointers/full/csu_kz_rkl:' + data.list[0].$strany.find(x => x.id === party.kraj.party.id).id ))
						}
					})
				} else {
					this.selection.kraj.forEach(party => {
						list.push(party.id);
						detail.push(this.$store.getters.pdv('pointers/full/csu_kz_rkl:' + party.id ))						
					})
				}
			}

			return {data, list, detail, previous};
		},
		senatData: function () {
			var list = [];
			var detail = [];
			var data = this.inSenat ? this.$store.getters.pdv('elections/fetch/163:' + this.obvodID) : null;
			var previous = this.$store.getters.pdv('elections/fetch/127:' + this.obvodID);
			var answers = [];

			if (data) {
				if (this.selection.useActivity) {
					this.activity.forEach(party => {
						if (party.obvod && party.obvod.cand && !list.find(x => x.id === party.obvod.cand.id)) {
							list.push(data.list[0].$kandidati.find(x => x.id === party.obvod.cand.id).id);
							detail.push(data.list[0].$kandidati.find(x => x.id === party.obvod.cand.id ))
						}
					})
				} else {
					this.selection.senat.forEach(cand => {
						list.push(cand.id);
						detail.push(cand)						
					})
				}

				data.list[0].$otazky.forEach(q => {
					answers.push({
						id: q.id,
						question: q.question,
						data: this.$store.getters.pdv('elections/qa/' + q.id + ':' + this.obvodID)
					});
				});
			}

			return {data, list, detail, previous, answers};
		},
		candData: function () {
			var res = null;

			if (this.focusKraj) {
				res = this.$store.getters.pdv('pointers/full/csu_kz_rk:' + this.focusKraj)
			}

			return res;
		}
	},
	methods: {
		date, sortBy, logoByItem, colorByItem, truncate, slide, unique, domain, con,
		setTown: function (data) {
			this.town = data;
			this.krajID = null;
			this.obvodID = null;

			this.selection.senat = [];
			this.selection.kraj = [];

			if (data.obec === 582786) { // Brno
				this.krajID = 11;
				this.obvodID = null;
			}
			if (data.obec === 554782) { // Praha
				this.krajID = 1;
				this.obvodID = null;
			}
			if (data.obec === 554791) { // Plzeň
				this.krajID = 4;
				this.obvodID = null;
			}
			if (data.obec === 554821) { // Ostrava
				this.krajID = 14;
				this.obvodID = null;
			}
			if (data.obec === 554804) { // Ústí nad Label
				this.krajID = 6;
				this.obvodID = 31;
			}
			if (data.obec === 555134) { // Pardubice
				this.krajID = 9;
				this.obvodID = 43;
			}
			if (data.obec === 563889) { // Liberec
				this.krajID = 7;
				this.obvodID = 34;
			}
			if (data.obec === 505927) { // Opava
				this.krajID = 14;
				this.obvodID = 68;
			}
			if (data.obec === 585068) { // Zlín
				this.krajID = 13;
				this.obvodID = 78;
			}
			
			if ([582786, 554782, 554791, 554821, 554804, 555134, 563889, 505927, 585068].indexOf(data.obec) === -1) {
					axios.get(api + 'elections/specific/162/town/' + data.obec).then(response => {
						this.krajID = response.data.kraj || 1;
						this.obvodID = response.data.obvod;
					
						setTimeout(() => {
							slide('section_2', this.$el);
						}, 250);
					});	
				} else {					
					setTimeout(() => {
						slide('section_2', this.$el);
					}, 250);
				}
		},
		setObvod: function (id) {
			this.obvodID = id;
			this.selection.senat = [];
			
			setTimeout(() => {
				slide('section_3', this.$el);
			}, 250);
		},
		setActivity: function (yes) {
			this.selection.useActivity = yes;
			
			setTimeout(() => {
				slide('section_31', this.$el);
			}, 250);
		},
		toggle: function (list, id) {
			if (list.find(x => x === id)) {
				list.splice(list.findIndex(x => x === id), 1)
			} else if (list.length < 3) {
				list.push(id);
			}
		},
		swap: function (from, to) {
			this.toggle(this.partyList, from);
			this.toggle(this.partyList, to);
		},
		getQuestion: function (id) {
			var res = '';

			switch (id) {
				case 347: res = 'Hlavní volební priority'; break;
				case 348: res = 'Veto vs hlasování většinou'; break;
				case 349: res = 'Ekonomika vs Green Deal'; break;
				case 350: res = 'Přístup EU k ruské agresi'; break;
				case 351: res = 'Cíle a síla frakce'; break;
				
			}

			return res;
		}
	},
	mounted: function () {
	  window.scrollTo(0, 1);
	  ga('Průvodce krajskými a senátními volbami 2024');

	  if (this.$route.query.kraj) this.krajID = Number(this.$route.query.kraj);
	  if (this.$route.query.obvod) this.obvodID = Number(this.$route.query.obvod);

	  if (this.$route.query.vyber) {
		this.$route.query.vyber.split(',').forEach(party => {
			this.toggle(this.partyList, Number(party));
		});

		this.selection.useActivity = true;

		setTimeout(() => {
			slide('section_3', this.$el);
		}, 250);		
	  }

	  if (this.$route.query.kraj || this.$route.query.obvod || this.$route.query.obec) {
		setTimeout(() => {
			slide('section_2', this.$el);
		}, 250);		
	  }
	},
	watch: {
		krajID: function () {
			this.selection.kraj = [];
		},
		obvodID: function () {
			this.selection.senat = [];
		}
	}
};
