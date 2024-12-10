import ReportForm from '@/components/report-form/do.vue';
import EngagementThanks from '@/components/engagement/thanks/do.vue';

export default {
	name: 'main-footer',
	components: {ReportForm, EngagementThanks},
	data: function () {
		return {
			list: {
				tw: "https://www.twitter.com/programydovoleb",
				ig: "https://www.instagram.com/programydovoleb",
				threads: "https://www.threads.net/@programydovoleb",
				tiktok: "https://www.tiktok.com/@programydovoleb",
				fb: "https://www.facebook.com/programydovoleb",
				reddit: "https://www.reddit.com/r/volby/",
				bsky: "https://bsky.app/profile/programydovoleb.cz",
				mastodon: "https://cztwitter.cz/@programydovoleb",
				// linkedin: "https://www.linkedin.com/company/programydovoleb"
			}
		}
	}
};
