import axios from 'axios';

/* eslint-disable */

export default {
	name: 'update-form',
	props: ['id', 'hint'],
	components: {},
	data: function () {
		return {
			url: '',
			note: '',
			name: '',
			sent: false,
			sending: false,
			response: ''
		}
	},
	computed: {
		valid: function () {
			return /^(http|https):\/\/[^ "]+$/.test(this.url);
		}
	},
	methods: {
		send: function () {
			if (this.valid) {
				this.sending = true;

				axios.post('https://2021.programydovoleb.cz/lib/app/api.php?action=tip/add', {
					component: {
						component: this.id,
						page: this.$route.fullPath
					},
					tip: {
						source: encodeURIComponent(this.url),
						content: encodeURIComponent(this.note),
						name: encodeURIComponent(this.name)
					}
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
