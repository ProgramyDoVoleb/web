import {useData} from '@/stores/data';
import { useCore, cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, con, type, domain, sortByPorCislo, slide, sortEvents, unique, sortBy, isWoman} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';

export default {
	name: 'layout-pointer-summary-senat',
	props: ['elections', 'data', 'table', 'headline'],
	data: function () {
		return {

		}
	},
  components: {
	
  },
	computed: {
		$store: function () {
			return useData()
		},
		core: function () {
			return useCore()
		},
		enums: function () {
			return useEnums()
		},
		current: function () {
			return this.data.list[0]
		},
		personIsAWoman: function () {
			return this.isWoman(this.current);
		},
		link: function () {
			return '/volby/senatni-volby/' + this.elections.id + '/kandidat/' + this.current.id;
		}
	},
  methods: {
	isWoman, con, domain, unique,
	rod: function (woman, man) {
		return this.personIsAWoman ? woman : (man || '');
	}
  }
};
