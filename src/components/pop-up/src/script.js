/* eslint-disable */

export default {
	name: 'pop-up',
	props: ['preClass'],
	components: {},
	data: function () {
		return {
			show: false,
			left: 0,
			right: 0,
			top: 0
		}
	},
	computed: {
	},
	methods: {
		position: function () {

			var btn = this.$refs.btn;
			var popup = this.$refs.popup;
			var arrow = this.$refs.arrow;
			var w = window.innerWidth;

			var isDown = this.$el.classList.contains('down');

			if (popup) {
				if (this.show === true) {

					var btnBB = btn.getBoundingClientRect();
					var popupBB = popup.getBoundingClientRect();
		
					if (w < 640) {
						popup.style.left = '5vw';
						popup.style.right = '5vw';
					} else {
						popup.style.left = 'auto';
						popup.style.right = 'auto';
						
						if (btnBB.x < 150) {
							popup.style.left = '10px';
							popup.style.width = '300px';
						} else if (btnBB.x + 300 > window.innerWidth - 10) {
							popup.style.right = '10px';
							popup.style.width = '300px';
						} else {
							popup.style.left = (btnBB.x + (btnBB.width / 2) - 150) + 'px';
							popup.style.right = (btnBB.x + (btnBB.width / 2) + 150) + 'px';
						}
					}
					arrow.style.left = (btnBB.x + (btnBB.width / 2)) + 'px';

					if (isDown) {
						arrow.style.top = (btnBB.y + btnBB.height) + 'px';
						popup.style.top = (btnBB.y + btnBB.height + 15) + 'px';
					} else {
						arrow.style.bottom = (window.innerHeight - btnBB.y + 15) + 'px';
						popup.style.bottom = (window.innerHeight - btnBB.y + 15) + 'px';
					}

				} else {
					if (isDown) {
						popup.style.top = '150vh';
						arrow.style.top = '150vh';
					} else {
						popup.style.bottom = '150vh';
						arrow.style.bottom = '150vh';
					}
				}
			}

			// console.log(w, btnBB, popupBB);
		},
		toggleShow: function () {
			this.show = !this.show;
			this.position();
		},
		hide: function () {
			this.show = false;
			this.position();
		}
	},
	mounted: function () {
		this.hide();
		window.addEventListener('resize', () => this.position());
		window.addEventListener('scroll', () => this.position());
	}
};
