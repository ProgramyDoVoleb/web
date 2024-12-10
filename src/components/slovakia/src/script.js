import {date, sortBy} from '@/pdv/helpers';

export default {
	name: 'slovakia-block',
	props: [],
	data: function () {
		return {
			list: null,
			list2: null,
			news: null
		}
	},
	computed: {
		data: async function () {
		}		
	},
	components: {},
	methods: {
		date, sortBy,
		loadData: function () {
			fetch("https://skapi.programydovoleb.cz/elections/fetch/1").then(response => {
				response.json().then((data) => {
					this.list = data.list[0]
				});
			});
			fetch("https://skapi.programydovoleb.cz/elections/fetch/2").then(response => {
				response.json().then((data) => {
					this.list2 = data.list[0]
				});
			});
		},
		loadNews: function () {
			const response = fetch("https://skapi.programydovoleb.cz/news/last50").then(response => {
				response.json().then((data) => {
					this.news = data.list[0]
				});
			});
		}
	},
	mounted: function () {
		this.loadData();
		this.loadNews();
	}
};
