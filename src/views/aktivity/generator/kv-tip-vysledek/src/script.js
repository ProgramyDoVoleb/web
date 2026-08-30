import {useData} from '@/stores/data';
import { api, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, unique, slide, domain, con, round} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import {db, results2021, coefs} from "@/components/election-simulation-imperiali-2021/helpers/votes-imperiali-2025";
import ResultsPartiesGraphShareable from '@/components/results/parties/graph-shareable/do.vue';
import ElectionSimulationImperiali2021 from '@/components/election-simulation-imperiali-2021/do.vue';

export default {
	name: 'aktivity-tip-kv',
	props: ['id', 'town'],
	data: function () {
		return {
			today,
			username: null,
			list: [],
			// mandates: [],
			mandatesSince: [],
			tick: 0,
			username: null,
			att: null,
			loaded: null
		}
	},
	components: {
		ResultsPartiesGraphShareable,
		ElectionSimulationImperiali2021
	},
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		parties: function () {
			if (this.loaded) return this.loaded;

			var d = this.$store.getters.pdv('elections/fetch/' + this.id + ':' + this.town);

			if (d) {
				setTimeout(() => {
					this.addMainEight();
					this.loaded = d;
				}, 500);				
			}

			return d;
		},
		current: function () {
			return this.parties ? this.parties.list[0] : null
		},
		$town: function () {
			return this.current ? this.current.$dotcene[0] : null
		},
		valid: function () {
			return this.list.reduce((a, b) => a + b.value, 0) <= 100 && this.list.reduce((a, b) => a + b.value, 0) >= this.list.reduce((a, b) => a + (b.value === 0 ? 4.9 : 0), 0);
		},
		data: function () {
			var d = {
				$data: [],
				agency: this.$town ? this.$town.NAZEVZAST : '',
				datum: today,
				amount: 1,
				type: 1,
				attendance: this.att && this.att >= 0 && this.att <= 100 ? this.att : null 
			};

			this.list.forEach(item => {
				d.$data.push({
					party: item.item,
					value: item.value
				});
			});

			d.$data.sort((a, b) => b.value - a.value);

			var datalist = {
				poll: d,
				cis: this.parties.cis
			}

			return datalist;
		},
		listOfParties: function () {
			var list = [];

			if (this.data) {
				this.data.poll.$data.forEach(item => {

					var party = item.party;

					var o = {
						id: party.id,
						VSTRANA: party.VSTRANA,
						label: party.NAZEV,
						short: party.NAZEV,
						link: '/rejstrik/' + party.VSTRANA,
						color: colorByItem(party, this.data),
						logo: logoByItem(party, this.data),
						votes: item.value,
						pct: item.value,
						mandates: item.mandates,
						passed: item.value >= 5
					}

					list.push(o);
				})
			}

			return list;
		},
		mandates: function () {
			var arr = [];
			var mandates = Number(this.$town.MANDATY);

			// console.log(1);

			this.list.filter(x => x.value / x.candidates >= 5 / Number(this.$town.MANDATY)).forEach(item => {
				for (var i = 1; i < item.candidates + 1; i++) {
					arr.push({
						value: 100 * item.value / item.candidates / i,
						item
					});
				}
			})

			arr.sort((a, b) => b.value - a.value);
			arr.splice(mandates, arr.length - mandates);

			var list = [];
			this.list.forEach(x => list.push({
				id: x.item.id,
				hash: x.item.id,
				item: x.item,
				mandates: 0,
				value: 0
			}));

			// console.log(list, arr);

			list.forEach(item => {
				item.mandates = arr.filter(x => x.item.item.id === item.id).length;
				item.value = item.mandates;
			});

			return list;
		}
	},
	methods: {
		date, sortBy, logoByItem, colorByItem, truncate, slide, unique, domain, con, url,
		addItem: function (item) {
			this.list.push({
				item,
				name: item.NAZEV,
				value: 0,
				candidates: this.current.$kandidati.filter(x => x.POR_STR_HL === item.POR_STR_HL && x.PLATNOST && x.PLATNOST === 'A').length
			});
			this.tick++;
		},
		addMainEight: function () {
			this.current.$strany.forEach(x => this.addItem(x));
		}
	},
	mounted: function () {
	  window.scrollTo(0, 1);
	  ga('Můj tip na výsledek');
	},
	watch: {
	}
};
