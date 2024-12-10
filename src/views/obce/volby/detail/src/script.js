import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import EvropskeVolby from '@/views/obce/volby/evropske-volby/do.vue'
import SnemovniVolby from '@/views/obce/volby/snemovni-volby/do.vue'
import KrajskeVolby from '@/views/obce/volby/krajske-volby/do.vue'
import KomunalniVolby from '@/views/obce/volby/komunalni-volby/do.vue'
import SenatniVolby from '@/views/obce/volby/senatni-volby/do.vue'
import PrezidentskeVolby from '@/views/obce/volby/prezidentske-volby/do.vue'
import {date} from '@/pdv/helpers';

export default {
	name: 'layout-obec-volby-detail',
	props: ['id', 'type', 'local', 'label', 'election', 'spec'],
	data: function () {
		return {
			cdn, today,
			hash: 'detail-volby'
		}
	},
  components: {
	EvropskeVolby, 
	SnemovniVolby, 
	KrajskeVolby, 
	KomunalniVolby, 
	SenatniVolby, 
	PrezidentskeVolby
  },
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		data: function () {

			var addon = null;

			if (this.type.key === 'KV') addon = ':' + (this.spec || this.local.obec);
			if (this.type.key === 'KZ') addon = ':' + (this.spec || this.local.KRZAST);
			if (this.type.key === 'SENAT') addon = ':' + (this.spec || this.local.obvod);

			var d = this.$store.getters.pdv("elections/fetch/" + this.id + (addon || ''));
			return d 
		}
	},
	methods: {
		date
	}
};
