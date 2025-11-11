import {url} from '@/pdv/helpers';

export default {
	name: 'SubMenu',
	data: function () {
		return {
			list: []
		}
	},
	methods: {
		getAnchors: function () {
			this.list = [];

			var blocks = document.querySelectorAll('.p-block');

			if (blocks.length > 0) {
				blocks.forEach(el => {
					if (el.querySelector('.p-headline---label')) {
						var obj = {
							el,
							label: el.querySelector('.p-headline---label').getAttribute('data-label'),
							level: Number(el.querySelector('.p-headline---component').nodeName.split('H')[1]),
							rect: el.getBoundingClientRect(),
							visible: false
						}

						obj.hash = '#' + url(obj.label);

						this.list.push(obj);
					}
				});
			}

			this.scroll();
		},
		scrollIntoView: function (item, event) {
			// console.log(item);
			if (event) event.preventDefault();
			// item.el.scrollIntoView({behavior: "smooth", block: "center"});
			if (item) {
				window.scrollTo({top: item.el.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 180, behavior: 'smooth'})
				history.pushState(null, null, item.hash);
			}
		},
		scroll: function () {
			// var s = document.documentElement.scrollTop;
			// var h = window.innerHeight / 2;

			this.list.forEach(item => {
				item.rect = item.el.getBoundingClientRect();

				item.above = item.rect.top + item.rect.height < 200;
				item.below = item.rect.top > 250;
				item.visible = item.above === false && item.below === false;
			})
		},
		trigger: function (hash) {
			// console.log(hash);
			this.scrollIntoView(this.list.find(x => x.hash === hash));
		}
	},
	mounted: function () {
		window.addEventListener("resize", () => this.scroll());
		window.addEventListener("scroll", () => this.scroll());

		setInterval(() => this.getAnchors(), 1000);

		if (location.hash) {
			setTimeout(() => {
				var item = this.list.find(x => x.hash === location.hash.split('#')[1]);

				if (item) {
					this.scrollIntoView(item);
				}
			}, 250);
		}
	}
};
