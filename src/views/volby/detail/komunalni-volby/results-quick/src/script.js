import {useData} from '@/stores/data';
import axios from 'axios';
import {date, sortBy, truncate, number} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';
import ElectionTable from '@/components/results/parties/table/do.vue';
import ElectionGraph from '@/components/results/parties/graph/do.vue';

export default {
	name: 'volby-komunal-results-quick',
	props: ['data', 'town'],
	components: {
		ElectionTable, 
		ElectionGraph, 
	},
	data: function () {
		return {
			sources: {
				kv154: 'https://volby.gov.cz/pls/kv2022/vysledky_obec?datumvoleb=20220923&cislo_obce=%%',
				kv176: 'https://volby.gov.cz/appdata/kv2026/20261009/odata/zastup/vysledky_obec_%%.xml'
			},
			csu: null,
			list: null
		}
	},
	computed: {
		$store: function () {
			return useData()
		}
	},
	methods: {
		date, sortBy, truncate,	colorByItem, logoByItem, number,
		loadCSU: async function () {
			var url = this.sources['kv' + this.data.list[0].id].split('%%').join(this.town);

			axios.post('https://admin.programydovoleb.cz/api.php?action=/elections/results-quick/' + this.town, {
				url
			}).then(response => {
				if (response.status === 200) {
					this.csu = response.data.csu;
					this.createList();
				}
			});
		},
		createCoalition (members) {
			var arr = [];

			members.forEach(m => {
				var o = {
					VSTRANA: m.VSTRANA,
					short: m.ZKRATKA,
					color: colorByItem(m, this.data),
					logo: logoByItem(m, this.data)
				};

				arr.push(o);
			});
			
			return arr;
		},
		createList: function () {
			var arr = [];

			this.csu.OBEC.VYSLEDEK.VOLEBNI_STRANA.forEach(party => {

				var item = this.data.list[0].$strany.find(x => x.POR_STR_HL === party.$attributes.POR_STR_HLAS_LIST);
				var cis = this.data.cis.strany.find(x => x.VSTRANA === item.VSTRANA);

				var o = {
					KSTRANA: party.$attributes.POR_STR_HLAS_LIST,
					OBVOD: 1,
					OSTRANA: item.OSTRANA,
					VSTRANA: item.VSTRANA,
					coal: cis.$coalition ? this.createCoalition(cis.$coalition) : null,
					color: colorByItem(item, this.data),
					graph: 0,
					id: item.id,
					label: item.NAZEV,
					link: '/volby/komunalni-volby/' + this.data.list[0].id + '/strana/' + item.id,
					logo: logoByItem(item, this.data),
					mandates: party.$attributes.ZASTUPITELE_POCET,
					list: [],
					passed: party.$attributes.ZASTUPITELE_POCET > 0,
					pct: party.$attributes.HLASY_PROC,
					program: [],
					short: item.NAZEV,
					votes: party.$attributes.HLASY
				}

				if (party.ZASTUPITEL) {
					party.ZASTUPITEL.forEach(zast => {
						o.list.push({
							display: zast.$attributes.JMENO + ' ' + zast.$attributes.PRIJMENI,
							reg: zast.$attributes.PORADOVE_CISLO,
							votes: zast.$attributes.HLASY
						});
					});
				}

				arr.push(o);
			})

			arr.sort((a, b) => b.pct - a.pct);

			this.list = arr.length > 0 ? arr : null;
		}
	},
	mounted: function () {
		this.loadCSU();
	}
};
