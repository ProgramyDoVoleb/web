import { today, yesterday } from '@/stores/core';

export default {
	name: 'homepage-summary',
	props: ['news', 'polls'],
	data: function () {
		return {
			today,
			yesterday
		}
	},
	computed: {
		countToday: function () {
			var count = 0;

			if (this.news && this.polls) {
				count += this.news.list.filter(x => x.datum === today || x.datum === yesterday).length;
				count += this.news.log.filter(x => x.date === today || x.datum === yesterday).length;
				count += this.news.auto.filter(x => x.datum === today || x.datum === yesterday).length;
				count += this.news.comm.filter(x => x.datum === today || x.datum === yesterday).length;
				count += this.news.sys.filter(x => x.datum === today || x.datum === yesterday).length;
				count += this.polls.list.filter(x => x.datum === today || x.datum === yesterday).length;
			}

			return count;
		},
		countLately: function () {
			var count = 0;

			if (this.news && this.polls) {
				count += this.news.list.length;
				count += this.news.log.length;
				count += this.news.auto.length;
				count += this.news.comm.length;
				count += this.news.sys.length;
				count += this.news.media.length;
				count += this.news.media.length;
				count += this.polls.list.length;
			}

			return count;
		}
	}
};
