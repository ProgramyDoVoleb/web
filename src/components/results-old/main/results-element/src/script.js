import ResultsParties from "../../../types/results-parties/do";
import ResultsPeople from "../../../types/results-people/do";

export default {
	name: 'results-element',
	props: ['global', 'local', 'type', 'reg', 'table'],
	data: function () {
		return {
			useTable: this.table || true
		}
	},
	computed: {
		usePeople: function () {
			return (['prezidentske-volby', 'senatni-volby'].indexOf(this.type) > -1)
		}
	},
	components: {
		ResultsParties, ResultsPeople
	}
};
