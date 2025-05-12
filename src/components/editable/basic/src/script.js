import { api } from '@/stores/core'
import { useNotifications } from '@/stores/notifications'
import { isURL, userInput } from '@/pdv/helpers'
import axios from 'axios'
import { ge } from '@/pdv/analytics'

/* eslint-disable */

export default {
	name: 'editable-basic',
	props: ['pointer', 'type', 'elections', 'showDate', 'showLabel', 'showSource', 'preLabel', 'preDate', 'preClass'],
	components: {},
	data: function () {
		return {
			datum: null,
			source: null,
			label: null,
			val: null,
			name: null,
			contact: null,
			sending: false
		}
	},
	computed: {
		valid: function () {
			var valid = true;
			
			if (['web', 'wiki', 'social', 'link'].indexOf(this.type) > -1) {
				if (!this.val || !isURL(this.val)) {
					valid = false;
				}
			}

			if (this.type === 'address' && (!this.val || (this.val.length < 5)) && (!this.source || !isURL(this.source))) valid = false;
			if (this.type === 'phone' && ((!this.val || (this.val < 200000000 || this.val > 999999999)) || (!this.source || !isURL(this.source)))) valid = false;
			if (this.type === 'email' && (!this.val || ((this.val.split('@').length === 1 || this.val.split('@')[0].length === 0 || this.val.split('@')[1].length === 0))) && (!this.source || !isURL(this.source))) valid = false;
			if ((this.type === 'pr' || this.type === 'media') && (!this.val || !this.source || (this.val.length < 2 || !isURL(this.source)))) valid = false;
			if (this.type === 'program' && (!this.val || !this.source || !isURL(this.source))) valid = false;
			if (this.type === 'motto' && (!this.val || !this.source || !isURL(this.source))) valid = false;
			if (this.type === 'about' && (!this.val || !this.source || !isURL(this.source))) valid = false;
			if (this.type === 'support' && (!this.val || !this.source || !isURL(this.source))) valid = false;
			if (this.type === 'values' && ((!this.val && !this.label) || !this.source || !isURL(this.source))) valid = false;

			return valid;
		},
		inputType: function () {
			if (['web', 'wiki', 'social', 'link', 'program'].indexOf(this.type) > -1) {
				return 'url';
			}
			if (this.type === 'phone') return 'number';
			if (this.type === 'email') return 'email';
			
			return 'text';
		},
		plcVal: function () {
			if (['web', 'wiki', 'social', 'link'].indexOf(this.type) > -1) {
				return 'Vložte odkaz';
			}
			if (this.type === 'phone') return 'Telefonní číslo bez předvolby';
			if (this.type === 'email') return 'Vložte e-mail';
			if (this.type === 'address') return 'Vložte adresu';
			if (this.type === 'about') return 'Vložte představení';
			if (this.type === 'motto') return 'Vložte motto či slogan';
			if (this.type === 'values') return 'Vložte hodnotu';
			if (this.type === 'note') return 'Vložte poznámku';
			if (this.type === 'program') return 'Název programu';
			if (this.type === 'support') return 'Jméno či název';
			if (this.type === 'pr' || this.type === 'media') return 'Vložte titulek';
		},
		plcLabel: function () {
			if (['web', 'wiki', 'social', 'link'].indexOf(this.type) > -1) {
				return 'Vložte popisek';
			}
			if (this.type === 'values') return 'Delší text (nepovinné)';
			if (this.type === 'note') return 'Delší text (nepovinné)';
			if (['email', 'phone', 'address'].indexOf(this.type) > -1) {
				return 'Popisek (nepovinné)';
			}
		}
	},
	methods: {
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
						value: userInput(String(this.val)),
						source: userInput(this.source),
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

		setTimeout(() => this.$refs.first.focus(), 100);
	}
};
