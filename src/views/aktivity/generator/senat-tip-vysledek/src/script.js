import {useData} from '@/stores/data';
import { api, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, unique, slide, domain, con, round} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import ResultsCandidatesGraphShareable from '@/components/results/people/graph-shareable/do.vue';

export default {
	name: 'aktivity-tip-kv',
	props: ['id', 'obvod'],
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
			att2: null,
			loaded: null
		}
	},
	components: {
		ResultsCandidatesGraphShareable 
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

			var d = this.$store.getters.pdv('elections/fetch/' + this.id + ':' + this.obvod);

			if (d) {
				setTimeout(() => {
					this.addMainEight();
					this.loaded = d;
				}, 500);				
			}

			return d;
		},
		inRound2: function () {
			return this.list.find(x => x.value > 50) ? [] : sortBy(this.list, 'value', 0, null, true).filter((x, i) => i < 2)
		},
		winner: function () {
			var arr = [];

			var winIn1 = this.list.find(x => x.value > 50);

			if (winIn1) {
				arr.push(winIn1);
			} else if (this.inRound2.length > 0) {
				if (this.inRound2[0].rnd2 > 0) {
					if (this.inRound2[0].rnd2 > 50) {
						arr.push(this.inRound2[0]);
					} else if (this.inRound2[0].rnd2 < 50) {
						arr.push(this.inRound2[1]);
					}
				}
			}

			return arr;
		},
		current: function () {
			return this.parties ? this.parties.list[0] : null
		},
		$obvod: function () {
			return this.current ? this.current.$dotcene.find(x => x.OBVOD == this.obvod) : null
		},
		valid: function () {
			return this.list.reduce((a, b) => a + b.value, 0) <= 100 && this.list.reduce((a, b) => a + b.value, 0) >= this.list.reduce((a, b) => a + (b.value === 0 ? 4.9 : 0), 0);
		},
		data: function () {
			var d = {
				$data: [],
				agency: this.$obvod.OBVOD + ' - ' + this.$obvod.NAZEV,
				datum: today,
				amount: 1,
				type: 1,
				attendance1: this.att && this.att >= 0 && this.att <= 100 ? this.att : null,
				attendance2: this.att2 && this.att2 >= 0 && this.att2 <= 100 ? this.att2 : null
			};

			this.list.forEach(item => {
				d.$data.push({
					cand: item.item,
					rnd1: item.value,
					rnd2: item.rnd2,
					inRnd2: !!this.inRound2.find(x => x.item.id === item.item.id),
					winner: !!this.winner.find(x => x.item.id === item.item.id)
				});
			});

			d.$data.sort((a, b) => b.rnd1 - a.rnd1);

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
						label: party.JMENO + ' ' + party.PRIJMENI,
						short: party.NAZEV_VS,
						link: '/bod/csu_senat_rk/' + party.id,
						color: colorByItem(party, this.data),
						logo: logoByItem(party, this.data),
						votes: item.value,
						pct: item.value,
					}

					if (o.logo.includes('empty') && con(party.$data, 'photo')) {
						o.logo = con(party.$data, 'photo');
					}

					list.push(o);
				})
			}

			return list;
		},
		mandates: function () {
			var arr = [];
			var mandates = Number(this.$obvod.MANDATY);

			// console.log(1);

			this.list.filter(x => x.value / x.candidates >= 5 / Number(this.$obvod.MANDATY)).forEach(item => {
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
				name: item.JMENO + ' ' + item.PRIJMENI,
				pty: truncate(item.NAZEV_VS, 24, true),
				filt: item.PRIJMENI,
				value: 0,
				rnd2: 0
			});
			this.tick++;
		},
		addMainEight: function () {
			this.current.$kandidati.filter(x => x.CKAND > 0 && x.PLATNOST && x.PLATNOST === 'A').forEach(x => this.addItem(x));
		},
		logoOrPhoto: function (item, data) {
			var logo = logoByItem(item, data);

			if (logo.includes('empty')) {
				logo = con(item.$data, 'photo');
			}

			return logo;
		}
	},
	mounted: function () {
	  window.scrollTo(0, 1);
	  ga('Můj tip na výsledek');
	},
	watch: {
	}
};
