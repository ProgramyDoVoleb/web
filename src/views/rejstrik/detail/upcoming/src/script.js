import { useData } from '@/stores/data';
import { useEnums } from '@/stores/enums';
import { cdn } from '@/stores/core';
import {date} from '@/pdv/helpers';
import {colorByItem, logoByItem} from '@/pdv/helpers';
import ReportModal from '@/components/report-modal/do.vue';

export default {
	name: 'party-in-upcoming-elections',
	props: ['id'],
	data: function () {
		return {
			cdn
		}
	},
	components: {
		ReportModal
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
			var d = this.$store.getters.pdv('party/upcoming/' + this.id);

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
	},
	methods: {
		date, colorByItem, logoByItem,
		sortByPorCislo: function (list) {
			list.sort((a, b) => (a.PORCISLO || 1000) - (b.PORCISLO || 1000));

			return list;
		}
	}
};
