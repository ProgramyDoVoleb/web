export default {
	name: 'Quote',
	props: ['color', 'size', 'source', 'date'],
	mounted: function () {
		setTimeout(() => {
			if (this.$el.innerText.length > 0) {
				this.$el.classList.add('p-quote---long');
			}
		}, 10);
	}
};
