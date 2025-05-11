import { api } from '@/stores/core'
import { useNotifications } from '@/stores/notifications'
import { isURL, userInput } from '@/pdv/helpers'
import axios from 'axios'
import { ge } from '@/pdv/analytics'

/* eslint-disable */

export default {
	name: 'editable-event',
	props: ['pointer', 'type', 'elections', 'showDate', 'showLabel', 'showSource', 'preLabel', 'preDate', 'preClass'],
	components: {},
	data: function () {
		return {
			title: null,
			description: null,
			date: null,
			time: null,
			location: null,
			source: null,
			sending: false
		}
	},
	computed: {
		valid: function () {
			var valid = true;
			
			if (!this.title || this.title.length < 2) valid = false;
			if (!this.description || this.description.length < 2) valid = false;
			if (!this.date) valid = false;
			if (this.location && this.location.length < 2) valid = false;
			if (this.source && !isURL(this.source)) valid = false;

			return valid;
		}
	},
	methods: {
		send: function () {
			if (this.valid && !this.sending) {

				const notify = useNotifications();
				var note = notify.add('Odesílám událost');

				this.sending = true;

				ge({
					event: 'edit',
					value: 'event'
				});

				axios.post(api + 'suggest/data', {
					
					data: {
						pointer: this.pointer,
						specifics: this.elections,
						type: 'event',
						value: JSON.stringify([userInput(this.title || ''), userInput(this.description || '')]),
						source: userInput(this.source),
						label: JSON.stringify([this.date, this.time, null, null, userInput(this.location || '')]),
						date: null
					}
				}).then(response => {
					this.sending = false;

					if (response.data.code === 200) {
						notify.update(note, 'Událost odeslána ke kontrole', 'green');
						this.another(true);
					} else {
						notify.update(note, response.data.msg, 'red');
					}
				});
			}
		},
		another: function (autoclose) {
			this.sent = false;
			this.date  = null;
			this.time  = null;
			this.title = null;
			this.description = null;
			this.source = null;

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
