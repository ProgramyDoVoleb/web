export default {
	name: 'program-block',
	props: ['parts', 'depth', 'color'],
	computed: {
		data: function () {
			var list = [];

			var parts = this.parts;

			if (parts) {

				if (typeof parts === 'string' || !parts.length) {
					parts = [this.parts];
				}

				if (parts.source) {
					list.push({
						type: 'source',
						content: parts.source
					});
				}

				parts.forEach(item => {
					if (typeof item === 'string') {
						list.push({
							type: 'copy',
							content: item
						});
					} else if (typeof item === 'object' && item.length) {
						list.push({
							type: 'list',
							parts: item
						})
					} else if (typeof item === 'object' && !item.length && !item.type) {

						var key = 'block';

						if (item.headline) {
							key = 'headline';

							list.push({
								type: key,
								content: item[key],
								level: this.depth
							})
						} 

						if (item.copy) {
							key = 'copy';
							
							list.push({
								type: key,
								content: item[key]
							})
						} 

						if (item.list) {
							key = 'list';
							
							list.push({
								type: key,
								content: item[key]
							})
						} 

						if (item.ol) {
							key = 'ol';
							
							list.push({
								type: key,
								content: item[key]
							})
						} 

						if (item.quote) {
							key = 'quote';
							
							list.push({
								type: key,
								content: item[key]
							})
						} 

						if (item.parts) {
							key = 'parts';
							
							list.push({
								type: key,
								parts: item.parts,
								depth: this.depth + 1
							})
						}

					} else {
						list.push(item);
					}
				});
			}

			return list;
		}
	}
};
