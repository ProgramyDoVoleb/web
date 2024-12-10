import { cdn, data } from '@/stores/core';

function parseUnits(val) {

	if (typeof val === 'number') val = val + 'rem';

	var value = undefined;
	var unit = 'auto';

	if (val.split('rem').length === 2) {
		value = Number(val.split('rem')[0]);
		unit = 'rem';
	} else if (val.split('em').length === 2) {
		value = Number(val.split('em')[0]);
		unit = 'em';
	} else if (val.split('px').length === 2) {
		value = Number(val.split('px')[0]);
		unit = 'px';
	} else if (val.split('%').length === 2) {
		value = Number(val.split('%')[0]);
		unit = '%';
	}

	return {value, unit};
}

export default {
	name: 'Img',
	props: ['src', 'alt', 'ratio', 'width', 'height', 'rounded', 'border', 'round', 'lazy', 'background', 'reserve', 'missing'],
	data: function () {
		return {
			detectedWidth: 10
		}
	},
	computed: {
		_src: function () {
			var l = this.src;

			if (!l || l === "/static/missing.png") {
				if (!!this.missing) {
					return cdn + 'empty.png'; // https://data.programydovoleb.cz/obecne/strany/loga/missing.png
				} else {
					return cdn + 'missing.png';
				}				
			} else {
				var s = l.split('/');

				if (s[0] === 'obecne') {
					return data + this.src;
				}

				if (s[1] === 'obecne') {
					return data + this.src;
				}

				return this.src;
			}
		},
		_isSVG: function () {
			return this.src && this.src.split('.svg').length === 2;
		},
		_width: function () {
			if (!this.width) {
				return {value: 4, unit: 'rem'};
			} else {
				return parseUnits(this.width);
			}
		},
		_height: function () {
			var height;

			if (this.height) {
				return parseUnits(this.height);
			} else if (this._isSVG) {
				var data = this._width;
				height = data.value * (this.ratio || 1);

				return {value: height, unit: data.unit};
			} else if (this.ratio && this.width === '100%') {
				height = this.detectedWidth * (this.ratio || 1);

				return {value: height, unit: 'px'};
			}

			return {value: 'auto', unit: ''}
		},
		style: function () {
			var s = [];
			s.push('width:' + this._width.value + this._width.unit);
			s.push('height:' + (this._height.value) + this._height.unit);

			if (this.border && typeof this.border != 'boolean') {
				s.push('border-color:' + this.border);
			}

			if (this.background) {
				s.push('background:' + this.background);
			}

			return s.join(';')
		},
		_heightInPX: function () {
			if (this._height.value === 'auto') {
				return 100;
			} else {
				return (this._height.value * 10);
			}
		}
	},
	methods: {
		detectWidth: function () {
			if (this.$el) {
				this.detectedWidth = this.$el.getBoundingClientRect().width / 10;
			}
		}
	},
	mounted: function () {
		this.detectWidth();
		setTimeout(() => this.detectWidth(), 100);
		setTimeout(() => this.detectWidth(), 250);
	}
};
