import LogoItem from "@/components/logo-item/do";

export default {
	name: 'results-graph',
	props: ['data'],
	components: {
		LogoItem
	},
	methods: {
		anim: function () {
			this.$el.querySelectorAll('.graph-bar').forEach(el => el.classList.add("zero"));

			setTimeout(() => {
				this.$el.querySelectorAll('.graph-bar').forEach(el => el.classList.remove("zero"));
			}, 100);
		}
	},
	mounted: function () {
		this.anim();
	},
	watch: {
		data: function () {
			this.anim();
		}
	}
};
