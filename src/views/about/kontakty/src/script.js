import {ga} from '@/pdv/analytics';
import {cdn} from '@/stores/core';
import {truncate, slide} from '@/pdv/helpers';
import ReportForm from '@/components/report-form/do.vue';

export default {
	name: 'layout-about-contacts',
	data: function () {
		return {
			cdn,
			social: [
				// {link: "https://www.twitter.com/programydovoleb", icon: "tw", label: "Twitter / X", sub: "", count: [0,4640]},
				{link: "https://www.instagram.com/programydovoleb", icon: "ig", label: "Instagram", sub: "", count: [5450,1710]},
				{link: "https://www.threads.net/@programydovoleb", icon: "threads", label: "Threads", sub: "", count: [2060,1100]},
				{link: "https://tiktok.com/@programydovoleb", icon: "tiktok", label: "TikTok", sub: "", count: [1430,660]},
				{link: "https://www.facebook.com/programydovoleb", icon: "fb", label: "Facebook", sub: "", count: [850,640]},
				{link: "https://bsky.app/profile/programydovoleb.bsky.social", icon: "bsky", label: "Bluesky", sub: "", count: [1100,500]},
				{link: "https://www.reddit.com/u/programydovoleb/", icon: "reddit", label: "Reddit", sub: "", count: [1630,410]},
				{link: "https://cztwitter.cz/@programydovoleb", icon: "mastodon", label: "Mastodon", sub: "", count: [300,220]},
				{link: "https://www.linkedin.com/company/programydovoleb", icon: "linkedin", label: "LinkedIn", sub: "", count: [50,20]},
				{link: "https://open.spotify.com/show/0t3PQ53sL3JkydArnDCTZZ", icon: "spotify", label: "Spotify", sub: "", count: [14,0]},
				// {link: "https://youtube.com/@programydovoleb", icon: "yt", label: "Youtube", sub: "od července", count: [0,0]},
				// {link: "https://discord.gg/fVUmJ7wXzc", icon: "discord", label: "Discord", sub: "nové", count: [0,]0}
			]
		}
	},
	components: {
		ReportForm
	},
	methods: {
		truncate, slide
	},
  mounted: function () {
    window.scrollTo(0, 1);
    ga("Kontakty");
  }
};
