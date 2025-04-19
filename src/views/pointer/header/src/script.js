import {useData} from '@/stores/data';
import { useCore, cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, con, type, domain, sortByPorCislo, slide, sortEvents, unique, sortBy} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import ReportForm from '@/components/report-form/do.vue';

export default {
	name: 'layout-pointer-header',
	props: ['current', 'party', 'elections', 'data', 'table', 'headline', 'subheadline'],
	data: function () {
		return {

		}
	},
  components: {
	ReportForm
  },
	computed: {
		$store: function () {
			return useData()
		},
		core: function () {
			return useCore()
		},
		enums: function () {
			return useEnums()
		},
		$volby: function () {
			return this.elections;
		},
		$strana: function () {
			return this.party;
		},
		$coalition: function () {
			if (this.current && this.current.VSTRANA) {
				return this.current && this.data.cis.strany.find(x => x.VSTRANA === this.current.VSTRANA).$coalition ? this.data.cis.strany.find(x => x.VSTRANA === this.current.VSTRANA).$coalition : null
			}
			if (this.current && this.$strana) {
				return this.current && this.data.cis.strany.find(x => x.VSTRANA === this.$strana.VSTRANA).$coalition ? this.data.cis.strany.find(x => x.VSTRANA === this.$strana.VSTRANA).$coalition : null
			}
		},
		$link: function () {
			return this.current ? '/volby/' + this.$volby.$about.hash + '/' + this.$volby.id + '/' + (this.current.JMENO ? 'kandidat' : 'strana') + '/' + this.current.id : null
		},
		label: function () {
			var res = null;

			if (this.current && this.current.OBVOD) res = 'obvod ' + this.current.OBVOD + ' · ' + this.data.cis.obvody.find(x => x.OBVOD === this.current.OBVOD).NAZEV;
			if (this.current && this.current.KRZAST) res = this.data.cis.kraje.find(x => x.KRAJ === this.current.KRZAST).NAZEV;
			if (this.current && this.current.KODZASTUP) res = this.data.cis.obce.find(x => x.NUM === this.current.KODZASTUP).NAZEV;

			return res;
		},
		contacts: function () {
			var arr = [];

			if (this.current) {
				['email', 'phone', 'address'].forEach(type => {
					if (this.current.$data[type]) {
						this.current.$data[type].forEach(x => {
							if (!arr.find(y => y.value === x.value)) arr.push(x);
						});
					}
				});
			}

			arr.sort((a, b) => a.type.localeCompare(b.type, 'cs'));

			return arr;
		},
		links: function () {
			var arr = [];

			if (this.current) {
				['wiki', 'social'].forEach(type => {
					if (this.current.$data[type]) {
						this.current.$data[type].forEach(x => {
							if (!arr.find(y => y.value === x.value || domain(y.value) === domain(x.value))) arr.push(x);
						});
					}
				});
			}

			arr.sort((a, b) => a.type.localeCompare(b.type, 'cs'));

			return arr;
		},
		involvedParties: function () {
			var list = [];

			if (this.current) {
				if (this.$strana && this.$strana.VSTRANA && this.$strana.VSTRANA != 80) {
					if (!list.find(x => x.VSTRANA === this.$strana.VSTRANA)) list.push(this.data.cis.strany.find(x => x.VSTRANA === this.$strana.VSTRANA));
				}

				if (this.current.NSTRANA && this.current.PSTRANA != 80) {
					if (!list.find(x => x.VSTRANA === this.current.NSTRANA)) list.push(this.data.cis.strany.find(x => x.VSTRANA === this.current.NSTRANA));
				}
	
				if (this.current.PSTRANA && this.current.PSTRANA != 99) {
					if (!list.find(x => x.VSTRANA === this.current.PSTRANA)) list.push(this.data.cis.strany.find(x => x.VSTRANA === this.current.PSTRANA));
				}
	
				if (this.current.VSTRANA && [997,998,999].indexOf(this.current.VSTRANA) === -1) {
					if (!list.find(x => x.VSTRANA === this.current.VSTRANA)) list.push(this.data.cis.strany.find(x => x.VSTRANA === this.current.VSTRANA));
	
					if (this.data.cis.strany.find(x => x.VSTRANA === this.current.VSTRANA).$coalition) {
						this.data.cis.strany.find(x => x.VSTRANA === this.current.VSTRANA).$coalition.forEach(member => {
							if (!list.find(x => x.VSTRANA === member.VSTRANA)) list.push(member);
						})
					}
				}
	
				if (this.current.$data.support) {
					this.current.$data.support.filter(x => typeof x.value === 'number').forEach(sup => {
						if (!list.find(x => x.VSTRANA === sup.value)) list.push(this.data.cis.strany.find(x => x.VSTRANA === sup.value));
					});
				}
	
				// list.splice(list.findIndex(x => x.VSTRANA === this.current.NSTRANA), 1);
			}

			return list;
		}
	},
  methods: {
		url,
		con,
		date,
		type,
		number,
		domain,
		truncate,
		colorByItem,
		logoByItem,
		sortByPorCislo,
		slide,
		sortEvents,
		unique,
		sortBy,
		checkDuplicates: function (list) {
			var arr = [];

			list.forEach(x => {
				if (!arr.find(y => y.value === x.value)) arr.push(x);
			});

			return arr;
		},
		sortByPorCislo: function (list) {
			list.sort((a, b) => (a.PORCISLO || 1000) - (b.PORCISLO || 1000));

			return list;
		},
		randonAmount: function (arr, n) {
			var result = new Array(n),
				len = arr.length,
				taken = new Array(len);
			if (n > len)
				throw new RangeError("getRandom: more elements taken than available");
			while (n--) {
				var x = Math.floor(Math.random() * len);
				result[n] = arr[x in taken ? taken[x] : x];
				taken[x] = --len in taken ? taken[len] : len;
			}
			return result;
		}
  }
};
