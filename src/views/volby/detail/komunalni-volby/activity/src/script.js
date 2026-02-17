import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, domain, pct, unique} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import NewsBlock from '@/components/news-block/do.vue'
import KrajskeVolby from '@/views/volby/detail/krajske-volby/detail/do.vue'
import ReportForm from '@/components/report-form/do.vue'
import { colorByItem, logoByItem } from '@/pdv/helpers';
import MapLeaflet from '@/components/map-leaflet/do.vue'
import ActivityDetail from '@/views/volby/detail/komunalni-volby/activity-detail/do.vue'

export default {
	name: 'layout-volby-aktivity-strany',
	props: ['id', 'party'],
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
	ActivityDetail
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
			var d = this.$store.getters.pdv('elections/activity/kv/' + this.id + ':' + this.party);

			if (d) {
				ga(d.strana.ZKRATKA + ' v komunálních volbách ' + d.cis.volby.datum.split('-')[0]);
			}

			return d;
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
				res = this.data.list.$obce.find(x => x.obec == feature.properties.KOD)
			}			

			return res;
		},
		map_style: function (feature) {
			var fillOpacity = 1;
			var color = 'var(--blue)';
			var empty = false;

			var party = this.data.list.$strany.find(x => x.KODZASTUP === Number(feature.properties.KOD));

			if (this.data && this.data.cis.volby.status === 3) {
				var obec = this.data.list.$obce.find(x => x.obec === Number(feature.properties.KOD));

				color = party.MAND_STR > 0 ? 'var(--green)' : 'var(--red)';
				empty = party.MAND_STR === 0;

				if (party.MAND_STR > 0) {
					fillOpacity = .25 + (party.MAND_STR * 2 / obec.MANDATY);
				}
			} else {
				color = colorByItem(party, this.data);
			}

			return {
				fillOpacity: empty ? null : fillOpacity * .75,
				className: empty ? 'p-leaflet-path---empty' : 'p-leaflet-path',
				color: empty ? null : color
			}
		},
		map_popup: function (feature, layer, ev) {

			var party = this.data.list.$strany.find(x => x.KODZASTUP === Number(feature.properties.KOD));
			var obec = this.data.list.$obce.find(x => x.obec === Number(feature.properties.KOD));
			var okres = this.data.cis.okresy.find(x => x.NUTS === feature.properties.LAU1_KOD);

			var content = [];
				content.push(feature.properties.NAZEV);
				if (okres) content.push('<div class="smallest dimm">okres ' + okres.NAZEV + '</div>');
				content.push('<div class="smallest dimm">' + obec.MANDATY + ' mandátů</div>');
				content.push('<div class="p-line"></div>');
				content.push('<strong><a href="/volby/komunalni-volby/' + party.volby + '/strana/' + party.id + '">' + party.NAZEV + '</a></strong>');

			if (this.data.cis.strany.find(x => x.VSTRANA === party.VSTRANA).$coalition) {
				content.push('<div class="p-gap _05"></div>');
			}

			(this.data.cis.strany.find(x => x.VSTRANA === party.VSTRANA).$coalition || []).forEach(member => {
				content.push('<div class="smaller">- ' + member.NAZEV + '</div>');
			});

			if (this.data && this.data.cis.volby.status === 3) {
				content.push('<div class="p-line"></div>');
				content.push('<div>výsledek: ' + party.PROCHLSTR + ' %' + '</div>');
				content.push('<div>celkem hlasů: ' + number(party.HLASY_STR) + '</div>');

				if (party.MAND_STR > 0) {
					content.push('<div class="strong mt05 green">zisk mandátů: ' + party.MAND_STR + ' <span class="dimm smallest">z ' + obec.MANDATY + ' (' + pct(party.MAND_STR, obec.MANDATY) + ' %)</span></div>');

					if (this.data.cis.strany.find(x => x.VSTRANA === party.VSTRANA).$coalition) {
						content.push('<div class="smaller"><span class="strong">- z toho nominovaní <em>' + this.data.strana.ZKRATKA + '</em>:</span> ' + (this.data.list.$kandidati.filter(x => x.KODZASTUP === obec.obec && x.MANDAT === 'A' && x.NSTRANA == this.party)).length + '</div>');
					}					

					var members = this.data.list.$kandidati.filter(x => x.KODZASTUP === obec.obec && x.MANDAT === 'A' && x.PSTRANA == this.party);

					if (members.length > 0) {
						content.push('<div class="smaller"><span class="strong">- z toho členové:</span> ' + sortBy(members, 'PRIJMENI', null, true).map(x => x.JMENO + ' ' + x.PRIJMENI).join(', ') + '</div>');
					}					
				}				
			} 
			
			if (this.data && this.data.cis.volby.status === 2) {
				content.push('<div class="p-line"></div>');

				var members = this.data.list.$kandidati.filter(x => x.KODZASTUP === obec.obec && x.PLATNOST === "A" && x.NSTRANA == this.party);

				if (members.length > 0) {
					content.push('<div>Nominací: ' + members.length + ', z toho členů: ' + members.filter(x => x.PSTRANA == this.party).length + '</div>');
					content.push('<div class="smaller">Na čele kandidátky: ' + members.filter(x => x.PORCISLO < 6).map(x => x.JMENO + ' ' + x.PRIJMENI).join(', ')  + '</div>')
				}
			}
			
			if (this.data && this.data.cis.volby.status === 1) {
				var members = this.data.list.$kandidati.filter(x => x.KODZASTUP === obec.obec);

				if (members.length > 0) {
					content.push('<div class="p-line"></div>');
					content.push('<div class="smaller">Možní kandidáti: ' + sortBy(members, 'PRIJMENI', null, true).map(x => x.JMENO + ' ' + x.PRIJMENI).join(', ') + '</div>');
				}

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
  },
  mounted: function () {
    window.scrollTo(0, 1);
    //ga(this.about.data.name);
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
