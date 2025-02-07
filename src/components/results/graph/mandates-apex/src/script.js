import { defineAsyncComponent } from 'vue';

export default {
	name: 'results-graph-mandates',
	props: ['mandates', 'selected'],
	components: {
		VueApexCharts: defineAsyncComponent(() => import('vue3-apexcharts'))
	},
	data: function () {
		return {
			first: false,
			chartOptions: {
				chart: {
					height: 500,
					type: 'donut',
					animations: {
						enabled: false
					},
				},
				plotOptions: {
				  pie: {
					startAngle: -90,
					endAngle: 90,
					offsetY: 10,
					expandOnClick: false
				  }
				},
				dataLabels: {
				  enabled: false
				},
				grid: {
				  padding: {
					bottom: -250
				  }
				},
				legend: {
					show: false
				},
				yaxis: {
					enabled: false
				},
				labels: [],
				colors: [],
			},
			series: [],
			tick: 1
		}
	},
	computed: {
		data: function () {

			var arr = this.mandates.filter(x => this.selected.find(y => y === x.hash));

			this.mandates.filter(x => !this.selected.find(y => y === x.hash)).forEach(x => arr.push(x));

			this.tick++;

			this.chartUpdate();

			// this.tick++;

			return arr;
		}
	},
	methods: {
		chartUpdate: function () {
			var int = setInterval(() => {
				if (this.data.length > 0 && this.$refs.myChart) {
					this.$refs.myChart.destroy();
	
					this.chartOptions.labels = this.data.map(x => x.short);
					this.chartOptions.colors = [];
					this.chartOptions.chart.width = Math.floor(this.$el.getBoundingClientRect().width * .75);
					this.chartOptions.grid.padding.bottom = this.chartOptions.chart.width / -2;

					this.data.forEach(x => {
						var color = x.color;

						if (color.length === 4) color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
						this.chartOptions.colors.push(color + (this.selected.indexOf(x.hash) === -1 && this.selected.length > 0 ? '22' : ''));
					});
	
					this.series = this.data.map(x => x.value);

					// this.tick++;
	
					// this.$refs.myChart.render();
	
					clearInterval(int);
				}
			}, 100);
		}
	},
	mounted: function () {
		this.chartUpdate();
	},
	watch: {
		data: function () {
		}
	}
};
