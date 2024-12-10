import {betterURL, color} from '@/common/helpers';

export default {
	name: 'party-name-with-dot',
	props: ['reg', 'breakpoint', 'data', 'path', 'short', 'clr', 'after', 'noDot', 'long', 'avoid', 'url'],
	computed: {
		link: function () {
			var segments = [];

			segments.push(this.path || '/strana');
			segments.push(this.reg + '-' + betterURL(this.party.name));

			return [80,90,99].indexOf(this.reg) === -1 ? segments.join('/') : undefined;
		},
		color: function () {
			if (this.clr) return this.clr;

			if ([80,90,99].indexOf(this.reg) === -1) {
				return this.party && this.party.color ? this.party.color : color(this.party)
			} else {
				return this.$store.getters.party(99).color;
			}
		},
		party: function () {
			var party = this.data || this.$store.getters.party(this.reg);

			if (!party) {
				// console.log(this.reg);
			}

			if (!party) {
				party = {
					name: 'nezávislý',
					short: 'nezávislý',
					color: '#ccc'
				}
			}

			return party;
		},
		name_short: function () {
			var n = this.long ? this.party.name : this.party.short;

			if (this.avoid) {
				n = n.replace('Koalice ', '').replace('Sdružení ', '');
			}

			return n;
		},
		name_long: function () {
			var n = this.short ? this.party.short : this.party.name;

			if (this.avoid) {
				n = n.replace('Koalice ', '').replace('Sdružení ', '');
			}

			return n;
		}
	}
};
