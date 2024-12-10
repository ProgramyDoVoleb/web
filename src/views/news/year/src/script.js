import {date, number, truncate, indicator} from "@/pdv/helpers";
import NewsItem from '@/components/news-item/do.vue'
import {useData} from '@/stores/data';

export default {
	name: 'GraphPollsParties',
	props: ['year'],
	data: function () {
		return {
		}
	},
	components: {
		NewsItem
	},
	methods: {
		date, number, truncate, indicator
	},
	computed: {
		$store: function () {
			return useData()
		},
		news: function () {
			return this.$store.getters.pdv('news/year/' + this.year)
		}
	},
	mounted: function () {
	}
};
