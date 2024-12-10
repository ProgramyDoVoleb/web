import { cdn, today } from '@/stores/core';

export default {
	name: 'p-collapsible',
	props: ['label', 'logo', 'open', 'tick', 'seo', 'skip', 'borderless', 'status', 'party', 'color', 'empty'],
	data: function () {
		return {
			opened: false,
			cdn
		}
	},
	methods: {
		toggleVisible: function () {
			if (!this.empty) this.opened = !this.opened;

			// this.$store.dispatch("ge", {
			// 	action: this.seo && this.seo.action ? this.seo.action : "collapsible_state_change",
			// 	category: this.seo && this.seo.category ? this.seo.category : "engagement",
			// 	label: (this.seo && this.seo.label ? this.seo.label : "Změna zobrazení: ") + this.label,
			// 	value: this.opened ? 1 : 0
			// });
		},
		hide: function () {
			this.opened = false;
		}
	},
	mounted: function () {
		if (this.open) this.opened = this.open;
	},
	watch: {
		open: function () {
			if (typeof this.open != "undefined") this.opened = this.open;
		},
		tick: function () {
			if (typeof this.open != "undefined") this.opened = this.open;
		}
	}
};
