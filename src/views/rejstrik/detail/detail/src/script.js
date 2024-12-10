import { useData } from '@/stores/data';
import { useEnums } from '@/stores/enums';

import KomunalniVolby from '@/views/rejstrik/volby/komunalni-volby/do.vue';
import KrajskeVolby from '@/views/rejstrik/volby/krajske-volby/do.vue';
import SnemovniVolby from '@/views/rejstrik/volby/snemovni-volby/do.vue';
import EvropskeVolby from '@/views/rejstrik/volby/evropske-volby/do.vue';
import SenatniVolby from '@/views/rejstrik/volby/senatni-volby/do.vue';
import PrezidentskeVolby from '@/views/rejstrik/volby/prezidentske-volby/do.vue';

export default {
	name: 'party-election-detail',
	props: ['hash', 'elections', 'party', 'focus'],
	components: {
		KomunalniVolby,
		KrajskeVolby,
		SnemovniVolby,
		EvropskeVolby,
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
		election_types: function () {
			return this.enums.elections;
		},
		data: function () {
			var d = this.$store.getters.pdv('elections/party-in-elections/' + this.elections + ':' + this.party);

			if (d) {
				if (d.cis.okresy) {
					var arr = [];

					d.cis.okresy.forEach(item => {
						if (!arr.find(x => x.NUMNUTS === item.NUMNUTS)) {
							arr.push(item);
						}
					});

					arr.sort((a, b) => a.NAZEV.localeCompare(b.NAZEV, 'cs'));

					d.cis.okresy = arr;
				} 
				if (d.cis.kraje) {
					var arr = [];

					d.cis.kraje.forEach(item => {
						if (!arr.find(x => x.KRAJ === item.KRAJ) && String(item.NUTS).length === 5) {
							arr.push(item);
						}
					});

					arr.sort((a, b) => a.NAZEV.localeCompare(b.NAZEV, 'cs'));

					d.cis.kraje = arr;
				} 
			}

			return d;
		}
	}
};
