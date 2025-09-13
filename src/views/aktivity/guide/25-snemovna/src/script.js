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
import CtaSupportShort from '@/components/cta/support-short/do.vue';
import AnswerPreview from '@/components/answer-preview/do.vue';

export default {
	name: 'aktivity-guide-25-snemovna',
	props: [],
	data: function () {
		return {
			town: null,
			krajID: null,						
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
			focusCand: null,
			selection: {
				useActivity: false,
				kraj: []
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
		ActivityLogoSet,
		CtaSupportShort,
		AnswerPreview
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
			return this.$store.getters.pdv('elections/specific/166/parties');
		},
		activity: function () {
			var list = [];

			if (this.parties) {

				this.partyList.forEach(party => {
	
					var kraj = this.$store.getters.pdv('elections/activity/ps/166:' + party);
	
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
	
						var partykrzast = kraj.list[0];
	
						if (partykrzast) {
							o.kraj.party = partykrzast;
	
							if (partykrzast.VSTRANA === party) {
								o.kraj.type.solemn = true;
							} else if (kraj.cis.strany.find(x => x.VSTRANA === partykrzast.VSTRANA && x.$coalition && x.$coalition.find(y => y.VSTRANA === party))) {
								o.kraj.type.coal = true;
							} else if (kraj.podpora.length > 0) {
								o.kraj.type.support = true;
							}					
						}
					}
	
					list.push(o);
				});
			}

			return list;
		},
		krajData: function () {
			var list = [];
			var detail = [];
			var data = this.$store.getters.pdv('elections/fetch/166');
			var previous = this.$store.getters.pdv('elections/fetch/149');

			if (data) {
				if (this.selection.useActivity) {
					this.activity.forEach(party => {
						if (party.kraj && party.kraj.party && !list.find(x => x === party.kraj.party.id)) {
							list.push(data.list[0].$strany.find(x => x.id === party.kraj.party.id).id);
							detail.push(this.$store.getters.pdv('pointers/full/csu_ps_rkl:' + data.list[0].$strany.find(x => x.id === party.kraj.party.id).id ))
						}
					})
				} else {
					this.selection.kraj.forEach(party => {
						list.push(party.id);
						detail.push(this.$store.getters.pdv('pointers/full/csu_ps_rkl:' + party.id ))						
					})
				}
			}

			return {data, list, detail, previous};
		},
		candData: function () {
			var res = null;

			if (this.focusCand) {
				res = this.$store.getters.pdv('pointers/full/csu_ps_rk:' + this.focusCand)
			}

			return res;
		}
	},
	methods: {
		date, sortBy, logoByItem, colorByItem, truncate, slide, unique, domain, con, url,
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
	  ga('Průvodce sněmovními volbami 2025');

	  if (this.$route.query.kraj) this.krajID = Number(this.$route.query.kraj);
	  if (this.$route.query.obvod) this.obvodID = Number(this.$route.query.obvod);

	  if (this.$route.query.vyber) {
		setTimeout(() => {
			this.$route.query.vyber.split(',').forEach(party => {
				this.toggle(this.selection.kraj, this.krajData.data.list[0].$strany.find(x => x.id === Number(party)))
			});
		}, 2000);
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
