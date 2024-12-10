import axios from 'axios';
import {stripURLintoDomain} from '@/common/helpers';

export default {
	name: 'person-photo',
	props: ['data', 'ratio', 'hash', 'width', 'phash', 'admin'],
	data: function () {
		return {
			tick: 1
		}
	},
	computed: {
		src: function () {
			var link;

			if (this.tick && this.data.photo && this.data.photo.url) {
				link = this.data.photo.url;
			} else {
				link = this.$store.state.static + 'missing.png';
			}

			link = link.split('http://').join('https://');

			return link;
		},
		token: function () {
			return this.$route.path.split('/').pop();
		}
	},
	methods: {
		stripURLintoDomain,
		updatePhoto: function (file) {

			if (this.admin) {
				axios.post(this.$store.state.api + 'admin/photo-update', {
					hash: this.hash,
					phash: this.phash,
					url: this.$store.state.server + file.link,
					token: this.token
				}).then(() => {
					this.$refs.myModal.opened = false;
					this.data.photo = {url: this.$store.state.server + file.link};
					this.tick++;
				});
			} else {
				axios.post(this.$store.state.api + 'tip/photoUpdate', {
					hash: this.hash,
					phash: this.phash,
					url: this.$store.state.server + file.link,
					pass: this.$store.state.auth
				}).then(() => {
					this.$refs.myModal.opened = false;
					this.data.photo = {url: this.$store.state.server + file.link};
					this.tick++;
				});
			}
		}
	}
};
