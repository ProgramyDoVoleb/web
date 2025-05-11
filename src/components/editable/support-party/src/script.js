import { api } from '@/stores/core'
import { useNotifications } from '@/stores/notifications'
import { isURL, userInput } from '@/pdv/helpers'
import SearchParty from '@/components/search-party/do.vue';
import axios from 'axios'
import { ge } from '@/pdv/analytics'

/* eslint-disable */

export default {
	name: 'editable-support',
	props: ['pointer', 'elections'],
	components: {
		SearchParty
	},
	data: function () {
		return {
			datum: null,
			source: null,
			label: null,
			val: null,
			name: null,
			contact: null,
			sending: false,
			type: 'support'
		}
	},
	computed: {
		valid: function () {
			var valid = true;
			
			if (!this.val || !this.source || !isURL(this.source)) valid = false;

			return valid;
		},
	},
	methods: {
		selectParty: function (item) {
			this.label = item.ZKRATKA;
			this.val = item.VSTRANA;
		},
		send: function () {
			if (this.valid && !this.sending) {

				const notify = useNotifications();
				var note = notify.add('Odesílám návrh na doplnění');

				this.sending = true;

				ge({
					event: 'edit',
					value: this.type
				});

				axios.post(api + 'suggest/data', {
					
					data: {
						pointer: this.pointer,
						specifics: this.elections,
						type: this.type,
						value: userInput(this.val),
						source: userInput(this.url),
						label: userInput(this.label),
						date: this.datum
					}
				}).then(response => {
					this.sending = false;

					if (response.data.code === 200) {
						notify.update(note, 'Návrh odeslán ke kontrole, díky', 'green');
						this.another(true);
					} else {
						notify.update(note, response.data.msg, 'red');
					}
				});
			}
		},
		another: function (autoclose) {
			this.sent = false;
			this.datum  = this.preDate || null;
			this.source = null;
			this.label = this.preLabel || null;
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
	}
};
