import axios from 'axios';

import { useCore } from '@/stores/core';
import { useRoute, useRouter } from 'vue-router'
import MainHeader from '@/components/header/do.vue';
import MainFooter from '@/components/footer/do.vue';

export default {
	name: 'app',
    data: function () {
      return {
        core: useCore(),
        $router: useRouter(),
        $route: useRoute(),
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

        return arr.find(x => this.$route.path.split(x).length > 1);
      }
    },
    methods: {
    },
    mounted: function () {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				this.core.change(true);
			}

      var excessiveFUPDetected = document.querySelector('meta[name="excessive-fup"]');

      if (excessiveFUPDetected) {
        this.core.ban();
      }

      axios.interceptors.response.use(function (response) {

        if (response.data.excessiveFUPDetected) {
          this.core.ban();
        }

        return response;
      }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      });
    }
};
