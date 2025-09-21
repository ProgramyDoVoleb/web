import {number, round, sortBy} from '@/pdv/helpers';
import {colorByItem} from '@/components/results/helpers';
import { useEnums } from '@/stores/enums';

export default {
	name: 'CandidateStats',
	props: ['data', 'cis', 'color', 'status', 'slozeni', 'focus', 'simple', 'tag'],
	data: function () {
		return {
			selected: null,
			selectedLast: 0,
			enums: useEnums()
		}
	},
	computed: {
		global: function () {
			return null; // this.$store.getters.getSource('volby/kom/2022/static/stats/cz');
		},
		count: function () {
			return this.data.length
		},
		results: function () {
			var obj = {
				age: round(this.data.reduce((acc, curr) => acc + curr.VEK, 0) / this.data.length, 2),
				woman: this.data.reduce((acc, curr) => acc + (this.isWoman(curr) ? 1 : 0), 0),
				uni: this.data.reduce((acc, curr) => acc + (curr.TITULPRED || curr.TITULZA ? 1 : 0), 0),
				young: this.data.reduce((acc, curr) => acc + (curr.VEK < 30 ? 1 : 0), 0),
				old: this.data.reduce((acc, curr) => acc + (curr.VEK > 65 ? 1 : 0), 0)
			};

			return obj;
		},
		electedResults: function () {
			var obj = {
				count: 0
			};

			if (this.status === 3 && this.data.find(x => x.MANDAT === 'A')) {

				var mandates = this.data.filter(x => x.MANDAT === 'A');

				obj = {
					count: mandates.length,
					age: round(mandates.reduce((acc, curr) => acc + curr.VEK, 0) / mandates.length, 2),
					woman: mandates.reduce((acc, curr) => acc + (this.isWoman(curr) ? 1 : 0), 0),
					uni: mandates.reduce((acc, curr) => acc + (curr.TITULPRED || curr.TITULZA ? 1 : 0), 0),
					young: mandates.reduce((acc, curr) => acc + (curr.VEK < 30 ? 1 : 0), 0),
					old: mandates.reduce((acc, curr) => acc + (curr.VEK > 65 ? 1 : 0), 0)
				};
			}

			return obj;
		},
		demo: function () {
			var data = [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			];

			this.data.forEach(person => {
				var sex = 0;

				if (this.isWoman(person)) sex = 1;

				var group = Math.floor(((person.VEK || 55) - 15) / 5);

				// if (group === 15) console.log(person);

				data[sex][group]++;
			});

			return {data, max: Math.max((Math.max(...data[0])), (Math.max(...data[1])))};
		}
	},
	methods: {
		number, colorByItem, sortBy,
		averageAge: function (list) {
			var age = 0;
			var count = 0;

			list.forEach(person => {
				if (person.data[6]) {
					count++;
					age += person.data[6];
				}
			});

			var result = this.round(age / count);

			return result;
		},
		round: function (value) {
			return Math.round(100 * value)/100
		},
		pct: function (count, base) {
			return Math.round(10000 * count / base)/100
		},
		isWoman: function (person) {
			var woman = false;

			if (person.PRIJMENI[person.PRIJMENI.length - 1] === 'á') woman = true;
			if (person.JMENO[person.JMENO.length - 1] === 'a') woman = true;
			if (person.JMENO[person.JMENO.length - 1] === 'e') woman = true;
			if (person.$data && person.$data.mfo && person.$data.mfo.length > 0 && person.$data.mfo[0].value === 1) woman = false;
			if (person.$data && person.$data.mfo && person.$data.mfo.length > 0 && person.$data.mfo[0].value === 2) woman = true;

			return woman;
		}
	},
	mounted: function () {
		setInterval(() => {
			if (new Date().getTime() - 2500 > this.selectedLast) {
				this.selected = null;
			}
		});
	},
	watch: {
		selected: function () {
			this.selectedLast = new Date().getTime();
		}
	}
};
