import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import { url, date, number, truncate, con, gradient, color, pct } from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';

import StatsTimeline from '@/components/stats/stats-timeline/do.vue';


export default {
	name: 'layout-obec-timeline',
	props: ['data', 'election'],
	data: function () {
		return {
			cdn, today
		}
	},
  components: {
	StatsTimeline
  },
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		parties: function () {
			return this.$store.getters.pdv('elections/noteworthy/' + this.election.key);
		},
		noteworthy: function () {
			var ids = [];
			var arr = [];
			var ready = false;

			if (this.parties) {
				this.data.forEach(item => {	

					var key = this.election.key === "EP" ? 'ESTRANA' : 'KSTRANA';

					item.$data.$vysledky.forEach(res => {
						if (res.PROCENT > 3) {
							var p = this.parties.list.find(x => x.volby === item.$volby.id && x[key] === res[key] && (this.election.key === "KZ" ? (x.KRZAST === res.KRZAST) : true));

							if (p) {
								if (ids.indexOf(p.VSTRANA) === -1) {
									ids.push(p.VSTRANA);

									var obj = {
										VSTRANA: p.VSTRANA,
										color: colorByItem(p, this.parties),
										name: p.ZKRATKA,
										list: []
									}

									if (obj.color.split('linear').length > 1) obj.color = color(obj.name);

									arr.push(obj);
								}
							}
						}
					});
				});

				arr.push({VSTRANA: 99999, color: 'var(--greyish)', list: []});
	
				this.data.forEach(el => {
					arr.forEach(item => {
						item.list.push({
							pct: 0,
							name: item.short,
							el: el.$volby.id
						})
					});
				});
	
				ids.sort((a, b) => a - b);
				arr.sort((a, b) => a.VSTRANA - b.VSTRANA);
				
				ready = true;
			}

			return {ready, ids, arr};
		},
		results: function () {
			var arr = [];

			if (this.noteworthy.ready) {
				arr = this.noteworthy.arr;

				this.data.forEach((item, index) => {	

					var key = this.election.key === "EP" ? 'ESTRANA' : 'KSTRANA';

					item.$data.$vysledky.forEach(res => {
						var p = this.parties.list.find(x => x.volby === item.$volby.id && x[key] === res[key] && (this.election.key === "KZ" ? (x.KRZAST === res.KRZAST) : true));

						if (p) {
							var a = arr.find(x => x.VSTRANA === p.VSTRANA);

							if (a) {
								a.list[index].pct = res.PROCENT;
								a.list[index].name = p.ZKRATKA;
							}
						}
					});
				});
			}

			return arr;
		},
		final: function () {
			var data = {
				dates: this.data.map(x => x.$volby.datum),
				ready: false
			}

			if (this.results.length > 0) {
				data.ready = true;
				data.parties = this.results;
			}

			return data;
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		pct
  },
  mounted: function () {
  }
};
