import {useData} from '@/stores/data';
import { useCore, cdn, today } from '@/stores/core';
import { useRoute } from 'vue-router';
import { useEnums } from '@/stores/enums';
import types from '@/stores/enums/log';
import {url, date, number, truncate, con, type, domain, sortByPorCislo, slide, sortEvents, unique, sortBy, isWoman} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsBlock from '@/components/news-block/do.vue'
import NewsItem from '@/components/news-item/do.vue'
import NewsItemAside from '@/components/news-item-aside/do.vue'
import ElectionResults from '@/views/history/volby/detail/do.vue';
import ProgramBlock from '@/components/program-block-dynamic/do.vue';
import ProfilePreview from '@/components/profile-preview/do.vue';
import ReportModal from '@/components/report-modal/do.vue';
import ReportForm from '@/components/report-form/do.vue';
import LogItem from '@/components/log-item/do.vue';
import PartyQuicklook from '@/components/party-quicklook/do.vue';
import CandidateStats from '@/components/candidate-stats/do.vue';
import OkrskyStats from '@/components/okrsky-stats/do.vue';
import PersonPreviewLinear from '@/components/person-preview-linear/do.vue';
import PersonPreviewBlock from '@/components/person-preview-block/do.vue';
import PersonPreviewColumn from '@/components/person-preview-column/do.vue';
import PartyPreviewTiny from '@/components/party-preview-large/do.vue';
import EventItem from '@/components/event-item/do.vue'
import AnswerTopicPreview from '@/components/answer-topic-preview/do.vue';
import PartyPolls from '@/components/party-polls/do.vue'
import PointerHeader from '@/views/pointer/header/do.vue';
import PointerSummary from '@/views/pointer/summary/do.vue';
import PopUp from '@/components/pop-up/do.vue';
import EditableBasic from '@/components/editable/basic/do.vue';
import EditableSuggest from '@/components/editable/suggest/do.vue';
import EditableEvent from '@/components/editable/event/do.vue';
import EditableImage from '@/components/editable/image/do.vue';
import EditableSupportParty from '@/components/editable/support-party/do.vue';
import CtaSupportShort from '@/components/cta/support-short/do.vue';
import CtaQuestions from '@/components/cta/questions/do.vue';
import CtaGetAdmin from '@/components/cta/get-admin/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';

export default {
	name: 'layout-pointer',
	props: ['volbyType', 'volbyID', 'page', 'tableName', 'tableID'],
	data: function () {
		return {
			today,
			cdn,
			width: window.innerWidth,
			limit: 5,
			limitOff: false,
			questionLimit: 5,
			questionLimitOff: false,
			eventsLimit: 3,
			eventsOff: false,
			mediaLimit: 9,
			mediaLimitOff: false,
			types
		}
	},
  components: {
	NewsItem,
	NewsItemAside,
	ElectionResults,
	ProgramBlock,
	ProfilePreview,
	ReportModal, ReportForm,
	LogItem,
	PartyQuicklook,
	CandidateStats,
	OkrskyStats,
	NewsBlock,
	PersonPreviewLinear,
	PersonPreviewBlock,
	PersonPreviewColumn,
	EventItem,
	CtaGetAdmin, CtaSupport, CtaSupportShort, CtaQuestions,
	AnswerTopicPreview,
	PartyPolls,
	PointerHeader, PointerSummary, PartyPreviewTiny,
	PopUp,
	EditableBasic, EditableSuggest, EditableEvent, EditableSupportParty, EditableImage
  },
	computed: {
		$store: function () {
			return useData()
		},
		// $route: function () {
		// 	return useRoute()
		// },
		core: function () {
			return useCore()
		},
		enums: function () {
			return useEnums()
		},
		table: function () {
			if (this.tableName) return this.tableName;

			if (this.volbyType) {
				var el = this.enums.elections.find(x => x.hash === this.volbyType);
				var name = ['csu'];

				if (el) {
					name.push(el.key.toLowerCase());

					if (this.page) {
						if (this.page === "strana" && el.key === 'KV') name.push('ros');
						if (this.page === "strana" && el.key != 'KV') name.push('rkl');
						if (this.page === "kandidat") name.push('rk');
					}
				}

				return name.join('_');
			}
		},
		data: function () {
			var d = this.$store.getters.pdv('pointers/full/' + this.table + ':' + this.tableID);

			if (d) {
				if (this.$route && this.$route.fullPath.split('/bod/').length === 2) {
					this.$router.replace('/volby/' + this.enums.elections.find(x => x.key === d.cis.volby[0].typ).hash + '/' + d.cis.volby[0].id + '/' + (this.tableName.split('_')[2] === 'rk' ? 'kandidat' : 'strana') + '/' + d.list[0].id);

					d = null;
				}
			}

			if (d) {

				if (d.cis.okresy) {
					var arr = [];

					d.cis.okresy.forEach(item => {
						if (!arr.find(x => x.NUMNUTS === item.NUMNUTS)) {
							arr.push(item);
						}
					});

					arr.sort((a, b) => a.NAZEV.localeCompare(b.NAZEV, 'cs'));

					d.cis.okresy = arr;
				} 
				if (d.cis.kraje) {
					var arr = [];

					d.cis.kraje.forEach(item => {
						if (!arr.find(x => x.KRAJ === item.KRAJ) && String(item.NUTS).length === 5) {
							arr.push(item);
						}
					});

					arr.sort((a, b) => a.NAZEV.localeCompare(b.NAZEV, 'cs'));

					d.cis.kraje = arr;
				} 
		
				setTimeout(() => {
					if (location.hash != '') {
						this.$el.querySelector("a[name=" + location.hash.split('#')[1] + "]").scrollIntoView({behavior: "smooth", block: "center"});
					}
				}, 500);
			}

			return d;
		},
		news: function () {
			return this.data ? this.data.news : null;
		},
		newsmedia: function () {
			var list = [];

			if (this.news) {
				// sortBy([].concat(this.news.list, this.news.sys), 'datum', null, true, true).forEach(item => {
				sortBy([].concat(this.news.list), 'datum', null, true, true).forEach(item => {
					list.push({
						source_label: item.source,
						source: item.source,
						value: item.title,
						updated: item.datum,
						label: item.priority === 9 ? 'pdv' : 'Zpráva'
					})
				});

				if (this.current.$data.media) this.current.$data.media.forEach(item => {
					list.push(item);
				});

				if (this.current.$data.pr) this.current.$data.pr.forEach(item => {
					list.push(item);
				});

				list = sortBy(list, 'updated', null, true, true);
			}

			return list;
		},
		headline: function () {
			if (!this.data) return 'Načítám...';

			var hdl = "Kandidát se voleb neúčastnil";
			

			if (this.current.NAZEV) hdl = this.current.NAZEV;
			
			if (this.current.JMENO && (!this.current.PLATNOST || this.current.PLATNOST === 'A')) hdl = this.current.JMENO + ' ' + this.current.PRIJMENI;

			var title = [hdl];
			if (this.current.$strana && this.current.$strana.length > 0) title.push(this.current.$strana[0].ZKRATKA);
			title.push(this.enums.elections.find(x => x.key === this.data.cis.volby[0].typ).name + ' ' + (this.data.cis.volby[0].datum_label || (this.data.cis.volby[0].datum ? date(this.data.cis.volby[0].datum, 3) : this.data.cis.volby[0].cirka)));

			ga(title.join(' - '));

			return hdl;
		},
		current: function () {
			var res = null;

			if (this.data && this.data.list.length === 1) {
				res = this.data.list[0];
			}
			if (this.data && this.data.list.length > 1) {
				res = {
					$data: [],
					$kandidati: [],
					$program: [],
					$priority: [],
					$odpovedi: [],
					$vysledky: [],
					$zastupitelstvo: [],
					$obvody: [],
					HLASY_STR: 0,
					KODZASTUP: null,
					MAND_STR: 0,
					NAZEV: null,
					NAZEVZAST: null,
					OKRES: null,
					OSTRANA: null,
					SLOZENI: null,
					VSTRANA: null,
					ZKRATKA: null
				};

				this.data.list.forEach(obvod => {
					res.$obvody.push(obvod);

					obvod.$kandidati.forEach(x => res.$kandidati.push(x));

					res.$zastupitelstvo = obvod.$zastupitelstvo;
					res.HLASY_STR += obvod.HLASY_STR;
					res.KODZASTUP = obvod.KODZASTUP;
					res.MAND_STR += obvod.MAND_STR;
					res.NAZEV = obvod.NAZEV;
					res.NAZEVZAST = obvod.NAZEVZAST;
					res.OKRES = obvod.OKRES;
					res.OSTRANA = obvod.OSTRANA;
					res.SLOZENI = obvod.SLOZENI;
					res.VSTRANA = obvod.VSTRANA;
					res.ZKRATKA = obvod.ZKRATKA;

				});

			}

			if (res.$data.support) {
				res.$data.support.sort((a, b) => a.updated.localeCompare(b.update));
			}

			return res;
		},
		$volby: function () {
			var d = this.data ? this.data.cis.volby[0] : null; 

			if (d) {
				d.$about = this.enums.elections.find(x => x.key === d.typ);
				// this.limit = d.status === 1 ? 100 : 6;
			}

			return d;
		},
		$strana: function () {
			return this.current && this.current.$strana ? this.current.$strana[0] : null
		},
		$coalition: function () {
			if (this.current && this.current.VSTRANA) {
				return this.current && this.data.cis.strany.find(x => x.VSTRANA === this.current.VSTRANA).$coalition ? this.data.cis.strany.find(x => x.VSTRANA === this.current.VSTRANA).$coalition : null
			}
			if (this.current && this.$strana) {
				return this.current && this.data.cis.strany.find(x => x.VSTRANA === this.$strana.VSTRANA).$coalition ? this.data.cis.strany.find(x => x.VSTRANA === this.$strana.VSTRANA).$coalition : null
			}
		},
		$link: function () {
			return this.current ? '/volby/' + this.$volby.$about.hash + '/' + this.$volby.id + '/' + (this.current.JMENO ? 'kandidat' : 'strana') + '/' + this.current.id : null
		},
		specs: function () {
			var res = null;

			if (this.current && this.current.OBVOD) res = this.current.OBVOD;
			if (this.current && this.current.KRZAST) res = this.current.KRZAST;
			if (this.current && this.current.KODZASTUP) res = this.current.KODZASTUP;

			return res;
		},
		label: function () {
			var res = null;

			if (this.current && this.current.OBVOD) res = 'obvod ' + this.current.OBVOD + ' · ' + this.data.cis.obvody.find(x => x.OBVOD === this.current.OBVOD).NAZEV;
			if (this.current && this.current.KRZAST) res = this.data.cis.kraje.find(x => x.KRAJ === this.current.KRZAST).NAZEV;
			if (this.current && this.current.KODZASTUP) res = this.data.cis.obce.find(x => x.NUM === this.current.KODZASTUP).NAZEV;

			return res;
		},
		contacts: function () {
			var arr = [];

			if (this.current) {
				['email', 'phone', 'address'].forEach(type => {
					if (this.current.$data[type]) {
						this.current.$data[type].forEach(x => {
							if (!arr.find(y => y.value === x.value)) arr.push(x);
						});
					}
				});
			}

			arr.sort((a, b) => a.type.localeCompare(b.type, 'cs'));

			return arr;
		},
		links: function () {
			var arr = [];

			if (this.current) {
				['wiki', 'social'].forEach(type => {
					if (this.current.$data[type]) {
						this.current.$data[type].forEach(x => {
							if (!arr.find(y => y.value === x.value || domain(y.value) === domain(x.value))) arr.push(x);
						});
					}
				});
			}

			arr.sort((a, b) => a.type.localeCompare(b.type, 'cs'));

			return arr;
		},
		linksAll: function () {
			var arr = [];

			if (this.current) {
				['web', 'link', 'wiki', 'social'].forEach(type => {
					if (this.current.$data[type]) {
						this.current.$data[type].forEach(x => {
							if (!arr.find(y => y.value === x.value || url(y.value) === url(x.value))) arr.push(x);
						});
					}
				});
			}

			arr.sort((a, b) => a.type.localeCompare(b.type, 'cs'));

			return arr;
		},
		involvedParties: function () {
			var list = [];

			if (this.current) {
				if (this.$strana && this.$strana.VSTRANA && this.$strana.VSTRANA != 80) {
					if (!list.find(x => x.VSTRANA === this.$strana.VSTRANA)) list.push(this.data.cis.strany.find(x => x.VSTRANA === this.$strana.VSTRANA));
				}

				if (this.current.NSTRANA && this.current.PSTRANA != 80) {
					if (!list.find(x => x.VSTRANA === this.current.NSTRANA)) list.push(this.data.cis.strany.find(x => x.VSTRANA === this.current.NSTRANA));
				}
	
				if (this.current.PSTRANA && this.current.PSTRANA != 99) {
					if (!list.find(x => x.VSTRANA === this.current.PSTRANA)) list.push(this.data.cis.strany.find(x => x.VSTRANA === this.current.PSTRANA));
				}
	
				if (this.current.VSTRANA && [997,998,999].indexOf(this.current.VSTRANA) === -1) {
					if (!list.find(x => x.VSTRANA === this.current.VSTRANA)) list.push(this.data.cis.strany.find(x => x.VSTRANA === this.current.VSTRANA));
	
					if (this.data.cis.strany.find(x => x.VSTRANA === this.current.VSTRANA).$coalition) {
						this.data.cis.strany.find(x => x.VSTRANA === this.current.VSTRANA).$coalition.forEach(member => {
							if (!list.find(x => x.VSTRANA === member.VSTRANA)) list.push(member);
						})
					}
				}
	
				if (this.current.$data.support) {
					this.current.$data.support.filter(x => typeof x.value === 'number').forEach(sup => {
						if (!list.find(x => x.VSTRANA === sup.value)) list.push(this.data.cis.strany.find(x => x.VSTRANA === sup.value));
					});
				}
	
				// list.splice(list.findIndex(x => x.VSTRANA === this.current.NSTRANA), 1);
			}

			return list;
		},
		prev: function () {
			var res = null;

			if (this.current && this.current.$data.previous && this.current.$data.previous.length > 0) {
				res = this.$store.getters.pdv('pointers/full/' + this.current.$data.previous[0].value);
			}

			return res;
		}
	},
  methods: {
		url,
		con,
		date,
		type,
		number,
		domain,
		truncate,
		colorByItem,
		logoByItem,
		sortByPorCislo,
		slide,
		sortEvents,
		unique,
		sortBy,
		isWoman,
		checkDuplicates: function (list) {
			var arr = [];

			list.forEach(x => {
				if (!arr.find(y => y.value === x.value)) arr.push(x);
			});

			return arr;
		},
		sortByPorCislo: function (list) {
			list.sort((a, b) => (a.PORCISLO || 1000) - (b.PORCISLO || 1000));

			return list;
		},
		randonAmount: function (arr, n) {
			var result = new Array(n),
				len = arr.length,
				taken = new Array(len);
			if (n > len) {
				return arr;
			}
				// throw new RangeError("getRandom: more elements taken than available");
			while (n--) {
				var x = Math.floor(Math.random() * len);
				result[n] = arr[x in taken ? taken[x] : x];
				taken[x] = --len in taken ? taken[len] : len;
			}
			return result;
		},
		fetchAllSourcesOnPage: function () {
			var arr = [];
			var list = [
				'about',
				'motto',
				'support',
				'values',
				'pr',
				'graphics',
				'media',
				'event',
				'note',
				'program',
				'photo'
			];

			function addIfUnique (item) {
				if (!arr.find(x => x.updated.split(' ')[0] === item.updated.split(' ')[0] && x.source === item.source) && item.source && item.source.length > 6) {
					arr.push({
						updated: item.updated,
						source: item.source
					});

					// console.log(arr, item);
				}
			}

			list.forEach(x => {
				if (this.current.$data[x] && this.current.$data[x].length) {
					this.current.$data[x].forEach(item => addIfUnique(item))
				}	
			})

			if (this.current.$priority) {
				this.current.$priority.forEach(item => addIfUnique(item))
			}

			this.news.auto.forEach(x => {
				addIfUnique({
					updated: x.datum,
					source: x.source
				});
			});

			arr.sort((a, b) => b.updated.localeCompare(a.updated, 'cs'));

			return arr;
		}
  },
  mounted: function () {
    window.scrollTo(0, 1);
	setTimeout(() => {
		this.width = this.$el.getBoundingClientRect().width;
		window.addEventListener('resize', () => this.width = this.$el.getBoundingClientRect().width);
	}, 500);
	
  },
  watch: {
	data: function () {
		window.scrollTo(0, 1);
	}
  }
};
