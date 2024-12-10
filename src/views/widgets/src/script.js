import {domain} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import {useData} from '@/stores/data';
import SearchTown from '@/components/search-town/do.vue'
import WidgetBlock from '@/components/widget-block/do.vue'
import { useCore, cdn } from '@/stores/core';

export default {
	name: 'layout-widgets',
	data: function () {
		return {
			cdn,
			placement: null,
			id: null,
			town: null,
			type: 1,
			banner: {
				version: 1,
				size: '480x300',
				options: [
					'480x300','300x600','970x210','728x90','300x250','320x100'
				]
			},
			api: null
		}
	},
  components: {
	SearchTown, WidgetBlock
  },
	computed: {
		$store: function () {
			return useData()
		},
		list: function () {
			if (!this.town || this.type != 2) return;

			var d = this.$store.getters.pdv('town/tiny/' + this.town.num, '2022');

			return d ? d.list : undefined;
		},
		response: function () {
			if (!this.api) return;

			var d = this.$store.getters.pdv(this.api);

			return d;
		},
		bannerCode: function () {
			var code = [];
			code.push('<a href="https://2022.programydovoleb.cz/" target="_blank" style="display: inline-block; width: ' + this.banner.size.split('x')[0] + 'px; height: ' + this.banner.size.split('x')[1] + 'px; text-decoration: none">');
			code.push('<img style="display: block" width="' + this.banner.size.split('x')[0] + '" height="' + this.banner.size.split('x')[1] + '" src="https://programydovoleb.cz/static/bannery/2022/V' + this.banner.version + '/' + this.banner.size + '.jpg">');
			code.push('</a>');

			return code.join('\n');
		},
		bannerCodeDemo: function () {
			return this.bannerCode.split('<').join('&lt;').split('>').join('&gt;')
		},
		link: function () {
			var parts = [];
			// parts.push('wid=' + Math.round(new Date().getTime() / 1000 / 60) + '.' + (Math.round(Math.random() * 89 + 10)));
			parts.push('wid=evergreen')

			if (this.placement) {
				parts.push('placement=' + domain(this.placement));
			}

			if (this.town) {
				parts.push('obec=' + this.town.obec + '&hl=' + encodeURIComponent(this.town.NAZEVZAST));
			}

			return parts.join('&');
		}
	},
  methods: {
		select: function (item) {
			this.town = item;
			this.party = null;
			this.api = 'embed/town/' + item.obec;
		}
	},
  mounted: function () {
    window.scrollTo(0, 1);
	ga("Widgety");

		setTimeout(() => {
			if (location.hash != '') {
				this.$el.querySelector("a[name=" + location.hash.split('#')[1] + "]").scrollIntoView({behavior: "smooth", block: "center"});
			}
		}, 500);
  },
	watch: {
		type: function () {
			if (this.type === 3) this.api = 'opendata/senate';
			if (this.type != 3) this.api = null;
		}
	}
};
