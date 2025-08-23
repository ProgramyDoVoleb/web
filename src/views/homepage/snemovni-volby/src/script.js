import {useData} from '@/stores/data';
import PartyPreviewLeader from '@/components/party-preview-leader/do.vue';
import PartyPreviewTiny from '@/components/party-preview-tiny/do.vue';
import {url, date, number, truncate, domain, con, sortBy, shuffle} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import PopUp from '@/components/pop-up/do.vue';
import PromoBlock from '@/components/cta/promo-block/do.vue';
import { useEnums } from '@/stores/enums';

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
					link: '/volby/snemovni-volby/166/strana/227',
					activity: 53
				},
				{
					name: 'KDU-ČSL',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/1-kdu-csl.svg',
					txt: 'v koalici',
					label: 'Spolu',
					link: '/volby/snemovni-volby/166/strana/227',
					activity: 1
				},
				{
					name: 'TOP 09',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/721-top09.svg',
					txt: 'v koalici',
					label: 'Spolu',
					link: '/volby/snemovni-volby/166/strana/227',
					activity: 721
				},
				{
					name: 'Zelení',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/5-strana-zelenych-2022.jpg',
					txt: 'podpoří',
					label: 'Piráty',
					link: '/volby/snemovni-volby/166/strana/226',
					activity: 5
				},
				{
					name: 'KSČM',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/47-kscm.svg',
					txt: 'podpoří',
					label: 'Stačilo!',
					link: '/volby/snemovni-volby/166/strana/234',
					activity: 47
				},
				{
					name: 'Svobodní',
					logo: 'https://static.programydovoleb.cz/2024/csu_cvs/1114/714/78872531ed.jpg',
					txt: 'podpoří',
					label: 'SPD',
					link: '/volby/snemovni-volby/166/strana/230',
					activity: 714
				},
				{
					name: 'Trikolora',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/1227-trikolora-2022.jpg',
					txt: 'podpoří',
					label: 'SPD',
					link: '/volby/snemovni-volby/166/strana/230',
					activity: 1227
				},
				{
					name: 'PRO',
					logo: 'https://static.programydovoleb.cz/2024/csu_cvs/0424/1265/11890033c8.jpg',
					txt: 'podpoří',
					label: 'SPD',
					link: '/volby/snemovni-volby/166/strana/230',
					activity: 1265
				},
				{
					name: 'SOCDEM',
					logo: 'https://static.programydovoleb.cz/logo2/FyRGB03XoAMWE7t.jpeg',
					txt: 'podpoří',
					label: 'Stačilo',
					link: '/volby/snemovni-volby/166/strana/234',
					activity: 7
				},
				{
					name: 'Moravané',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/83-moravane.png',
					txt: 'podpoří',
					label: 'Stačilo',
					link: '/volby/snemovni-volby/166/strana/234',
					activity: 83
				},
				{
					name: 'Soukromníci',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/716-sscr-n.jpg',
					txt: 'podpoří',
					label: 'Motoristy',
					link: '/volby/snemovni-volby/166/strana/232',
					activity: 716
				},
				{
					name: 'KOA',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/182-koa.png',
					txt: 'podpoří',
					label: 'Starosty',
					link: '/volby/snemovni-volby/166/strana/231',
					activity: 182
				},
				{
					name: 'Východočeši',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/770-vychodocesi.png',
					txt: 'podpoří',
					label: 'Starosty',
					link: '/volby/snemovni-volby/166/strana/231',
					activity: 770
				},
				{
					name: 'JsmePRO!',
					logo: 'https://data.programydovoleb.cz/obecne/strany/loga/1126-jsme-pro-kraj.png',
					txt: 'podpoří',
					label: 'Starosty',
					link: '/volby/snemovni-volby/166/strana/231',
					activity: 1126
				}
			],
			searchQuery: null
		}
	},
	components: {
	  PartyPreviewLeader, PartyPreviewTiny, PopUp, PromoBlock
	},
	computed: {
		$store: function () {
			return useData()
		},
		election: function () {
			return this.$store.getters.pdv('elections/specific/' + this.elections.id + '/quicklook');
		},
		enums: function () {
			return useEnums()
		},
		searchResults: function () {
			var results = [];

			if (this.election.list[0] && this.searchQuery && this.searchQuery.length > 2) {
				this.election.list[0].$kandidati.filter(x => x.PORCISLO && url(x.JMENO + ' ' + x.PRIJMENI).includes(url(this.searchQuery))).forEach(x => results.push(x));
			}

			return sortBy(sortBy(results, 'JMENO', null, true), 'PRIJMENI', null, true);
		}
	},
	methods: {
		sortBy, shuffle,
		logoByItem, colorByItem,
		sortByPorCislo: function (list) {
			list.sort((a, b) => (a.PORCISLO || 1000) - (b.PORCISLO || 1000));

			return list;
		}
	},
	mounted: function () {
		setTimeout(() => {
			this.width = this.$el.getBoundingClientRect().width;
			window.addEventListener('resize', () => this.width = this.$el.getBoundingClientRect().width);
		}, 500);
	}
};
