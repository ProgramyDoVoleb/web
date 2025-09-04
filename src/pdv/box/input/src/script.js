export default {
	name: 'BoxLabel',
	props: ['color', 'background', 'full', 'css'],
	computed: {
		style: function () {
			var list = {};

			if (this.color) list.color = this.color;
			if (this.background) list.background = this.background;

			if (this.css) {
				var x = this.css.split(',');

				x.forEach(y => {
					var z = y.split(":");
					list[z[0].trim()] = z[1].trim();
				});

				return list;
			}

			return list;
		}
	}
};
