import {useData} from '@/stores/data';
import { useCore, cdn } from '@/stores/core';
import { useRoute } from 'vue-router';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, con, type, domain} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import ElectionResults from '@/views/history/volby/detail/do.vue';
import ElectionItem from '@/views/volby/item/do.vue';

export default {
	name: 'layout-profile',
	props: ['id'],
	data: function () {
		return {
			cdn
		}
	},
  components: {
	NewsItem,
	ElectionResults,
	ElectionItem
  },
	computed: {
		$store: function () {
			return useData()
		},
		$route: function () {
			return useRoute()
		},
		core: function () {
			return useCore()
		},
		enums: function () {
			return useEnums()
		},
		data: function () {
			var d = this.$store.getters.pdv('profile/full/' + this.id)

			if (d) {
				d.profile.$funkce.sort((a, b) => (b.do || "2099-12-31").localeCompare((a.do || "2099-12-31"), 'cs'));
				d.cis.volby.sort((a, b) => (b.datum || "2099-12-31").localeCompare((a.datum || "2099-12-31"), 'cs'));
				d.list.sort((a, b) => (b.$volby[0].datum || "2099-12-31").localeCompare((a.$volby[0].datum || "2099-12-31"), 'cs'));

				if (d.cis.okresy) {
					var arr = [];

					d.cis.okresy.forEach(item => {
						if (!arr.find(x => x.NUMNUTS === item.NUMNUTS)) {
							arr.push(item);
						}
					});

					arr.sort((a, b) => a.NAZEV.localeCompare(b.NAZEV, 'cs'));

					d.cis.okresy = arr;
				} 
				if (d.cis.kraje) {
					var arr = [];

					d.cis.kraje.forEach(item => {
						if (!arr.find(x => x.KRAJ === item.KRAJ) && String(item.NUTS).length === 5) {
							arr.push(item);
						}
					});

					arr.sort((a, b) => a.NAZEV.localeCompare(b.NAZEV, 'cs'));

					d.cis.kraje = arr;
				} 
			}

			return d;
		},
		news: function () {
			return this.data ? this.data.news : null;
		},
		headline: function () {
			if (!this.data) return 'Načítám...';

			var hdl = this.data.profile.display;

			ga(hdl + ' - profil');

			return hdl;
		},
		contacts: function () {
			var arr = [];

			if (this.data.profile) {
				['email', 'phone', 'address'].forEach(type => {
					if (this.data.profile.$data[type]) {
						this.data.profile.$data[type].forEach(x => {
							if (!arr.find(y => y.value === x.value)) arr.push(x);
						});
					}
				});
			}

			arr.sort((a, b) => a.type.localeCompare(b.type, 'cs'));

			return arr;
		},
		linksAll: function () {
			var arr = [];

			if (this.data.profile) {
				['web', 'link', 'wiki', 'social'].forEach(type => {
					if (this.data.profile.$data[type]) {
						this.data.profile.$data[type].forEach(x => {
							if (!arr.find(y => y.value === x.value || domain(y.value) === domain(x.value))) arr.push(x);
						});
					}
				});
			}

			arr.sort((a, b) => a.type.localeCompare(b.type, 'cs'));

			return arr;
		},
		links: function () {
			var arr = [];

			if (this.data.profile) {
				['link', 'wiki', 'social'].forEach(type => {
					if (this.data.profile.$data[type]) {
						this.data.profile.$data[type].forEach(x => {
							// console.log(domain(x.value));
							if (!arr.find(y => y.value === x.value || domain(y.value) === domain(x.value))) arr.push(x);
						});
					}
				});
			}

			arr.sort((a, b) => a.type.localeCompare(b.type, 'cs'));

			return arr;
		},
		elections: function () {
			if (!this.data) return null;

			var res = [];
			
			this.data.cis.volby.forEach(x => {
				var o = {
					id: x.id,
					datum: x.datum
				}

				res.push(o);
			});

			res.sort((a, b) => (b.datum || '2099-12-31').localeCompare((a.datum || '2099-12-31'), 'cs'));

			return res;
		},
		photo: function () {
			if (!this.data) return null;

			var res = null;

			if (this.data.profile.$data.photo.length > 0) res = this.data.profile.$data.photo[0].value;

			this.elections.forEach(el => {
				this.data.list.filter(x => x.volby === el.id).forEach(item => {
					if (!res) {
						if (item.$data.photo.length > 0) res = item.$data.photo[0].value;
					}
				})
			});

			return res;
		},
		links2: function () {
			if (!this.data) return null;

			var res = [];

			if (this.data.profile.$data.social.length > 0) {
				this.data.profile.$data.social.forEach(x => res.push(x.value))
			}

			this.elections.forEach(el => {
				this.data.list.filter(x => x.volby === el.id).forEach(item => {
					// if (!res) {
						item.$data.social.forEach(x => {
							if (!res.find(y => y === x.value || domain(y) === domain(x.value))) res.push(x.value);
						});
					// }
				})
			});

			return res;
		}
	},
  methods: {
		url,
		con,
		date,
		type,
		number,
		truncate,
		colorByItem,
		logoByItem,
		domain,
		checkDuplicates: function (list) {
			var arr = [];

			list.forEach(x => {
				if (!arr.find(y => y.value === x.value)) arr.push(x);
			});

			return arr;
		}
  },
  mounted: function () {
    window.scrollTo(0, 1);
  },
  watch: {
	data: function () {
		window.scrollTo(0, 1);
	}
  }
};
