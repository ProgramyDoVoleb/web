import { createApp } from 'vue'
// import the root component App from a single-file component.
import App from '@/App.vue'

const app = createApp(App)

import Box from './do.vue';
import BoxGap from './gap/do.vue';
import BoxIcon from './icon/do.vue';
import BoxImage from './image/do.vue';
import BoxLabel from './label/do.vue';
import BoxButton from './button/do.vue';
import BoxGroup from './group/do.vue';
import BoxList from './list/do.vue';
import BoxTicker from './ticker/do.vue';
import BoxColor from './color/do.vue';
import BoxGraph from './graph/do.vue';

app.component('p-box', Box);
app.component('p-box-gap', BoxGap);
app.component('p-box-icon', BoxIcon);
app.component('p-box-image', BoxImage);
app.component('p-box-label', BoxLabel);
app.component('p-box-button', BoxButton);
app.component('p-box-group', BoxGroup);
app.component('p-box-list', BoxList);
app.component('p-box-ticker', BoxTicker);
app.component('p-box-color', BoxColor);
app.component('p-box-graph', BoxGraph);
