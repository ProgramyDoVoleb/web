import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, domain, sortBy } from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import NewsBlock from '@/components/news-block/do.vue'
import SenatniVolby from '@/views/volby/detail/senatni-volby/detail/do.vue'
import ReportForm from '@/components/report-form/do.vue'
import { colorByItem, logoByItem } from '@/components/results/helpers';
import CtaGetAdmin from '@/components/cta/get-admin/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';
import SenatniVolbyResults from '@/views/history/volby/senatni-volby/do.vue';
// import CtaSupport from '@/components/cta/support/do.vue';
import MapLeaflet from '@/components/map-leaflet/do.vue'

export default {
	name: 'layout-volby-detail-senatni-obvod',
	props: ['id', 'obvod'],
	data: function () {
		return {
			cdn, today,
			options: {
				focus: 171, 
				detail: 'senat', 
				type: this.showType, 
				diff: this.showDiff,
				party: this.showParty,
				region: this.showRegion,
				zoom: 7,
				center: [49.249, 16.632]
			}
		}
	},
  components: {
	NewsItem, NewsBlock, MapLeaflet,
	SenatniVolby, ReportForm, CtaGetAdmin, SenatniVolbyResults, CtaSupport
  },
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		about: function () {
			var e = this.enums.elections.find(x => x.hash === 'senatni-volby');

			var obvod = this.data ? this.data.cis.obvody.find(x => x.obvod === Number(this.obvod)) : null

			return {key: e.key, data: e, obvod}
		},
		elections: function () {
			return this.$store.getters.pdv('elections/type/' + this.about.key);
		},
		data: function () {
			return this.$store.getters.pdv("elections/fetch/" + this.id + ':' + this.obvod);
		},
		current: function () {
			var d = this.data ? this.data.list[0] : null 

			if (d) {
				ga(this.about.data.name + ', ' + this.about.obvod.nazev + ' · ' + this.about.obvod.obvod + ', ' + (d.datum_label || (d.datum ? date(d.datum) : d.cirka)));
			}

			return d;
		},
		news: function () {
			return this.$store.getters.pdv('news/only/' + this.id + ':' + this.obvod);
		},
		newsmedia: function () {
			var list = [];

			if (this.news) {
				sortBy([].concat(this.news.list), 'datum', null, true, true).forEach(item => {
					list.push({
						source_label: item.source,
						source: 'https://programydovoleb.cz/novinky/' + item.id,
						value: item.title,
						updated: item.datum,
						label: item.priority === 9 ? 'pdv' : 'news'
					})
				});

				this.news.media.forEach(item => {
					if (!list.find(x => x.csu_id && x.csu_id === item.csu_id)) {
						list.push(item);
					}
				});

				list = sortBy(list, 'updated', null, true, true);
			}

			return list.filter((x,i) => i < 12);
		},
		previous: function () {
			return this.current.predchozi;

			// return this.$store.getters.pdv("elections/fetch/" + this.current.predchozi);
		},
		previousData: function () {
			return this.previous ? this.$store.getters.pdv("elections/fetch/" + this.previous + ':' + this.obvod) : null
		},
		senateHistory: function () {
			var d = this.$store.getters.pdv('elections/senate-history/' + this.obvod);

			if (d) {
				d.list.sort((a, b) => b.cis.volby.datum.localeCompare(a.cis.volby.datum, 'cs'));
			}

			return d;
		},
		senateHistoryRetry: function () {
			if (!this.senateHistory) return;

			return this.data.list[0].$kandidati.find(x => x.PRIJMENI === this.senateHistory.list[0].PRIJMENI);
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		domain,
		colorByItem, logoByItem,
		map_filter: function (feature, layer) {
			return Number(feature.properties.OBVOD) === Number(this.obvod);
		},
		map_style: function (feature) {
			return {};
		},
		map_popup: function (feature, layer, ev) {

			var content = [];
				content.push('<strong>Obvod ' + this.obvod + '</strong>');
				content.push('<br>' + feature.properties.SIDLO);
				content.push('<br>' + this.data.cis.obce.length + ' obcí či městských částí');
				// content.push('<div class="smaller">městské části města Brno</div>');
				// content.push('<ul class="smaller"><li>Ivanovice</li><li>Jehnice</li><li>Jundrov</li><li>Komín</li><li>Královo Pole</li><li>Medlánky</li><li>Ořešín</li><li>Řečkovice a Mokrá Hora</li><li>Brno-sever</li><li>Útěchov</li><li>Žabovřesky</li></ul>');

			this.$refs.map.popup(
				layer.getCenter(), 
				content.join(''),
				{
					autoPan: false
				}
			);
		},
		map_onEachFeature: function (feature, layer) {

			setTimeout(() => {
				this.$refs.map.fitBounds(layer._bounds);
			}, 1000);

			layer.addEventListener('click', (ev) => this.map_popup(feature, layer, ev));
			layer.addEventListener('mouseover', (ev) => this.map_popup(feature, layer, ev));
		},
  },
  mounted: function () {
    window.scrollTo(0, 1);
    //ga(this.about.data.name);
  },
  watch: {
	id: function () {
		window.scrollTo(0, 1);
	},
	obvod: function () {
		window.scrollTo(0, 1);
	}
  }
};
