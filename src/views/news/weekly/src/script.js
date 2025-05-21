import {date, number, truncate, indicator, untag, domain, sortBy, unique} from "@/pdv/helpers";
import { colorByItem, logoByItem } from '@/components/results/helpers';
import NewsItem from '@/components/news-item/do.vue'
import PollsPreview from '@/components/polls-preview/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';
import CtaSupportShort from '@/components/cta/support-short/do.vue';
import MailchimpSignup from '@/components/mailchimp/do.vue';
import ReportForm from '@/components/report-form/do.vue';
import EventItem from '@/components/event-item/do.vue';
import PopUp from '@/components/pop-up/do.vue';
import logtypes from '@/stores/enums/log';
import {useData} from '@/stores/data';
import {today, cdn} from '@/stores/core';
import {ga} from '@/pdv/analytics';

export default {
	name: 'NewsWeekly',
	data: function () {
		return {
			datum: today,
			cdn,
			logtypes,
			today,
			medialist: [
				{name: 'CNN Prima News', source: 'https://cnn.iprima.cz/domaci'},
				{name: 'iDnes', source: 'https://www.idnes.cz/zpravy/domaci'},
				{name: 'Novinky', source: 'https://www.novinky.cz/sekce/domaci-13'},
				{name: 'Česká televize', source: 'https://ct24.ceskatelevize.cz/rubrika/domaci-5'},
				{name: 'Blesk', source: 'https://www.blesk.cz/zpravy/politika'},
				{name: 'Aktuálně', source: 'https://zpravy.aktualne.cz/domaci/'},
				{name: 'iRozhlas', source: 'https://www.irozhlas.cz/zpravy-domov'},
				{name: 'Deník', source: 'https://www.denik.cz/z_domova/'},
				{name: 'Deník N', source: 'https://denikn.cz/tag/snemovni-volby/'},
				{name: 'Parlamentní listy', source: 'https://www.parlamentnilisty.cz/'},
				{name: 'Deník Referendum', source: 'https://denikreferendum.cz/rubrika/domov'},
				{name: 'ČTK', source: 'https://www.ceskenoviny.cz/cr/'},
				{name: 'Praha IN', source: 'https://www.prahain.cz/'},
				{name: 'Seznam Zprávy', source: 'https://www.seznamzpravy.cz/sekce/volby-do-poslanecke-snemovny-242'},
				{name: 'Forum 24', source: 'https://www.forum24.cz/rubrika/domaci'},
				{name: 'INFO', source: 'https://www.info.cz/'},
				{name: 'TN.cz', source: 'https://tn.nova.cz/zpravodajstvi/tema/6790-domaci'},
				{name: 'Echo24', source: 'https://www.echo24.cz/'},
				{name: 'DVTV', source: 'https://www.dvtv.cz/screens/home'},
				{name: 'Hospodářky', source: 'https://hn.cz/'},
				{name: 'E15', source: 'https://www.e15.cz/'},
				{name: 'Respekt', source: 'https://www.respekt.cz/'},
				{name: 'Radiožurnál', source: 'https://radiozurnal.rozhlas.cz/'}
			],
			social: [
				{link: "https://www.instagram.com/programydovoleb", icon: "ig", label: "Instagram", sub: "", count: 1710},
				{link: "https://www.threads.net/@programydovoleb", icon: "threads", label: "Threads", sub: "", count: 1100},
				{link: "https://tiktok.com/@programydovoleb", icon: "tiktok", label: "TikTok", sub: "", count: 660},
				{link: "https://www.facebook.com/programydovoleb", icon: "fb", label: "Facebook", sub: "", count: 640},
				{link: "https://bsky.app/profile/programydovoleb.bsky.social", icon: "bsky", label: "Bluesky", sub: "", count: 500},
				{link: "https://www.reddit.com/u/programydovoleb/", icon: "reddit", label: "Reddit", sub: "", count: 410},
				{link: "https://cztwitter.cz/@programydovoleb", icon: "mastodon", label: "Mastodon", sub: "", count: 220}
			]
		}
	},
	components: {
		NewsItem,
		PollsPreview,
		CtaSupport, CtaSupportShort,
		MailchimpSignup,
		ReportForm,
		EventItem,
		PopUp
	},
	methods: {
		date, number, truncate, indicator, untag, domain, sortBy, unique,
		colorByItem, logoByItem,
		sortByPrijmeni: function (list, desc) {
			var arr = [];
			list.forEach(x => arr.push(x));

			arr.sort((a, b) => (a.node['PRIJMENI'] || '').localeCompare((b.node['PRIJMENI'] || ''), 'cs'));

			return arr;
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		news: function () {
			return this.$store.getters.pdv('news/weekly/' + this.datum)
		}
	},
	mounted: function () {
		if (this.$route.query.datum) {
			this.datum = this.$route.query.datum;
		}
		ga("Novinky");
		window.scrollTo(0, 1);

		this.medialist = sortBy(this.medialist, 'name', null, true);
	}
};
