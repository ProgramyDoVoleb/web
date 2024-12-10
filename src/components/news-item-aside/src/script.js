import {url, date, domain} from '@/pdv/helpers';

export default {
	name: 'NewsItem',
	props: ['data', 'direct', 'noSource'],
	data: function () {
		return {}
	},
	computed: {
		loaded: function () {
			return true;
		},
		type: function () {
			var icon = 'link';

			if (['fb', 'tw', 'yt', 'ig', 'linkedin', 'wiki'].indexOf(this.data.outlet) > -1) {
				icon = this.data.outlet;
			}

			if (['program', 'answers'].indexOf(this.data.type) > -1) {
				icon = this.data.type;
			}

			if (['blesk', 'denik', 'drbna', 'hn', 'idnes', 'irozhlas', 'lidovky', 'novinky', 'seznamzpravy'].indexOf(this.data.outlet) > -1) {
				icon = undefined;
			}

			return icon;
		},
		img: function () {
			var icon = undefined;

			if (['fb', 'tw', 'yt', 'ig', 'linkedin', 'wiki'].indexOf(this.data.outlet) > -1) {
				icon = undefined;
			}

			if (['blesk', 'denik', 'drbna', 'hn', 'idnes', 'irozhlas', 'lidovky', 'novinky', 'seznamzpravy'].indexOf(this.data.outlet) > -1) {
				icon = '/static/icon-media/' + this.data.outlet + '.jpg';
			}

			// if (['program'].indexOf(this.data.type) > -1) {
			// 	icon = '/static/icon/program-symbol.svg';
			// }

			return icon;
		}
	},
	methods: {
		url, date, domain,
		getLinkFromHash: function (item) {

			var link = "";
			var hash = Number(String(item.hash).split('-')[0]);
			var obj;

			if (hash < 100) {
				obj = this.$store.state.static.senate.list.find(x => x.id === hash);
				link = "/obvod/" + hash + '-' + url(obj.display);
			} else {
				obj = this.$store.getters.town(hash);
				if (obj && obj.data) {
					link = "/obec/" + hash + '-' + url(obj.data[6]);
				} else {
					link = "/obec/" + hash;
				}

			}

			return link;
		}
	}
};
