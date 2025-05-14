import EditableBasic from '@/components/editable/basic/do.vue';
import EditableImage from '@/components/editable/image/do.vue';
import EditableSuggest from '@/components/editable/suggest/do.vue';
import PopUp from '@/components/pop-up/do.vue';

export default {
	name: 'current-election-highlight-block',
	components: {
		EditableBasic, EditableSuggest, EditableImage, PopUp
	},
	data: function () {
		return {
			mobile: false
		}
	},
	mounted: function () {
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
			// true for mobile device
			this.mobile = true;
		  }else{
			// false for not mobile device
			this.mobile = false;
		  }
	}
};