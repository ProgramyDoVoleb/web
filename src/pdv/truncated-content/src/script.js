import {untag} from '@/pdv/helpers';

export default {
	name: 'TruncatedLinear',
	props: ['headline', 'icon', 'cta', 'keep', 'size'],
	data: function () {
		return {
			show: false,
			tick: 0,
			short: null
		}
	},
	methods: {
		checkShort: function () {

			// console.log(this.headline, this.tick, this.headline && this.tick > -1);

			if (this.headline && this.tick > -1) {
				this.short = this.headline.split(' ').splice(0, this.size || 20).join(' ');
				return;
			}

			if (this.$refs && this.$refs.txt) {
				this.short = this.$refs.txt.innerText.split(' ').splice(0, this.size || 20).join(' ');
			} else {
				this.short = '<strong>Rychlé shrnutí</strong>';
			}

			this.tick++;
			
			return null;
		}
	},
	mounted: function () {
		this.checkShort();

		var int = setInterval(() => this.checkShort(), 50);

		setTimeout(() => clearInterval(int), 2000);
	}
};
