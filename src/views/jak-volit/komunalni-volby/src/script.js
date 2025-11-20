import {ga} from '@/pdv/analytics';
import { cdn } from '@/stores/core';

export default {
	name: 'layout-how-komunalni',
	data: function () {
		return {
			cdn,
			demo: [
				{name: 'Naše Veselá', valid: false, selected: false, list: [
					{name: 'Karel', valid: false, selected: false},
					{name: 'Ctirad', valid: false, selected: false},
					{name: 'Jitka', valid: false, selected: false},
					{name: 'Eva', valid: false, selected: false},
					{name: 'Ondra', valid: false, selected: false}
				]},
				{name: 'SNK Hasiči', valid: false, selected: false, list: [

					{name: 'Ondra', valid: false, selected: false},
					{name: 'Gustáv', valid: false, selected: false},
					{name: 'Jitka', valid: false, selected: false},
					{name: 'Lenka', valid: false, selected: false},
					{name: 'Aneta', valid: false, selected: false}
				]},
				{name: 'Jsme Veselí', valid: false, selected: false, list: [

					{name: 'Norbert', valid: false, selected: false},
					{name: 'Jitka', valid: false, selected: false},
					{name: 'Viktorie', valid: false, selected: false},
					{name: 'Tomáš', valid: false, selected: false},
					{name: 'Xaver', valid: false, selected: false},
					{name: 'Petr', valid: false, selected: false}
				]},
				{name: 'Za Veselou', valid: false, selected: false, list: [

					{name: 'Eva', valid: false, selected: false},
					{name: 'Stanislava', valid: false, selected: false},
					{name: 'Tomáš', valid: false, selected: false},
					{name: 'Jitka', valid: false, selected: false},
					{name: 'Bedřich', valid: false, selected: false},
					{name: 'Zdeňka', valid: false, selected: false},
					{name: 'Ivana', valid: false, selected: false}
				]},
				{name: 'Veselá jede', valid: false, selected: false, list: [

					{name: 'Ondra', valid: false, selected: false},
					{name: 'Gustáv', valid: false, selected: false},
					{name: 'Milan', valid: false, selected: false},
					{name: 'Petr', valid: false, selected: false},
					{name: 'Zdeňka', valid: false, selected: false},
					{name: 'Filip', valid: false, selected: false},
					{name: 'Jitka', valid: false, selected: false}
				]},
				{name: 'Stop Smutné', valid: false, selected: false, list: [

					{name: 'Eva', valid: false, selected: false},
					{name: 'Uršula', valid: false, selected: false},
					{name: 'Tomáš', valid: false, selected: false},
					{name: 'Milan', valid: false, selected: false},
					{name: 'Xaver', valid: false, selected: false},
					{name: 'Ivana', valid: false, selected: false},
					{name: 'Zdeňka', valid: false, selected: false}
				]}
			],
			valid: {
				selectedTowns: 0,
				selectedPeople: 0,
				maxPeople: 7,
				isValid: false,
				used: 0
			}
		}
	},
	methods: {
		evaluate: function () {
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
    window.scrollTo(1, 0);
    ga("Jak volit v komunálních volbách?");
  }
};
