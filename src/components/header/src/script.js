import { useCore } from '@/stores/core'
import { useEnums } from '@/stores/enums';
import { useNotifications } from '@/stores/notifications'

export default {
	name: 'main-header',
	props: ['logo', 'name', 'tipsPrimator', 'placeholder'],
	data: function () {
		return {
			notifications: useNotifications(),
			core: useCore(),
			pass: null,
			showMenu: false,
			showMenu2: false,
			querySearchTown: null,
			querySearchTownSearching: false,
			enums: useEnums(),
			showMenu3: false,
			menu166: [
				{label: 'Jak volit?', route: '/volby/snemovni-volby/166/jak-volit'},
				{label: 'Průvodce', route: '/volby/snemovni-volby/166/pruvodce'},
				{label: 'Strany', route: '/volby/snemovni-volby/166/strany'},
				{label: 'Kandidáti', route: '/volby/snemovni-volby/166/kandidati'},
				{label: 'Otázky a odpovědi', route: '/volby/snemovni-volby/166/otazky-a-odpovedi'},
				{label: 'Tip na výsledek', route: '/volby/snemovni-volby/166/muj-tip'},
				{label: 'Kalkulačka', route: '/volby/snemovni-volby/166/kalkulacka'},
				{label: 'Kvíz', route: '/volby/snemovni-volby/166/kviz'},
			]
		}
	},
	computed: {
		loaded: function () {
			var test = true;

			// if (!this.$store.state.dynamic.source.find(x => x.source === 'obecne/okresy-flat')) test = false;
			// if (!this.$store.state.dynamic.source.find(x => x.source === 'volby/kom/2022/static/obce-flat')) test = false;
			// if (!this.$store.state.dynamic.pdv.find(x => x.source === 'party/list')) test = false;

			return test;
		},
	},
	watch:{
		$route (){
			this.showMenu = false;
		}
	},
	methods: {
		remove: function (item) {
			this.notifications.update(item, 'Akce zrušena', 'red')
		}
	},
	mounted: function () {
		// if (this.$route.query.dnt) {
		// 	this.$refs.authform.opened = true;
		// }
	}
};
