import {useData} from '@/stores/data';
import { api } from '@/stores/core'
import { date, url } from '@/pdv/helpers';
import { useEnums } from '@/stores/enums';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import axios from 'axios';

function dia (str) {

	var d = String(str);
	// ('áčďéěíľĺňóřšťúůýžäßöü')
	('cčrřsšzžäßöü ').split('').forEach(char => {
		d = d.split(char).join('_');
	});

	return url(d);
} 

export default {
	name: 'search-person',
	props: ['elections', 'cb', 'link', 'datum', 'area'],
	data: function () {
		return {
			query: null,
			specify: null,
			dia: null,
			raw: null,
			progress: false,
			filter: ['PS', 'KZ', 'SENAT', 'UPCOMING'],
			filterOptions: ['EP', 'KV', 'KZ', 'PREZ', 'SENAT', 'PS'],
			profile: {
				show: false,
				list: [],
				title: null,
				JMENO: null,
				PRIJMENI: null,
				description: null,
				sending: false,
				sent: false
			},

		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		list: function () {

			if (!this.dia) return null;

			var spl = this.dia.split('-');

			var link = 'person/list/' + spl[spl.length - 1] + (this.filter.length > 0 ? ';' + this.filter.join(',') : '');

			// if (this.datum) link += ':' + this.datum;
			// if (this.elections && !this.datum) link += ':' + this.elections;

			var d = this.$store.getters.pdv(link);

			if (d && d.cis.kraje && d.cis.kraje.length > 0) {
				var arr = [];

				d.cis.kraje.forEach(item => {
					if (!arr.find(x => x.KRAJ === item.KRAJ) && String(item.NUTS).length === 5) {
						arr.push(item);
					}
				});

				arr.sort((a, b) => a.NAZEV.localeCompare(b.NAZEV, 'cs'));

				d.cis.kraje = arr;
			} 

			return d;
		},
		results: function () {
			if (!this.list) return null;

			this.progress = false;

			var arr = this.list.cis.volby;
			var hash = url(this.query);
			var hashSpecify = url(this.specify || '');

			// console.log(hashSpecify);

			this.list.list.sort((a, b) => a.JMENO.localeCompare(b.JMENO, 'cs'));
			this.list.list.sort((a, b) => a.PRIJMENI.localeCompare(b.PRIJMENI, 'cs'));

			arr.forEach(el => {
				el.$kandidati = this.list.list.filter(x => x.volby === el.id && url(x.PRIJMENI).split(hash).length > 1 && (!this.specify || url(x.JMENO).split(hashSpecify).length > 1));
			});

			arr.sort((a, b) => (b.datum || '2099-12-31').localeCompare((a.datum || '2099-12-31'), 'cs'));
			
			return arr;
		}
	},
	methods: {
		date,
		colorByItem,
		search: function () {
			if (this.progress) return;

			this.progress = true;
			this.dia = null;

			setTimeout(() => {
				this.dia = dia(this.query.toLowerCase());
			}, 250);
			
		},
		send_profile_suggestion: function () {
			if (this.profile.sending) return;
			this.profile.sending = true;

			axios.post(api + 'profile/add?c=' + (new Date().getTime()), {
				title: this.profile.JMENO + ' ' + this.profile.PRIJMENI,
				hash: url(this.profile.JMENO + ' ' + this.profile.PRIJMENI),
				description: this.profile.description,
				list: this.profile.list,
				JMENO: this.profile.JMENO,
				PRIJMENI: this.profile.PRIJMENI
			}).then(response => {
				this.profile.sending = false;
				this.profile.sent = true;

				setTimeout(() => this.profile.sent = false, 1500);
			});
		},
		toggleUpcoming: function () {
			if (this.filter.find(x => x === 'UPCOMING')) {
				this.filter.splice(this.filter.indexOf('UPCOMING'), 1)
			} else {
				this.filter.push('UPCOMING')	
			}
			console.log(this.filter);
		}
	}
};
