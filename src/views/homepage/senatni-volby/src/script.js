import {useData} from '@/stores/data';
import PartyPreview from '@/components/party-preview/do.vue';
import PartyPreviewTiny from '@/components/party-preview-tiny/do.vue';
import {url, date, number, truncate, domain, con, sortBy} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';

export default {
	name: 'HomepageSenat',
	props: ['elections'],
	data: function () {
		return {
			width: window.innerWidth,
			list: [
				{id: 2  , label: "2 · Sokolov", count: 6},
				{id: 5  , label: "5 · Chomutov", count: 7},
				{id: 8  , label: "8 · Rokycany", count: 5},
				{id: 11 , label: "11 · Domažlice", count: 9},
				{id: 14 , label: "14 · České Budějovice", count: 6},
				{id: 17 , label: "17 · Praha 12", count: 6},
				{id: 20 , label: "20 · Praha 4", count: 8},
				{id: 23 , label: "23 · Praha 8", count: 8},
				{id: 26 , label: "26 · Praha 2", count: 5},
				{id: 29 , label: "29 · Litoměřice", count: 8},
				{id: 32 , label: "32 · Teplice", count: 6},
				{id: 35 , label: "35 · Jablonec nad Nisou", count: 6},
				{id: 38 , label: "38 · Mladá Boleslav", count: 7},
				{id: 41 , label: "41 · Benešov", count: 6},
				{id: 44 , label: "44 · Chrudim", count: 5},
				{id: 47 , label: "47 · Náchod", count: 3},
				{id: 50 , label: "50 · Svitavy", count: 7},
				{id: 53 , label: "53 · Třebíč", count: 7},
				{id: 56 , label: "56 · Břeclav", count: 9},
				{id: 59 , label: "59 · Brno-město", count: 7},
				{id: 62 , label: "62 · Prostějov", count: 6},
				{id: 65 , label: "65 · Šumperk", count: 3},
				{id: 68 , label: "68 · Opava", count: 8},
				{id: 71 , label: "71 · Ostrava-město", count: 7},
				{id: 74 , label: "74 · Karviná", count: 5},
				{id: 77 , label: "77 · Vsetín", count: 3},
				{id: 80 , label: "80 · Zlín", count: 6},
				{id: 60 , label: "60 · Brno-město"},
			]
		}
	},
	components: {
	  PartyPreview, PartyPreviewTiny
	},
	computed: {
		$store: function () {
			return useData()
		},
		election: function () {
			return this.$store.getters.pdv('elections/fetch/' + this.elections.id);
		},
		obvody: function () {
			return String(this.elections.dotcene).split(',').map(x => Number(x));
		}
	},
	methods: {
		sortBy,
		logoByItem, colorByItem,
		sortByPorCislo: function (list) {
			list.sort((a, b) => (a.PORCISLO || 1000) - (b.PORCISLO || 1000));

			return list;
		}
	}
};
