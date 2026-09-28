import {useData} from '@/stores/data';
import { api, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, unique, slide, domain, con} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';
import { useRouter } from 'vue-router';
import {ga} from '@/pdv/analytics';
import axios from 'axios';

import SearchTown from '@/components/search-town/do.vue'
import SearchParty from '@/components/search-party/do.vue'
import PartyPreviewFull from '@/components/party-preview-full/do.vue'
import PartyPreviewLarge from '@/components/party-preview-large/do.vue'
import PartyPreviewTiny from '@/components/party-preview/do.vue'
import PersonPreviewBlock from '@/components/person-preview-block/do.vue'
import PersonPreviewLinear from '@/components/person-preview-linear/do.vue'
import KrajskeVolbyResults from '@/views/history/volby/krajske-volby/do.vue';
import SenatniVolbyResults from '@/views/history/volby/senatni-volby/do.vue';
import ActivityLogoSet from '@/views/aktivity/guide/logo/do.vue';
import CtaSupportShort from '@/components/cta/support-short/do.vue';
import AnswerPreview from '@/components/answer-preview/do.vue';

export default {
	name: 'aktivity-guide-26',
	props: ['townID'],
	data: function () {
		return {
			$router: useRouter(),
			townSearch: null,	
			view: {
				zastupitelstvo: 1,
				magistrat: 1,
				senat: 1,
			},				
			obvodAbout: {
				_27: "městské části Praha 1, Praha 7 a Praha-Troja, část území městské části Praha 2, tvořená částí katastrálního území Nové Město, ležící na území městské části Praha 2 a katastrálním územím Vyšehrad, část území městské části Praha 6, tvořená katastrálním územím Střešovice, částí katastrálního území Bubeneč a částí katastrálního území Hradčany, ležícími na území městské části Praha 6"
			},
			current: {
				_3: "Miroslav Plevný",
				_6: "Ivo Trešl",
				_9: "Lumír Aschenbrenner",
				_12: "Tomáš Fiala",
				_15: "Jaroslav Chalupský",
				_18: "Petr Štěpánek",
				_21: "Václav Láska",
				_24: "David Smoljak",
				_27: "Miroslava Němcová",
				_30: "Adéla Sucharda Šípová",
				_33: "Zbyněk Linhart",
				_36: "Jiří Vosecký",
				_39: "Jan Sobotka",
				_42: "Pavel Kárník",
				_45: "Jan Holásek",
				_48: "Jan Grulich",
				_51: "Josef Klement",
				_54: "Tomáš Třetina",
				_57: "Karel Zitterbart",
				_60: "Zdeněk Papoušek",
				_63: "Jitka Seitlová",
				_66: "Marek Ošťádal",
				_69: "Helena Pešatová",
				_72: "Ondřej Šimetka",
				_75: "Ondřej Feber",
				_78: "Tomáš Goláň",
				_81: "Josef Bazala"
			},
			partAllow: [563889,505927]
		}
	},
	components: {
		SearchTown,
		PartyPreviewFull,
		PartyPreviewLarge,
		PartyPreviewTiny,
		PersonPreviewBlock,
		PersonPreviewLinear,
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
		townSelected: function () {
			return this.townID || this.townSearch;
		},
		checkData: function () {
			return this.townSelected ? this.$store.getters.pdv('elections/specific/261009-list/' + this.townSelected) : null;
		},
		zastupitelstvo: function () {
			return this.checkData ? this.$store.getters.pdv('elections/fetch/176:' + this.townSelected) : null;
		},
		magistrat: function () {
			return this.checkData && this.checkData.cast.obec ? this.$store.getters.pdv('elections/fetch/176:' + this.checkData.cast.obec) : null;
		},
		senat: function () {
			return this.checkData && this.checkData.senat.length > 0 ? this.$store.getters.pdv('elections/fetch/173:' + this.checkData.senat[0].obvod) : null;
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
		}
	},
	mounted: function () {

	  if (this.townID == 556904) this.$router.push('/pruvodce/2026/' + 563889);
	  if (this.townID == 555321) this.$router.push('/pruvodce/2026/' + 505927);

	  window.scrollTo(0, 1);
	  ga('Průvodce volbami 2026');

	  if (window.innerWidth > 800) {
		this.view.zastupitelstvo = 3;
		this.view.magistrat = 3;
		this.view.senat = 3;
	  } 
	},
	watch: {
		townID: function () {
	  		window.scrollTo(0, 1);

			if (this.townID == 556904) this.$router.push('/pruvodce/2026/' + 563889);
			if (this.townID == 555321) this.$router.push('/pruvodce/2026/' + 505927);
		}
	}
};
