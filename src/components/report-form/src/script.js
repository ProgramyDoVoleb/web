import axios from 'axios';
import { api } from '@/stores/core'

/* eslint-disable */

export default {
	name: 'report-form',
	props: ['part', 'hint', 'compact', 'hash', 'noLink'],
	components: {},
	data: function () {
		return {
			url: '',
			note: '',
			name: '',
			contact: '',
			sent: false,
			sending: false,
			response: ''
		}
	},
	computed: {
		valid: function () {
			return this.note.length > 0 || this.url.length > 0;
		}
	},
	methods: {
		send: function () {
			if (this.valid) {
				this.sending = true;

				axios.post(api + 'report/add', {
					p: this.$route.path,
					c: this.part,
					txt: encodeURIComponent(this.note),
					src: encodeURIComponent(this.url),
					author: encodeURIComponent((this.hash ? this.hash + ': ' : '') + this.name),
					contact: encodeURIComponent(this.contact),
					d: window.location.hostname
				}).then(response => {
					this.sending = false;
					this.sent = true;
					this.response = response;
				});
			}
		},
		another: function () {
			this.sent = false;
			this.url  = '';
			this.note = '';
			this.name = '';
		}
	},
	mounted: function () {
		this.note = '';
		this.url  = '';
		this.name = '';
	}
};
