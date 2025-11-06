import {useData} from '@/stores/data';
import PartyPreviewLeader from '@/components/party-preview-leader/do.vue';
import PartyPreviewTiny from '@/components/party-preview-tiny/do.vue';
import {url, date, number, truncate, domain, con, sortBy, shuffle} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import PopUp from '@/components/pop-up/do.vue';
import PromoBlock from '@/components/cta/promo-block/do.vue';
import SearchTown from '@/components/search-town/do.vue';
import { useEnums } from '@/stores/enums';

export default {
	name: 'HomepageKV',
	props: ['elections', 'answers'],
	data: function () {
		return {
			width: window.innerWidth,
			searchQuery: null
		}
	},
	components: {
	  PartyPreviewLeader, PartyPreviewTiny, PopUp, PromoBlock, SearchTown
	},
	computed: {
		$store: function () {
			return useData()
		},
		election: function () {
			return this.$store.getters.pdv('elections/specific/' + this.elections.id + '/quicklook');
		},
		enums: function () {
			return useEnums()
		},
		searchResults: function () {
			var results = [];

			if (this.searchQuery && this.searchQuery.length > 2 && this.election && this.election.list[0]) {
				this.election.list[0].$kandidati.filter(x => x.PORCISLO && url(x.JMENO + ' ' + x.PRIJMENI).includes(url(this.searchQuery))).forEach(x => results.push(x));
			}

			return sortBy(sortBy(results, 'JMENO', null, true), 'PRIJMENI', null, true);
		}
	},
	methods: {
		sortBy, shuffle,
		logoByItem, colorByItem,
		sortByPorCislo: function (list) {
			list.sort((a, b) => (a.PORCISLO || 1000) - (b.PORCISLO || 1000));

			return list;
		}
	},
	mounted: function () {
		setTimeout(() => {
			this.width = this.$el.getBoundingClientRect().width;
			window.addEventListener('resize', () => this.width = this.$el.getBoundingClientRect().width);
		}, 500);
	}
};
