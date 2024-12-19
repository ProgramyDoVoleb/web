import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, domain} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import NewsBlock from '@/components/news-block/do.vue'
import KrajskeVolby from '@/views/volby/detail/krajske-volby/detail/do.vue'
import ReportForm from '@/components/report-form/do.vue'
import PersonPreviewBlock from '@/components/person-preview-block/do.vue';
import { colorByItem, logoByItem } from '@/components/results/helpers';

export default {
	name: 'layout-senatni-volby-aktivity-strany',
	props: ['id', 'party'],
	data: function () {
		return {
			cdn, today
		}
	},
  components: {
	NewsItem, NewsBlock,
	KrajskeVolby,
	PersonPreviewBlock,
	ReportForm
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
			return {key: e.key, data: e}
		},
		data: function () {
			var d = this.$store.getters.pdv('elections/activity/senat/' + this.id + ':' + this.party);

			if (d) {
				ga(d.strana.ZKRATKA + ' v senátních volbách ' + d.cis.volby.datum.split('-')[0]);
			}

			return d;
		},
		list: function () {
			var list = [];

			if (this.data) {
				String(this.data.cis.volby.dotcene).split(',').forEach(obv => {
					var o = {
						obvod: this.data.cis.obvody.find(x => x.OBVOD == obv),
						cand: null,
						type: {
							support: false,
							coal: false,
							solemn: false,
							nominee: false,
							member: false
						}
					}

					this.data.list.filter(x => x.OBVOD == obv).forEach(cand => {
						if (cand.PSTRANA == this.party) {
							o.cand = cand;
							o.type.member = true
						}
						if (cand.NSTRANA == this.party) {
							o.cand = cand;
							o.type.nominee = true
						}
						if (cand.VSTRANA == this.party) {
							o.cand = cand;
							o.type.solemn = true
						}
						if (this.data.cis.strany.find(x => cand.VSTRANA === x.VSTRANA && x.$coalition && x.$coalition.find(y => y.VSTRANA == this.party ))) {
							o.cand = cand;
							o.type.coal = true
						}
						if (this.data.podpora.find(x => x.csu_id === cand.id)) {
							o.cand = cand;
							o.type.support = true
						}
					});

					list.push(o);
				});
			}

			return list;
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		sortBy,
		domain,
		colorByItem, logoByItem,
		current: function (obv) {
			var o = this.data.cis.volby;
				o.$dotcene = this.data.cis.obvody;
				o.$kandidati = this.data.list.filter(x => x.OBVOD == obv);

			return o;
		}
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
