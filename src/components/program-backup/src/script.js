import axios from 'axios';
import { domain, date } from '@/pdv/helpers'; 

export default {
	name: 'program-backup',
	props: ['item'],
	data: function () {
		return {
			show: 'full',
			types: {
				full: null,
				sanitized: null
			}
		}
	},
  mounted: function () {
	axios.get(this.item.source).then(response => {
		this.types.full = response.data;

		var data = '<div' + response.data.split('<body')[1].split('</body>')[0] + '</div>';
			data = data.split('\n').join('');
			data = data.split('v-if').join('v-iff');
			data = data.split('src').join('data-src');
			data = data.split('<template').join('<div');
			data = data.split('</template').join('</div');

			data = data.split('<script').join('<template');
			data = data.split('</script').join('</template');
			data = data.split('<style').join('<template');
			data = data.split('</style').join('</template');
			data = data.split('<svg').join('<template');
			data = data.split('</svg').join('</template');
			data = data.split('<img').join('<br');
			data = data.split('<input').join('<br');
			data = data.split('<button').join('<br');
			data = data.split('style').join('stylee');

		this.types.sanitized = data;

		this.$nextTick(() => {
			this.display('full');
		});
		
	});
  },
  methods: {
	domain, date,
	display: function (type) {
		// this.$nextTick(() => {
			this.show = type;

			var wrapper = this.$el.querySelector('.iframe-program-backup');
			wrapper.innerHTML= "<iframe id='test' width='100%' height='100%'></iframe>";

			this.$nextTick(() => {
				var frame = this.$el.querySelector('iframe');
				var frameDoc = frame.contentDocument || frame.contentWindow.document;
				frameDoc.write(this.types[this.show]);
			});
	}
  }
};
