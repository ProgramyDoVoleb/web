import {useData} from '@/stores/data';
import PartyPreviewLeader from '@/components/party-preview-leader/do.vue';
import PartyPreviewTiny from '@/components/party-preview-tiny/do.vue';
import {url, date, number, truncate, domain, con, sortBy, shuffle} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/components/results/helpers';

export default {
	name: 'HomepagePS',
	props: ['elections', 'answers'],
	data: function () {
		return {
			width: window.innerWidth,
			list: [
				{
					name: 'ODS',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/53-ods.svg',
					txt: 'v koalici',
					label: 'Spolu',
					link: '/volby/snemovni-volby/166/strana/227'
				},
				{
					name: 'KDU-ČSL',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/1-kdu-csl.svg',
					txt: 'v koalici',
					label: 'Spolu',
					link: '/volby/snemovni-volby/166/strana/227'
				},
				{
					name: 'TOP 09',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/721-top09.svg',
					txt: 'v koalici',
					label: 'Spolu',
					link: '/volby/snemovni-volby/166/strana/227'
				},
				{
					name: 'Zelení',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/5-strana-zelenych-2022.jpg',
					txt: 'podpoří',
					label: 'Piráty',
					link: '/volby/snemovni-volby/166/strana/226'
				},
				{
					name: 'KSČM',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/47-kscm.svg',
					txt: 'podpoří',
					label: 'Stačilo!',
					link: '/volby/snemovni-volby/166/strana/234'
				},
				{
					name: 'Svobodní',
					logo: 'https://static.programydovoleb.cz/2024/csu_cvs/1114/714/78872531ed.jpg',
					txt: 'podpoří',
					label: 'SPD',
					link: '/volby/snemovni-volby/166/strana/230'
				},
				{
					name: 'Trikolora',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/1227-trikolora-2022.jpg',
					txt: 'podpoří',
					label: 'SPD',
					link: '/volby/snemovni-volby/166/strana/230'
				},
				{
					name: 'PRO',
					logo: 'https://static.programydovoleb.cz/2024/csu_cvs/0424/1265/11890033c8.jpg',
					txt: 'podpoří',
					label: 'SPD',
					link: '/volby/snemovni-volby/166/strana/230'
				}
			]
		}
	},
	components: {
	  PartyPreviewLeader, PartyPreviewTiny
	},
	computed: {
		$store: function () {
			return useData()
		},
		election: function () {
			return this.$store.getters.pdv('elections/fetch/' + this.elections.id);
		}
	},
	methods: {
		sortBy, shuffle,
		logoByItem, colorByItem,
		sortByPorCislo: function (list) {
			list.sort((a, b) => (a.PORCISLO || 1000) - (b.PORCISLO || 1000));

			return list;
		}
	}
};
