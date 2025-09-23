import PBoxWrapper from "../wrapper/do.vue";

export default {
	name: 'Box',
	props: ['href', 'to', 'bg', 'block', 'click', 'background', 'title', 'target', 'disabled'],
	components: {
		PBoxWrapper
	}
};
