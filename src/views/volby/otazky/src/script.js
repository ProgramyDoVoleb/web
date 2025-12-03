import {useData} from '@/stores/data';
import { cdn } from '@/stores/core';
import {ga} from '@/pdv/analytics';
import {shuffle, sortBy, number, unique, slide} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';

export default {
	name: 'volby-qa-overview',
	props: ['id'],
	data: function () {
		return {
			cdn,
			qenum: [
				{type: 2, designee: null, label: 'Volební témata', hash: 'tema'},
				{type: 1, designee: null, label: 'Otázky', hash: 'otazka'},
				{type: 1, designee: 1, label: 'Otázky pro strany', hash: 'otazka'},
				{type: 1, designee: 2, label: 'Otázky pro kandidáty', hash: 'otazka'},
				{type: 3, designee: null, label: 'Kalkulačka', hash: 'kalkulacka'}
			],
			hasObvody: this.hash === 'senatni-volby',
			hasKraje: this.hash === 'krajske-volby',
			hasObce: this.hash === 'komunalni-volby',
			hasStrany: false
		}
	},
	components: {
	},
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			var d = this.$store.getters.pdv('elections/specific/' + this.id + '/quicklook');

			if (d && location.hash) {
				setTimeout(() => slide(location.hash.split('#')[1]), 250);
			}

			return d ? d.list[0] : null;
		},
		link: function () {
			return '/volby/snemovni-volby/' + this.id + '/';
		}
	},
	methods: {
		sortBy,
		shuffle,
		number,
		unique,
		logoByItem
	},
	mounted: function () {
	  window.scrollTo(0, 1);
	  ga('Přehled otázek');
	}
};
