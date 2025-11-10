import {useData} from '@/stores/data';
import HeroMap from '@/components/hero-map/okres/do.vue';

export default {
	name: 'layout-volby-okres',
	props: ['id', 'district'],
	data: function () {
		return {
			
		}
	},
  components: {
	HeroMap
  },
	computed: {
	},
  methods: {
  }
};
