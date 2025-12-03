import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, domain} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import NewsBlock from '@/components/news-block/do.vue'
import KrajskeVolby from '@/views/volby/detail/krajske-volby/detail/do.vue'
import ReportForm from '@/components/report-form/do.vue'
import { colorByItem, logoByItem } from '@/pdv/helpers';

export default {
	name: 'layout-volby-aktivity-strany',
	props: ['id', 'party'],
	data: function () {
		return {
			cdn, today
		}
	},
  components: {
	NewsItem, NewsBlock,
	KrajskeVolby,
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
			var e = this.enums.elections.find(x => x.hash === 'krajske-volby');
			return {key: e.key, data: e}
		},
		data: function () {
			var d = this.$store.getters.pdv('elections/activity/kz/' + this.id + ':' + this.party);

			if (d) {
				ga(d.strana.ZKRATKA + ' v krajských volbách ' + d.cis.volby.datum.split('-')[0]);
			}

			return d;
		},
		others: function () {
			var list = [];

			if (this.data) {
				this.data.kandidati.forEach(cand => {
					var pty = this.data.list.find(x => x.KRZAST === cand.KRZAST && x.KSTRANA === cand.KSTRANA);

					if (pty && pty.VSTRANA != this.party) {
						var cis = this.data.cis.strany.find(x => x.VSTRANA === pty.VSTRANA);

						if (!cis.$coalition || !cis.$coalition.find(x => x.VSTRANA == this.party)) {

							if (!this.data.podpora.find(x => x.value == this.party && pty.id == x.csu_id)) {

								var o = {
									cand,
									party: pty,
									region: this.enums.regions[cand.KRZAST - 1]
								}

								list.push(o);
							}
						}
					}
				})
			}

			list.sort((a, b) => a.cand.PRIJMENI.localeCompare(b.cand.PRIJMENI, 'cs'));

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
		colorByItem, logoByItem
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
