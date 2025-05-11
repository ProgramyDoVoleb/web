import { api } from '@/stores/core'
import { useNotifications } from '@/stores/notifications'
import { isURL, userInput } from '@/pdv/helpers'
import axios from 'axios'
import { ge } from '@/pdv/analytics'

/* eslint-disable */

export default {
	name: 'editable-suggest',
	props: ['part', 'type', 'placeholder', 'link'],
	components: {},
	data: function () {
		return {
			source: null,
			val: null,
			name: null,
			contact: null,
			sending: false
		}
	},
	computed: {
		valid: function () {
			var valid = true;
			
			if (this.val && this.val.length < 5) valid = false;
			if (this.source && !isURL(this.source)) valid = false;

			return valid;
		}
	},
	methods: {
		send: function () {
			if (this.valid && !this.sending) {

				const notify = useNotifications();
				var note = notify.add('Odesílám');

				this.sending = true;

				ge({
					event: 'edit',
					value: this.type
				});

				axios.post(api + 'report/add', {
					p: this.$route.path,
					c: this.part,
					txt: encodeURIComponent(this.val),
					src: encodeURIComponent(this.source),
					author: encodeURIComponent(this.contact),
					contact: null,
					d: window.location.hostname
				}).then(response => {
					this.sending = false;

					if (response.data.code === 200) {
						notify.update(note, 'Návrh odeslán', 'green');
						this.another(true);
					} else {
						notify.update(note, response.data.msg, 'red');
					}
				});
			}
		},
		another: function (autoclose) {
			this.sent = false;
			this.source = null;
			this.val = null;

			if (autoclose) {
				try {
					this.$parent.hide();
				} catch (e) {
					// doesn't have show variable
				}
			}
		}
	},
	mounted: function () {
		this.another();

		setTimeout(() => this.$refs.first.focus(), 100);
	}
};
