import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, domain, unique} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import NewsBlock from '@/components/news-block/do.vue'
import ReportForm from '@/components/report-form/do.vue'
import PartyPreview from '@/components/party-preview/do.vue';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import CandidateStats from '@/components/candidate-stats/do.vue';
import SearchParty from '@/components/search-party/do.vue'

export default {
	name: 'layout-volby-prehled-stran',
	props: ['id'],
	data: function () {
		return {
			cdn, today,
			showAll: true
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
			var d = this.$store.getters.pdv('elections/fetch/' + this.id);

			return d;
		},
		current: function () {
			return this.data ? this.data.list[0] : null
		},
		link: function () {
			return '/volby/snemovni-volby/' + this.id + '/';
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
		unique
  },
  mounted: function () {
    window.scrollTo(0, 1);
    ga("Přehled stran");
  },
  watch: {
	id: function () {
		window.scrollTo(0, 1);
	}
  }
};
