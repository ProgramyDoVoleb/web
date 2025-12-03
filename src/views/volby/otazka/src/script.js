import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, unique, slide, toggleItem} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import CtaGetAdmin from '@/components/cta/questions/do.vue';

export default {
	name: 'volby-qa',
	props: ['hash', 'id', 'qid'],
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
			hasStrany: false,
			filtr: {
				VOLKRAJ: null,
				PSPParty: []
			},
			razeni: 1
		}
	},
	components: {
		CtaGetAdmin
	},
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		data: function () {
			var d = this.$store.getters.pdv('elections/qa/' + this.qid + (this.$route.query.vyber ? ':' + this.$route.query.vyber : ''));

			if (d) {
				ga(d.list[0].question + ' - ' + this.enums.elections.find(x => x.key === d.cis.volby[0].typ).name + ' - ' + (d.cis.volby[0].cirka || date(d.cis.volby[0].datum)));
				this.hasStrany = !!(d.list[0].$body && d.list[0].$body.find(x => x.$strana));
			}

			return d;
		},
		$volby: function () {
			return this.data ? this.data.cis.volby[0] : null;
		},
		$answers: function () {
			return this.data ? this.data.list[0].$odpovedi : null;
		},
		$strany: function () {
			if (!this.data) return;

			var list = null;

			if (this.data.list[0].$body && this.data.list[0].$body.find(x => x.$strana)) {
				list = [];

				this.data.list[0].$body.filter(x => x.$strana).forEach(item => {
					if (!list.find(x => x.id === item.$strana.id)) {
						list.push(item.$strana);
					}
				});

				list = sortBy(list, 'NAZEV', '', true);
			}

			return list;
		},
		filteredList: function () {
			var arr = this.data.list[0].$body;

			if (this.filtr.VOLKRAJ !== null) {
				arr = arr.filter(x => x.$kandidat.VOLKRAJ === this.filtr.VOLKRAJ);
			}

			if (this.filtr.PSPParty.length > 0) {
				arr = arr.filter(x => this.filtr.PSPParty.find(y => y.KSTRANA === x.$kandidat.KSTRANA));
			}

			return arr;
		},
		filteredPartyList: function () {
			if (!this.data.list[0].$body.find(x => x.$kandidat && x.$kandidat.VOLKRAJ)) return null;

			var arr = [];

			this.data.list[0].$body.forEach(x =>{
				if (!arr.find(y => y.id === x.$strana.id)) {
					arr.push(x.$strana);
				}
			});

			arr = sortBy(arr, 'ZKRATKA', null, true);

			return arr;
		}
	},
	methods: {
		date, sortBy, logoByItem, colorByItem, truncate, slide, toggleItem,
		sortByDeepPrijmeni: function (list) {
			var arr = [];

			list.forEach(x => {
				if (!arr.find(y => y.pointer === x.pointer)) arr.push(x);
			});

			arr.sort((a, b) => a.$kandidat.PRIJMENI.localeCompare(b.$kandidat.PRIJMENI, 'cs'));

			return arr;
		},
		sortByDeepZkratka: function (list) {
			var arr = [];

			list.forEach(x => {
				if (!arr.find(y => y.pointer === x.pointer)) arr.push(x);
			});

			arr.sort((a, b) => a.$strana.ZKRATKA.localeCompare(b.$strana.ZKRATKA, 'cs'));

			return arr;
		},
		sortByDeepPorCislo: function (list) {
			var arr = [];

			list.forEach(x => {
				if (!arr.find(y => y.pointer === x.pointer)) arr.push(x);
			});

			arr.sort((a, b) => a.$kandidat.PORCISLO - b.$kandidat.PORCISLO);

			return arr;
		},
		onlyLast: function (list) {
			var arr = [];
			var res = [];

			list.filter(x => x.status === 1).forEach(item => arr.push(item));
			arr.sort((a, b) => b.id - a.id);

			return arr[0];
		}
	},
	mounted: function () {
	  window.scrollTo(0, 1);
	}
};
