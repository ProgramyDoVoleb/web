import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, colorByItem, slide} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import KomunalniVolby from '@/views/volby/detail/komunalni-volby/detail/do.vue'
import SearchTown from '@/components/search-town/do.vue'
import PopUp from '@/components/pop-up/do.vue';
import EditableSuggest from '@/components/editable/suggest/do.vue';
import { useNotifications } from '@/stores/notifications'

export default {
	name: 'layout-volby-test-komunalni',
	props: ['id', 'zast'],
	data: function () {
		return {
			cdn, today,
			demo: [],
			valid: {
				selectedTowns: 0,
				selectedPeople: 0,
				maxPeople: 0,
				isValid: false,
				used: 0
			},
			ticket: true,
			width: window.innerWidth,
			notify: useNotifications()
		}
	},
  components: {
	NewsItem,
	KomunalniVolby,
	SearchTown,
	PopUp,
	EditableSuggest
  },
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			return this.$store.getters.pdv("elections/fetch/" + this.id + ':' + this.zast);
		},
		current: function () {
			var d = this.data ? this.data.list[0] : null 

			if (d) {

				this.demo = [];

				d.$strany.filter(x => x.POR_STR_HL > 0).forEach(party => {
					var obj = {
						name: party.NAZEV, 
						color: colorByItem(party, {cis: {strany: []}}), 
						id: party.POR_STR_HL,
						valid: false, 
						selected: false, 
						list: []
					}

					d.$kandidati.filter(x => x.POR_STR_HL === party.POR_STR_HL && x.PORCISLO > 0).forEach(cand => {
						obj.list.push({
							name: (this.width > 960 ? cand.JMENO + ' ' : '') + cand.PRIJMENI,
							id: cand.PORCISLO,
							valid: false, 
							selected: false
						});
					});

					obj.list.sort((a, b) => a.id - b.id);

					this.demo.push(obj);
					this.valid.maxPeople = d.$dotcene[0].MANDATY;
				});

				this.demo.sort((a, b) => a.id - b.id);

				ga('Nanečisto: ' + d.$dotcene[0]['NAZEVZAST'] + ', ' + (d.datum_label || (d.datum ? date(d.datum) : d.cirka)));
			}

			return d;
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		sortBy,
		toggleTicket: function (to) {
			this.ticket = to;
			slide('test', document);
		},
		evaluate: function () {

			var lastState = this.valid.isValid;

			this.valid.selectedTowns = this.demo.reduce((a, b) => a + (b.selected ? 1 : 0), 0);
			this.valid.selectedPeople = this.demo.reduce((a, b) => a + b.list.reduce((x, y) => x + (y.selected && !b.selected ? 1 : 0), 0), 0);
			this.valid.isValid = true;

			if (this.valid.selectedTowns > 1) this.valid.isValid = false;
			if (this.valid.selectedPeople > this.valid.maxPeople) this.valid.isValid = false;
			if (this.valid.selectedPeople === 0 && this.valid.selectedTowns === 0) this.valid.isValid = false;

			this.demo.forEach(town => {
				town.valid = false;
				town.list.forEach(item => item.valid = false)
			})

			if (this.valid.isValid) {
				this.valid.used = 0;

				this.demo.forEach(town => {
					if (!town.selected) town.list.forEach(item => {
						if (item.selected) {
							item.valid = true;
							this.valid.used++;
						} 
					})
				})

				if (this.valid.selectedTowns > 0) this.demo.find(town => town.selected).list.forEach(item => {
					if (this.valid.used < this.valid.maxPeople) {
						item.valid = true;
						this.valid.used++;
					}
				})
			}

			if (this.valid.isValid != lastState) {
				var note = this.notify.add('Lístek ' + (this.valid.isValid ? 'je' : 'už není') + ' platný', this.valid.isValid ? 'green' : 'red');
			}
		},
		toggle: function (town, item) {
			if (town && item) {
				item.selected = !item.selected;
			} else {
				town.selected = !town.selected;
			}
			this.evaluate();
		}
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
