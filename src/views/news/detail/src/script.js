import {date, number, truncate, indicator, domain} from "@/pdv/helpers";
import NewsItem from '@/components/news-item/do.vue'
import {useData} from '@/stores/data';
import {ga} from '@/pdv/analytics';
import { useCore, cdn } from '@/stores/core';

export default {
	name: 'NewsDetail',
	props: ['id'],
	data: function () {
		return {
			cdn,
			election_types: {
				'EP': {hash: 'evropske-volby', name: 'Evropské volby'},
				'KV': {hash: 'komunalni-volby', name: 'Komunální volby'},
				'KZ': {hash: 'krajske-volby', name: 'Krajské volby'},
				'PREZ': {hash: 'prezidentske-volby', name: 'Prezidentské volby'},
				'PS': {hash: 'snemovni-volby', name: 'Sněmovní volby'},
				'SENAT': {hash: 'senatni-volby', name: 'Senátní volby'}
			},
		}
	},
	components: {
		NewsItem
	},
	methods: {
		date, number, truncate, indicator, domain
	},
	computed: {
		$store: function () {
			return useData()
		},
		item: function () {
			var x = this.$store.getters.pdv('news/fetch/' + this.id);

			if (x) {
				return x.list[0]
			} else {
				return null;
			}
		},
		news: function () {
			return this.$store.getters.pdv('news/last5');
		}
	},
	mounted: function () {
		window.scrollTo(0, 1);
		ga("Novinka " + this.id);
	}
};
