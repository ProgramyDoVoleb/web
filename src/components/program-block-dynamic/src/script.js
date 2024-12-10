import {useData} from '@/stores/data';
import ProgramBlock from '@/components/program-block/do.vue'
import {truncate} from '@/pdv/helpers'

export default {
	name: 'program-block-dynamic',
	props: ['hash', 'src', 'parts', 'headline', 'color'],
	components: {
		ProgramBlock
	},
	computed: {
		$: function () {
			return this.$store.getters.party;
		},
		$store: function () {
			return useData()
		},
		data: function () {
			return this.parts || this.$store.getters.json(this.src);
		}
	},
	methods: {
		truncate
	}
};
