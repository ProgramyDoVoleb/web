import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import KomunalniVolby from '@/views/volby/detail/komunalni-volby/detail/do.vue'
import SearchTown from '@/components/search-town/do.vue'

export default {
	name: 'layout-volby-detail-komunalni-kraj',
	props: ['id', 'zast'],
	data: function () {
		return {
			cdn, today,
			hash: 'komunalni-volby'
		}
	},
  components: {
	NewsItem,
	KomunalniVolby,
	SearchTown
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
		elections: function () {
			return this.$store.getters.pdv('elections/type/' + this.about.key);
		},
		data: function () {
			return this.$store.getters.pdv("elections/fetch/" + this.id + ':' + this.zast);
		},
		current: function () {
			var d = this.data ? this.data.list[0] : null 

			if (d) {
				ga(this.about.data.name + ', ' + d.$dotcene[0]['NAZEVZAST'] + ', ' + (d.datum ? date(d.datum) : d.cirka));
			}

			return d;
		},
		news: function () {
			return this.$store.getters.pdv('news/town/' + this.zast + ':' + this.id);
		},
		previous: function () {
			return this.current.predchozi;

			// return this.$store.getters.pdv("elections/fetch/" + this.current.predchozi);
		},
		core: function () {
			return this.$store.getters.pdv('town/core/' + this.zast);
		},
	},
  methods: {
		url,
		date,
		number,
		truncate,
		sortBy
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
