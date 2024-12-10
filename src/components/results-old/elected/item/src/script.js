import {beautifyNumber, createColorByName, checkCandidateName} from "@/store/helpers";

export default {
	name: 'results-elected-item',
	props: ['party', 'elected', 'color', 'only', 'counts'],
	computed: {
		sorted: function () {
			var list = [];

			this.elected.forEach(el => list.push(el));

			list.sort((a, b) => a.name[2].localeCompare(b.name[2], 'cs'));

			return list;
		}
	},
	methods: {
		createColorByName,
		checkCandidateName
	}
};
