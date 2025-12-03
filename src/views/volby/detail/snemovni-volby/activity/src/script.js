import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, domain, unique} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import NewsBlock from '@/components/news-block/do.vue'
import ReportForm from '@/components/report-form/do.vue'
import PartyPreview from '@/components/party-preview/do.vue';
import { colorByItem, logoByItem } from '@/pdv/helpers';
import CandidateStats from '@/components/candidate-stats/do.vue';
import SearchParty from '@/components/search-party/do.vue'

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
	ReportForm,
	PartyPreview,
	CandidateStats,
	SearchParty
  },
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		about: function () {
			var e = this.enums.elections.find(x => x.hash === 'snemovni-volby');
			return {key: e.key, data: e}
		},
		data: function () {
			var d = this.$store.getters.pdv('elections/activity/ps/' + this.id + ':' + this.party);

			if (d) {
				ga(d.strana.ZKRATKA + ' ve sněmovních volbách ' + d.cis.volby.datum.split('-')[0]);
			}

			return d;
		},
		others: function () {
			var list = [];

			if (this.data) {
				this.data.kandidati.forEach(cand => {
					var pty = this.data.list.find(x => x.KSTRANA === cand.KSTRANA);

					if (pty && pty.VSTRANA != this.party) {
						var cis = this.data.cis.strany.find(x => x.VSTRANA === pty.VSTRANA);

						if (!cis.$coalition || !cis.$coalition.find(x => x.VSTRANA == this.party)) {

							if (!this.data.podpora.find(x => x.value == this.party && pty.id == x.csu_id)) {

								var o = {
									cand,
									party: pty,
									region: this.enums.regions[cand.VOLKRAJ - 1]
								}

								list.push(o);
							}
						}
					}
				})
			}

			list.sort((a, b) => a.cand.PRIJMENI.localeCompare(b.cand.PRIJMENI, 'cs'));

			return list;
		},
		partiesActivityList: function () {
			return this.data ? this.$store.getters.pdv('parties/as-of/' + this.data.cis.volby.datum + ';1,7,47,53,166,703,720,721,768,1114,714,5,1227,1245,1265,1178,1298') : null;
		},
	},
  methods: {
		url,
		date,
		number,
		truncate,
		sortBy,
		domain,
		colorByItem, logoByItem,
		unique
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
