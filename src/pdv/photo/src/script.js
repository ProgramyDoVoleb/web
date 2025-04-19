import { cdn, data } from '@/stores/core';
import { domain, date, isValidURL } from '@/pdv/helpers';

export default {
	name: 'Photo',
	props: ['data', 'alt'],
	data: function () {
		return {
			detectedWidth: 10,
			_createdDate: null
		}
	},
	computed: {
		_src: function () {
			var l = this.data ? this.data.value : null;

			if (!l || l === "/static/missing.png") {
				return cdn + 'missing.png';				
			}

			l = l.split('http://').join('https://');

			return l;
		},
		_licence: function () {
			return this.data && this.data.label && this.data.label[0] === '[' ? JSON.parse(this.data.label) : (this.data ? this.data.label : null);
		}
	},
	methods: {
		domain, date, isValidURL,
		fetchLastMod: function () {
			fetch(this._src).then(r => {
				this._createdDate = new Date(r.headers.get('Last-Modified')).toISOString();
			})
		}
	},
	mounted: function () {
		this.fetchLastMod();
	}
};
