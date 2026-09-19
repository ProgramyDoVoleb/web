import {ga} from '@/pdv/analytics';
import { useCore, cdn, today } from '@/stores/core';
import { slide } from '@/pdv/helpers';
import PromoBlock from '@/components/cta/promo-block/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';
import EngagementSupport from '@/components/engagement/support/do.vue';

var simpleshop = 'https://form.simpleshop.cz/';
var imgcdn = 'https://static.programydovoleb.cz/img/merch/';

export default {
	name: 'layout-about-fundraising',
	data: function () {
		return {
			cdn,
			prints: [
				{name: 'ANO, 2026', price: 199, src: imgcdn + '26_ANO_nahled.jpg', link: simpleshop + 'w0bgB'},
				{name: 'KDU-ČSL, 2026', price: 199, src: imgcdn + '26_KDUCSL_nahled.jpg', link: simpleshop + 'WrmN0'},
				{name: 'KSČM, 2026', price: 199, src: imgcdn + '26_KSCM_nahled.jpg', link: simpleshop + 'qGQQq'},
				{name: 'OD, 2026', price: 199, src: imgcdn + '26_ODS_nahled.jpg', link: simpleshop + 'xKGmR'},
				{name: 'Piráti, 2026', price: 199, src: imgcdn + '26_Pirati_nahled.jpg', link: simpleshop + 'ODoBN'},
				{name: 'SOCDEM, 2026', price: 199, src: imgcdn + '26_SOCDEM_nahled.jpg', link: simpleshop + '5QNN9'},
				{name: 'SPD, 2026', price: 199, src: imgcdn + '26_SPD_nahled.jpg', link: simpleshop + 'Wrmm0'},
				{name: 'Starostové, 2026', price: 199, src: imgcdn + '26_STAN_nahled.jpg', link: simpleshop + 'a0JR2'},
				{name: 'TOP 09, 2026', price: 199, src: imgcdn + '26_TOP09_nahled.jpg', link: simpleshop + 'QNBB6'},
				{name: 'Zelení, 2026', price: 199, src: imgcdn + '26_Zeleni_nahled.jpg', link: simpleshop + 'jDxx3'},
				{name: 'Klidně takhle', price: 99, src: imgcdn + '26_klidnetakhle.jpg', link: simpleshop + 'Pr0e0'},
				{name: 'Pana-co?', price: 99, src: imgcdn + '26_panaco.jpg', link: simpleshop + 'pPy0o'},
				{name: 'Velkej může být jen jeden', price: 99, src: imgcdn + '26_velkej.jpg', link: simpleshop + '4znjE'},
			]
		}
	},
	components: {
		PromoBlock,
		CtaSupport,
		EngagementSupport
	},
  mounted: function () {
    window.scrollTo(0, 1);
    ga("Podpořte Programy do voleb");
	setTimeout(() => {
					if (location.hash && location.hash != '') {
						var el = document.querySelector("[name=" + location.hash.split('#')[1] + "]");
						if (el) el.scrollIntoView({behavior: "smooth", block: "start"});
					}
				}, 500);
  },
  methods: {
	slide
  }
};
