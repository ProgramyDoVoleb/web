import ReportForm from '@/components/report-form/do.vue';
import EngagementThanks from '@/components/engagement/thanks/do.vue';

export default {
	name: 'main-footer',
	components: {ReportForm, EngagementThanks},
	data: function () {
		return {
			list: {
				// email: "mailto:info@programydovoleb.cz",
				ig: "https://www.instagram.com/programydovoleb",
				threads: "https://www.threads.net/@programydovoleb",
				tiktok: "https://www.tiktok.com/@programydovoleb",
				// fb: "https://www.facebook.com/programydovoleb",
				bsky: "https://bsky.app/profile/programydovoleb.cz",
				reddit: "https://www.reddit.com/r/volby/",
				// tw: "https://www.twitter.com/programydovoleb",
				// mastodon: "https://cztwitter.cz/@programydovoleb",
				// linkedin: "https://www.linkedin.com/company/programydovoleb",
				// yt: "https://youtube.com/@programydovoleb",
				// discord: "https://discord.gg/fVUmJ7wXzc",
				// rss: "https://programydovoleb.cz/rss",
				// whatsapp: "https://chat.whatsapp.com/HsQIv3iE6Up3Lqnj52ZAlX",
				// signal: "https://signal.me/#eu/xlLftS8PndqPElvvhbXV6qGoXhyUw4DfPTg7A0U62_yrnWDQpJ5K0pzz6gAw-ue7"
			}
		}
	}
};
