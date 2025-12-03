import axios from "axios";
import {url} from "@/pdv/helpers";
import { useNotifications } from '@/stores/notifications'

export default {
	name: 'image-upload',
	props: ['pointer', 'width', 'height', 'placeholder'],
	data: function () {
		return {
			e: null,
			src: null,
			srcData: null,
			uploading: false,
			name: null,
			person: false,
			alert: null,
			notify: useNotifications(),
			note: null
		}
	},
	components: {
	},
	computed: {},
	methods: {
		ev: function (msg, color) {
			var note = useNotifications();
			this.note.add(msg, color || 'green');
			// this.e = msg;

			// setTimeout(() => this.e = null, 2500);
		},
		uploadFile: function () {
			axios.post("https://api.programydovoleb.cz/admin/file/upload", {
				data: this.srcData,
				pointer: this.pointer,
				name: url(this.name),
				ext: this.name.split('.').pop()
			}).then(response => {
				if (response.data.code === 200) {
					this.src = response.data.src;
					this.$emit('update', {link: this.src});

					this.notify.update(this.note, 'Nahráno', 'green');

					setTimeout(() => this.alert = null, 2500);
				} else {

					this.notify.update(this.note, 'Chyba při nahrávání', 'red');
				}

				this.uploading = false;
			})
		},
		upload: function () {
			if (this.uploading === true) return;
			this.uploading = true;

			// from an input element

			var filesToUpload = this.$refs['myInput'].files;
			var file = filesToUpload[0];

			var img = document.createElement("img");
			var reader = new FileReader();

			reader.readAsDataURL(file);

			this.note = this.notify.add('Načítání');

			setTimeout(() => {

				img.src = reader.result;

				var canvas = this.$refs['myCanvas'];

				var ctx = canvas.getContext("2d", {alpha: false});
				ctx.fillStyle = "blue";
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				// console.log(canvas.width, canvas.height);

				ctx.drawImage(img, 0, 0);

				var dataurl;

				this.notify.update(this.note, 'Příprava aplikace');

				setTimeout(() => {

					this.notify.update(this.note, 'Kontrola velikosti');

					var MAX_WIDTH = this.width || 300;
					var MAX_HEIGHT = this.height || 400;
					var width = img.width;
					var height = img.height;

					if (width > height) {
						if (width > MAX_WIDTH) {
							height *= MAX_WIDTH / width;
							width = MAX_WIDTH;
						}
					} else {
						if (height > MAX_HEIGHT) {
							width *= MAX_HEIGHT / height;
							height = MAX_HEIGHT;
						}
					}
					canvas.width = width;
					canvas.height = height;

					ctx = canvas.getContext("2d");
					ctx.fillStyle = "#FFFFFF";
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(img, 0, 0, width, height);
				}, 500);

				setTimeout(() => {

					if (file.name.split('.').pop() === 'png') {
						dataurl = canvas.toDataURL("image/png", .8);
					} else {
						dataurl = canvas.toDataURL("image/jpeg", .8);
					}					

					this.name = file.name;

					this.notify.update(this.note, 'Příprava k odeslání');
				}, 1000);

				setTimeout(() => {
					if (dataurl.length > 10) {

						this.notify.update(this.note, 'Odeslání na server');

						this.srcData = dataurl;
						this.uploading = true;
						this.uploadFile();
					}
				}, 2000);
			}, 1000);
		}
	},
	mounted: function () {
	},
};
