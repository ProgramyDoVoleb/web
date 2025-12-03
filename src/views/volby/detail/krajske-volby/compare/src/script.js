import {cdn} from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {number, pct, reverse, round} from '@/pdv/helpers';
import { colorByItem } from '@/pdv/helpers';

export default {
	name: 'volby-porovnani',
	props: ['current', 'previous'],
	data: function () {
		return {
			cdn
		}
	},
	computed: {
		enums: function () {
			return useEnums()
		},
		parties_byNomination: function () {
			var arr = [];

			this.current.list[0].$zvoleni.forEach(item => {
				if (!arr.find(x => x.NSTRANA === item.NSTRANA)) {
					arr.push({NSTRANA: item.NSTRANA});
				}
			})

			this.previous.list[0].$zvoleni.forEach(item => {
				if (!arr.find(x => x.NSTRANA === item.NSTRANA)) {
					arr.push({NSTRANA: item.NSTRANA});
				}
			})

			arr.forEach(party => {
				this.previous.cis.strany.filter(x => x.VSTRANA === party.NSTRANA).forEach(res => {
					party.color = colorByItem(res, this.previous);
					party.previous = {
						party: res,
						list: this.previous.list[0].$zvoleni.filter(x => x.NSTRANA === party.NSTRANA)
					}
				})
				this.current.cis.strany.filter(x => x.VSTRANA === party.NSTRANA).forEach(res => {
					party.color = colorByItem(res, this.current);
					party.current = {
						party: res,
						list: this.current.list[0].$zvoleni.filter(x => x.NSTRANA === party.NSTRANA)
					}
				})
			});

			arr.sort((a, b) => ((b.current ? b.current.list.length : 0) - (b.previous ? b.previous.list.length : 0)) - ((a.current ? a.current.list.length : 0) - (a.previous ? a.previous.list.length : 0)))

			return arr;
		},
		parties_byRegistration: function () {
			var arr = [];

			this.current.list[0].$strany.forEach(item => {
				if (!arr.find(x => x.VSTRANA === item.VSTRANA)) {
					arr.push({VSTRANA: item.VSTRANA});
				}
			})

			this.previous.list[0].$strany.forEach(item => {
				if (!arr.find(x => x.VSTRANA === item.VSTRANA)) {
					arr.push({VSTRANA: item.VSTRANA});
				}
			})

			arr.forEach(party => {
				var runs = false;

				this.previous.cis.strany.filter(x => x.VSTRANA === party.VSTRANA).forEach(res => {
					party.color = colorByItem(res, this.previous);

					runs = this.previous.list[0].$strany.find(y => y.VSTRANA === res.VSTRANA)

					if (runs) {

						party.previous = {
							party: res,
							result: this.previous.list[0].$vysledky.find(x => x.KSTRANA === runs.KSTRANA),
							list: this.previous.list[0].$zvoleni.filter(x => x.KSTRANA === runs.KSTRANA),
							runs
						}
					}
				})
				this.current.cis.strany.filter(x => x.VSTRANA === party.VSTRANA).forEach(res => {
					party.color = colorByItem(res, this.current);

					runs = this.current.list[0].$strany.find(y => y.VSTRANA === res.VSTRANA)

					if (runs) {

						party.current = {
							party: res,
							result: this.current.list[0].$vysledky.find(x => x.KSTRANA === runs.KSTRANA),
							list: this.current.list[0].$zvoleni.filter(x => x.KSTRANA === runs.KSTRANA),
							runs
						}
					}
				})

				// console.log(party);
			});
			arr.sort((a, b) => ((b.current ? b.current.result.HLASU : 0) - (b.previous ? b.previous.result.HLASU : 0)) - ((a.current ? a.current.result.HLASU : 0) - (a.previous ? a.previous.result.HLASU : 0)))
			// arr.sort((a, b) => ((b.current ? b.current.list.length : 0) - (b.previous ? b.previous.list.length : 0)) - ((a.current ? a.current.list.length : 0) - (a.previous ? a.previous.list.length : 0)))

			return arr;
		},
		candidates_renewed: function () {
			var list = [];
			var parties = this.current.list[0].$strany.filter(x => this.current.list[0].$zvoleni.find(y => y.KSTRANA === x.KSTRANA && y.MANDAT === 'A'));

			this.current.list[0].$zvoleni.forEach(elected => {
				var o = {
					display: elected.JMENO + ' ' + elected.PRIJMENI,
					currentParty: parties.find(x => x.KSTRANA === elected.KSTRANA),
					currentCandidate: elected
				}

				this.previous.list[0].$zvoleni.filter(x => x.JMENO === elected.JMENO && x.PRIJMENI === elected.PRIJMENI && x.VEK < elected.VEK).forEach(prev => {
					o.previousParty = this.previous.list[0].$strany.find(x => x.KSTRANA === prev.KSTRANA);
					o.previousCandidate = prev;
				});

				list.push(o);
			});

			return {list, parties};
		},
		candidates_lost: function () {
			var list = [];
			var parties = this.previous.list[0].$strany.filter(x => this.previous.list[0].$zvoleni.find(y => y.KSTRANA === x.KSTRANA && y.MANDAT === 'A'));

			this.previous.list[0].$zvoleni.forEach(elected => {
				var o = {
					display: elected.JMENO + ' ' + elected.PRIJMENI,
					previousParty: this.previous.list[0].$strany.find(x => x.KSTRANA === elected.KSTRANA),
					previousCandidate: elected
				}

				this.current.list[0].$zvoleni.filter(x => x.JMENO === elected.JMENO && x.PRIJMENI === elected.PRIJMENI && x.VEK > elected.VEK).forEach(prev => {
					o.currentParty = this.current.list[0].$strany.find(x => x.KSTRANA === prev.KSTRANA);
					o.currentCandidate = prev;
				});

				list.push(o);
			});

			return {list, parties};
		}
	},
	methods: {
		pct, number, reverse, round, colorByItem
	}
};
