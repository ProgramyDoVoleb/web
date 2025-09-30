import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, domain, unique, slide} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import NewsBlock from '@/components/news-block/do.vue'
import ReportForm from '@/components/report-form/do.vue'
import PartyPreview from '@/components/party-preview/do.vue';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import CandidateStats from '@/components/candidate-stats/do.vue';
import SearchParty from '@/components/search-party/do.vue'

export default {
	name: 'layout-volby-aktivity-strany',
	props: ['id', 'party'],
	data: function () {
		return {
			cdn, today,
			searchQuery: null,
			answersFilter: 1,
			listFilter: 50,
			filterFunction: null,
			filterRegion: null
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

			if (d && location.hash) {
				setTimeout(() => slide(location.hash.split('#')[1], this.$el), 250);
			}

			return d;
		},
		current: function () {
			return this.data ? this.data.list[0] : null
		},
		searchResults: function () {
			var results = [];

			if (this.current && this.searchQuery && this.searchQuery.length > 2) {
				this.current.$kandidati.filter(x => x.PORCISLO && url(x.JMENO + ' ' + x.PRIJMENI).includes(url(this.searchQuery))).forEach(x => results.push(x));
			}

			return sortBy(sortBy(results, 'JMENO', null, true), 'PRIJMENI', null, true);
		},
		idsAnswered: function () {
			return this.current ? unique(this.current.$odpovedi2, 'csu_id').filter(x => x > 1000) : null
		},
		link: function () {
			return '/volby/snemovni-volby/' + this.id + '/';
		},
		filtered: function () {
			var arr = [];

			if (this.filterFunction && this.filterFunction === 1) {
				arr = sortBy(this.current.$kandidati.filter(x => x.VEK <= 30 && x.PORCISLO < 6), 'PRIJMENI', null, true);
			}

			if (this.filterFunction && this.filterFunction === 2) {
				arr = sortBy(this.current.$kandidati.filter(x => this.isWoman(x) && x.PORCISLO < 6), 'PRIJMENI', null, true);
			}

			if (this.filterFunction && this.filterFunction === 3) {
				arr = sortBy(this.current.$kandidati.filter(x => x.VEK >= 70 && x.PORCISLO < 6), 'PRIJMENI', null, true);
			}

			if (this.filterRegion) {
				arr = arr.filter(x => x.VOLKRAJ === this.filterRegion)
			}

			return arr;
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
		unique,
		isWoman: function (person) {
			var woman = false;

			if (person.PRIJMENI[person.PRIJMENI.length - 1] === 'á') woman = true;
			if (person.JMENO[person.JMENO.length - 1] === 'a') woman = true;
			if (person.JMENO[person.JMENO.length - 1] === 'e') woman = true;
			if (person.$data && person.$data.mfo && person.$data.mfo.length > 0 && person.$data.mfo[0].value === 1) woman = false;
			if (person.$data && person.$data.mfo && person.$data.mfo.length > 0 && person.$data.mfo[0].value === 2) woman = true;

			return woman;
		}
  },
  mounted: function () {
    window.scrollTo(0, 1);
    ga("Kandidáti");
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
