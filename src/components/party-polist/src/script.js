import {gradient} from '@/common/helpers';

export default {
	name: 'party-polist',
	props: ['reg', 'breakpoint', 'data'],
	computed: {
		color: function () {
			return this.party && this.party.color ? gradient(this.party) : '#eeeeeeaa'
		},
		party: function () {
			var party = this.$store.getters.party(Number(this.reg));

			if (this.reg === 1194) {
				party = {
					name: '"Marek Hilšer do Senátu"',
					short: 'MHS',
					color: '#DB2F32',
					reg: 1194
				}
			}

			if (!party) {
				party = {
					name: 'politické strany',
					short: 'politické strany',
					color: '#ccc'
				}
			}

			return party;
		}
	}
};
