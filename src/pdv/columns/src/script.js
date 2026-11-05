export default {
	name: 'Columns',
	props: ['cols', 'gap', 'columnWidth'],
	computed: {
		count: function () {
			return this.$refs && this.$refs.column ? this.$refs.column.children.length : null
		}
	}
};
