import {beautifyNumber, createColorByName, checkCandidateName} from "@/store/helpers";

export default {
	name: 'results-parties-table',
	props: ['data'],
	data: function () {
		return {
			showAll: false
		}
	},
	methods: {
		beautifyNumber,
		createColorByName,
		checkCandidateName,
		toggle: function () {
			this.showAll = !this.showAll;
		},
		getClass: function (curr, prev) {
			if (curr > prev) return 'green';
			if (curr < prev) return 'red';
		}
	}
};
