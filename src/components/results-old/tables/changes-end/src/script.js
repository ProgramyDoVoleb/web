import {beautifyNumber, createColorByName, checkCandidateName} from "@/store/helpers";

export default {
	name: 'results-parties-table-end',
	props: ['data'],
	data: function () {
		return {
			showAll: false
		}
	},
	methods: {
		beautifyNumber,
		checkCandidateName,
		createColorByName,
		toggle: function () {
			this.showAll = !this.showAll;
		}
	}
};
