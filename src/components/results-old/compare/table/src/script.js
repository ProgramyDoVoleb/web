import {beautifyNumber, createColorByName, checkCandidateName} from "@/store/helpers";
import TownsFilter from "@/components/towns/filter/do";

export default {
	name: 'results-compare-table',
	props: ['election', 'results', 'limit'],
	data: function () {
		return {
			electionData: {
				hash: '',
				year: 0,
				id: 0
			},
			column: 0,
			showAll: false,
			compare: [],
			tick: 0,
			index: 1
		}
	},
	components: {
		TownsFilter
	},
	computed: {
		parties: function () {
			var list = [];

			var r = [];

			this.results.forEach(p => r.push(p));
			r.sort((a, b) => b.current.pct - a.current.pct);

			r.forEach(p => list.push(p));

			return list;
		}
	},
	methods: {
		beautifyNumber,
		createColorByName,
		checkCandidateName,
		remove: function (index) {
			this.compare.splice(index, 1);
		},
		loadSourceComplete: function (data, label, index) {
			this.compare.push({
				data,
				label
			});

			this.tick++;
		},
		loadSource: function (source, label, index) {
			this.$store.getters.getPromise(source).then(data => this.loadSourceComplete(data, label, index));
		},
		select: function (attr, item) {
			var obj = {
				label: item.name
			};

			if (item.nuts && item.nuts.length === 5) {
				obj.source = 'souhrny/kraje/' + this.electionData.hash + '/' + item.nuts
			}

			if (item.nuts && item.nuts.length === 6) {
				obj.source = 'souhrny/okresy/' + this.electionData.hash + '/' + item.nuts;
				obj.label = 'okr. ' + item.name
			}

			if (item.num) {
				obj.source = 'souhrny/obce/' + item.district.nuts + '/' + item.num
			}

			this.loadSource(obj.source, obj.label, this.index);

			this.$refs.modalElement.opened = false;
		},
		getValue: function (party, source) {
			var el = source.volby[this.electionData.hash];

			var parties = [];

			el.forEach(e => {
				if (e.year && e.year === this.electionData.id) {
					parties = e.result;
				} else if (e.id && e.id === this.electionData.id) {
					parties = e.result;
				}
			});

			var party = parties.find(p => p.reg === party.reg);

			if (party) {
				return party.pct || party.ptc
			} else {
				return 0;
			}
		},
		toggle: function () {
			this.showAll = !this.showAll;
		}
	},
	mounted: function () {
		if (this.election.hash === 'snemovni-volby') this.electionData.hash = 'snemovna';
		if (this.election.hash === 'krajske-volby') this.electionData.hash = 'kraje';
		if (this.election.hash === 'evropske-volby') this.electionData.hash = 'eu';

		this.electionData.id = this.election.id;
		this.compare.push(this.results);
	},
	watch: {
		election: function () {
			// console.log ('clean and rebuild');

			while (this.compare.length > 0) this.compare.pop();
			this.compare.push(this.results);
		}
	}
};
