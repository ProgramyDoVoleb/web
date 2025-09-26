import { useCore } from '@/stores/core';
import MainHeader from '@/components/header/do.vue';
import MainFooter from '@/components/footer/do.vue';

export default {
	name: 'app',
    data: function () {
      return {
        core: useCore()
      }
    },
    components: {
      MainHeader,
      MainFooter
    },
    computed: {
      extendedHeader: function () {
        var arr = [
          'krajske-volby/162',
          'senatni-volby/163',
          'snemovni-volby/166',
          'o-projektu'
        ];

        return arr.find(x => this.$route.path.split(x).length > 1) || this.$route.path === '/';
      }
    },
    methods: {
    },
    mounted: function () {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				this.core.change(true);
			}
    }
};
