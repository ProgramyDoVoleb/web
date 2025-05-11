import { api } from '@/stores/core'
import { useNotifications } from '@/stores/notifications'
import { isURL, userInput } from '@/pdv/helpers'
import axios from 'axios'
import { ge } from '@/pdv/analytics'
import ImageUpload from "@/components/image-upload/do.vue"

/* eslint-disable */

export default {
	name: 'editable-image',
	props: ['pointer', 'type', 'elections'],
	components: {
		ImageUpload
	},
	data: function () {
		return {
			img: null,
			author: null,
			title: null,
			source: null,
			sending: false
		}
	},
	computed: {
		valid: function () {
			var valid = true;
			
			if (!this.img) valid = false;
			if (this.author && this.author.length < 2) valid = false;
			if (!this.title || this.title.length < 2) valid = false;
			if (this.source && !isURL(this.source)) valid = false;

			return valid;
		}
	},
	methods: {
		update: function (src) {
			this.img = src.link;

			setTimeout(() => this.$refs.first.focus(), 100);
		},
		send: function () {
			if (this.valid && !this.sending) {

				const notify = useNotifications();
				var note = notify.add('Odesílám obrázek');

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
						value: this.img,
						source: userInput(this.source),
						label: this.title,
						date: null,
						author: userInput(this.author)
					}
				}).then(response => {
					this.sending = false;

					if (response.data.code === 200) {
						notify.update(note, 'Obrázek odeslán ke kontrole', 'green');
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
