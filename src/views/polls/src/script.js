import GraphParties from '@/views/polls/parties/do.vue';
import GraphPeople from '@/views/polls/people/do.vue';
import GraphDuel from '@/views/polls/duels/do.vue';
import PollOfPolls from '@/views/polls/pollofpolls/do.vue';
import PollsPreview from '@/components/polls-preview/do.vue';

import { defineAsyncComponent } from 'vue';
import {useData} from '@/stores/data';
import {ga} from '@/pdv/analytics';

import {date, number, color, indicator} from '@/pdv/helpers';

export default {
	name: 'layout-polls',
	data: function () {
		return {
			agency: [{color: '#d4b655', name: 'Kantar'}, {color: '#21BBE1', name: 'Median'}, {color: '#D75F5F', name: 'STEM'}, {color: '#1964aa', name: 'NMS Market Research'}, {color: '#1bc8b0', name: 'Ipsos'}], // 'CVVM', 'Data Collect', 'Ipsos',
			type: 1,
			pollCoalitions: false,
			sortByMid: true,
			chartOptions: {
				chart: {
					height: 500,
					type: 'rangeBar',
					locales: [{
					  "name": "cs",
					  "options": {
						"months": ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosines"],
						"shortMonths": ["Led", "Úno", "Bře", "Dub", "Kvě", "Čer", "Čvn", "Srp", "Zář", "Říj", "Lis", "Pro"],
						"days": ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
						"shortDays": ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
						"toolbar": {
							"exportToSVG": "Stáhnout SVG",
							"exportToPNG": "Stáhnout PNG",
							"exportToCSV": "Stáhnout CSV",
							"menu": "Menu",
							"selection": "Výběr",
							"selectionZoom": "Přiblížení",
							"zoomIn": "Přiblížit",
							"zoomOut": "Oddálit",
							"pan": "Posun",
							"reset": "Obnovit"
						}
					  }
					}],
					defaultLocale: "cs"
				},
				xaxis: {
				  type: 'datetime'
				},
				yaxis: {
				  show: false
				},
				plotOptions: {
				  bar: {
					horizontal: true,
					distributed: true,
					dataLabels: {
					  hideOverflowingLabels: false
					}
				  }
				},
				dataLabels: {
				  enabled: true,
				  formatter: function(val, opts) {
					// console.log(opts.dataPointIndex, opts.w.globals.labels[opts.dataPointIndex]);
					var label = opts.w.globals.labels[opts.dataPointIndex]
					return label;
				  },
				  style: {
					// colors: ['#f3f4f5', '#fff']
				  }
				},
				grid: {
				  row: {
					// colors: ['#f3f4f5', '#fff'],
					opacity: 1
				  }
				},
				title: {
				  text: 'Sběr + zveřejnění'
				},
				colors: [
					// 'var(--blue)'
				]
			},
			series: [],
			loaded: false
		}
	},
  components: {
	GraphParties, GraphPeople, GraphDuel, PollOfPolls, PollsPreview,
	VueApexCharts: defineAsyncComponent(() => import('vue3-apexcharts')),
  },
	computed: {
		$store: function () {
			return useData()
		},
		polls: function () {
			return this.$store.getters.pdv('polls/all');

			if (!p) return null;

			var list = [];

			p.list.forEach(poll => {
				poll.mid = new Date((new Date(poll.to || poll.datum).getTime() + new Date(poll.from || poll.datum).getTime()) / 2);
				list.push(poll);
			});

			list.sort((a, b) => b.mid - a.mid);

			return {list};
		},
		pollsQuick: function () {

			// console.log(1);

			var p = this.$store.getters.pdv('polls/last-8');

			if (!p) return null;

			this.series = [{data: []}];
			var s = [];

			p.list.forEach(poll => {
				s.push({
					// data: [{
						x: poll.agency.split(' Market Research')[0] + ', ' + date(poll.datum, 2),
						y: [new Date(poll.from || poll.datum).getTime(), new Date(poll.to || poll.datum).getTime()],
						// fillColor: color(poll.agency),
						goals: [
						  {
							name: 'Zveřejněno',
							value: new Date(poll.datum).getTime(),
							strokeColor: this.agency.find(x => x.name === poll.agency).color
						  }
						]
						// fillColor: '#FF4560'

					// }]
				});
				this.chartOptions.colors.push(this.agency.find(x => x.name === poll.agency).color)
			});

			this.series[0].data = s;

			if (!this.sortByMid) return p;

			var list = [];

			p.list.forEach(poll => {
				poll.mid = new Date((new Date(poll.to || poll.datum).getTime() + new Date(poll.from || poll.datum).getTime()) / 2);
				list.push(poll);
			});

			list.sort((a, b) => b.mid - a.mid);

			return {list};
		},
	},
  methods: {
	date, number, color, indicator,
	getSeries: function () {
		return JSON.parse(JSON.stringify(this.series));
	}
  },
  mounted: function () {
    window.scrollTo(0, 1);
    // this.$store.dispatch("ga", {title: "Přehled volebních průzkumů"});
	ga("Přehled volebních průzkumů");
  }
};
