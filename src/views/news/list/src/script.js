import {date, domain} from '@/pdv/helpers';
import NewsItem from '@/components/news-item/do.vue'
import NewsYear from '@/views/news/year/do.vue'
import MailchimpSignup from '@/components/mailchimp/do.vue';
import {useData} from '@/stores/data';
import { useCore, cdn } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {ga} from '@/pdv/analytics';
import log from '@/stores/enums/log';

export default {
	name: 'layout-news',
	data: function () {
		return {
			cdn,
			enums: useEnums(),
			election_types: {
				'EP': {hash: 'evropske-volby', name: 'Evropské volby'},
				'KV': {hash: 'komunalni-volby', name: 'Komunální volby'},
				'KZ': {hash: 'krajske-volby', name: 'Krajské volby'},
				'PREZ': {hash: 'prezidentske-volby', name: 'Prezidentské volby'},
				'PS': {hash: 'snemovni-volby', name: 'Sněmovní volby'},
				'SENAT': {hash: 'senatni-volby', name: 'Senátní volby'}
			},
			log: {
				types: log,
				action: {
					add: '+',
					replace: '+',
					hide: '–',
					show: '+',
				}
			}
		}
	},
	components: {
		NewsYear, MailchimpSignup, NewsItem
	},
	computed: {
		$store: function () {
			return useData()
		},
		news: function () {
			return this.$store.getters.pdv('news/last50')
		}
	},
  methods: {
	date, domain
  },
  mounted: function () {
    window.scrollTo(0, 1);
    ga("Novinky na Programech do voleb");
  }
};
