import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, con, number, truncate, sortBy, domain, pct, unique, colorByItem, logoByItem} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import NewsBlock from '@/components/news-block/do.vue'
import KrajskeVolby from '@/views/volby/detail/krajske-volby/detail/do.vue'
import ReportForm from '@/components/report-form/do.vue'
import MapLeaflet from '@/components/map-leaflet/do.vue'
import ActivityDetail from '@/views/volby/detail/komunalni-volby/activity-detail/do.vue'
import ProgramBlock from '@/components/program-block-dynamic/do.vue';
import PartyQuicklook from '@/components/party-quicklook/do.vue';
import CandidateStats from '@/components/candidate-stats/do.vue';
import PersonPreviewBlock from '@/components/person-preview-block/do.vue';
import PartyPreviewLarge from '@/components/party-preview-large/do.vue';

export default {
	name: 'layout-mayors-before',
	props: ['id'],
	data: function () {
		return {
			cdn, today,
			druhy: [
				{id: 3, headline: 'Ve statutárních městech'},
				{id: 2, headline: 'V dalších městech'},
				{id: 6, headline: 'V městysích'},
				{id: 1, headline: 'V dalších obcích'},
				{id: 5, headline: 'V městských částech'}
			]
		}
	},
  components: {
	NewsItem, NewsBlock,
	KrajskeVolby,
	ReportForm,
	MapLeaflet,
	ActivityDetail,
	ProgramBlock,
	PartyQuicklook,
	CandidateStats,
	PersonPreviewBlock,
	PartyPreviewLarge
  },
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		about: function () {
			var e = this.enums.elections.find(x => x.hash === 'komunalni-volby');
			return {key: e.key, data: e}
		},
		data: function () {
			var d = this.$store.getters.pdv('elections/specific/' + this.id + '/before');

			return d;
		},
		$link: function () {
			return '/volby/komunalni-volby/' + this.id;
		},
		options: function () {
			var obj = {
				focus: null, 
				detail: 'obce', 
				type: null, 
				diff: null,
				party: null,
				region: null,
				zoom: 7
			}
			
			return obj;
		},
		partyID: function () {
			return this.party
		},
		colabParties: function () {
			var res = [];

			if (this.data) {
				this.data.cis.strany.forEach(x => {
					(x.$coalition || []).forEach(mem => {
						if (mem.VSTRANA != this.partyID && !res.find(y => y.VSTRANA === mem.VSTRANA)) {
							res.push(mem);
						}
					});
				});
			}

			res = sortBy(res, 'NAZEV', null, true);

			return res;
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		sortBy,
		domain, unique, pct,
		colorByItem, logoByItem,
		autoscale: function (key, obj, list) {
			var min = Math.min(...list.map(x => x[key]));
			var max = Math.max(...list.map(x => x[key]));

			// console.log(obj[key], min, max, list);

			return ((obj[key] - min) / (max - min)) * .8 + .1;
		},
		map_filter: function (feature, layer) {
			var res = true;

			if (this.data) {
				res = this.data.list.find(x => x.obec == feature.properties.KOD)
			}			

			return res;
		},
		map_style: function (feature) {
			var fillOpacity = 1;
			var color = 'var(--blue)';
			var empty = false;
			
			var item = this.data.mayors.find(x => x.KODZASTUP == feature.properties.KOD);

			color = colorByItem(item, this.data, 'NSTRANA');

			return {
				fillOpacity: empty ? null : fillOpacity * .75,
				className: empty ? 'p-leaflet-path---empty' : 'p-leaflet-path',
				color: empty ? null : color
			}
		},
		map_popup: function (feature, layer, ev) {
			var obec = this.data.list.find(x => x.obec === Number(feature.properties.KOD));
			var okres = this.data.cis.okresy.find(x => x.NUTS === feature.properties.LAU1_KOD);

			var content = [];
				content.push(feature.properties.NAZEV);
				if (okres) content.push('<div class="smallest dimm">okres ' + okres.NAZEV + '</div>');
				content.push('<div class="smallest dimm">' + obec.MANDATY + ' mandátů</div>');

			var mayor = this.data.mayors.find(x => x.id === obec.mayor);

			if (mayor) {
				content.push('<div class="p-line _05"></div>');
				content.push('<div class="smaller strong">' + mayor.JMENO + ' ' + mayor.PRIJMENI + '</div>');
				if (mayor.$party) {
					content.push('<div class="smallest">volební strana: ' + mayor.$party.NAZEV + '</div>');
					content.push('<div class="smallest">nominace: ' + this.data.cis.strany.find(x => x.VSTRANA === mayor.NSTRANA).ZKRATKA + '</div>');
					content.push('<div class="smallest">členství: ' + this.data.cis.strany.find(x => x.VSTRANA === mayor.PSTRANA).ZKRATKA + '</div>');
				} else {
					content.push('neznámé')
				}
			}

			if (obec.coalition) {
				content.push('<div class="p-line _05"></div>');
				content.push('<div class="tiny strong dimm">Koalice</div>');

				obec.coalition.forEach(x => {
					var party = this.data.parties.find(y =>y.id === x);

					content.push('<div class="smallest p-offset reverse"><div>' + party.NAZEV + '</div><div class="green">' + party.MAND_STR + '</div></div>');
				});

				content.push('<div class="p-gap _05"></div>');
				content.push('<div class="tiny strong dimm">Opozice</div>');

				this.data.parties.filter(x => x.KODZASTUP === obec.obec && obec.coalition.indexOf(x.id) === -1).forEach(party => {
					content.push('<div class="smallest p-offset reverse"><div>' + party.NAZEV + '</div><div class="red">' + party.MAND_STR + '</div></div>');
				});
			}

			this.$refs.map.popup(
				layer.getCenter(), 
				content.join(''),
				{
					autoPan: false
				}
			);
		},
		map_onEachFeature: function (feature, layer) {
			layer.addEventListener('click', (ev) => this.map_popup(feature, layer, ev));
			layer.addEventListener('mouseover', (ev) => this.map_popup(feature, layer, ev));
		},
		relatedWithParty: function (VSTRANA) {
			var res = [];

			this.data.list.$kandidati.filter(x => x.NSTRANA === VSTRANA).forEach(x => res.push(x));

			// console.log(VSTRANA, this.data.list.$strany.filter(x => String(x.SLOZENI).split(',').map(y => Number(y)).indexOf(VSTRANA) > -1));

			this.data.list.$strany.filter(x => String(x.SLOZENI).split(',').map(y => Number(y)).indexOf(VSTRANA) > -1).forEach(x => res.push(x));

			return res;
		}
  },
  mounted: function () {
    window.scrollTo(0, 1);
    ga('Kdo vedl města před volbami?');
  },
  watch: {
	id: function () {
		window.scrollTo(0, 1);
	},
	region: function () {
		window.scrollTo(0, 1);
	}
  }
};
