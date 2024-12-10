import {useData} from '@/stores/data';
import {useEnums} from '@/stores/enums';
import {type, date, sortBy} from '@/pdv/helpers';
import electionList from '@/stores/enums/elections';

export default {
	name: 'profile-preview',
	props: ['id', 'compact'],
	data: function () {
		return {
			electionList,
			enums: useEnums(),
			limit: true,
			limitLength: 6
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			return this.$store.getters.pdv('profile/full/' + this.id);
		},
		elections: function () {
			if (!this.data) return null;

			var res = [];
			
			this.data.cis.volby.forEach(x => {
				var o = {
					id: x.id,
					datum: x.datum
				}

				res.push(o);
			});

			res.sort((a, b) => (b.datum || '2099-12-31').localeCompare((a.datum || '2099-12-31'), 'cs'));

			return res;
		},
		photo: function () {
			if (!this.data) return null;

			var res = null;

			if (this.data.profile.$data.photo.length > 0) res = this.data.profile.$data.photo[0].value;

			this.elections.forEach(el => {
				this.data.list.filter(x => x.volby === el.id).forEach(item => {
					if (!res) {
						if (item.$data.photo.length > 0) res = item.$data.photo[0].value;
					}
				})
			});

			return res;
		},
		links: function () {
			if (!this.data) return null;

			var res = [];

			if (this.data.profile.$data.social.length > 0) this.data.profile.$data.social.forEach(x => res.push(x.value));

			this.elections.forEach(el => {
				this.data.list.filter(x => x.volby === el.id).forEach(item => {
					// if (!res) {
						item.$data.social.forEach(x => {
							if (!res.find(y => y === x.value)) res.push(x.value);
						});
					// }
				})
			});

			return res;
		}
	},
	methods: {
		type, date, sortBy,
		color: function (cand, election) {
			var c = 'var(--greyish)';

			if (election.status < 3) {
				c = 'var(--blue)';
			} else {
				if (cand.MANDAT) {
					if (cand.MANDAT === 'A') {
						c = 'var(--green)';
					} else {
						c = 'var(--red)';
					}
				} else {
					if (cand.ZVOLEN_K1 === 1 || cand.ZVOLEN_K2 === 1) {
						c = 'var(--green)';
					} else if (cand.ZVOLEN_K1 === 2) {
						c = 'var(--yellow)';
					} else {
						c = 'var(--red)';
					}
				}
			}

			return c;
		}
	}
};
