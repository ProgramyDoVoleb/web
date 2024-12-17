import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './app/do.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// PDV Library

import Page from './pdv/page-parts/page/do.vue';
import PageHeader from './pdv/page-parts/header/do.vue';
import PageFooter from './pdv/page-parts/footer/do.vue';
import PageMain from './pdv/page-parts/main/do.vue';

import LayoutDivided from './pdv/page-layouts/divided/do.vue';
import LayoutSimple from './pdv/page-layouts/simple/do.vue';

import Anchors from './pdv/anchors/do.vue';
import Block from './pdv/block/do.vue';
import BlockExpandable from './pdv/block-expandable/do.vue';
import Headline from './pdv/headline/do.vue';
import Image from './pdv/image/do.vue';
import Photo from './pdv/photo/do.vue';
// import Gap from './pdv/gap/do.vue';
// import Line from './pdv/line/do.vue';
import List from './pdv/list/do.vue';
import ListLinear from './pdv/list-linear/do.vue';
import Columns from './pdv/columns/do.vue';
import Area from './pdv/area/do.vue';
import Quote from './pdv/quote/do.vue';
import Badge from './pdv/badge/do.vue';
import Stats from './pdv/stats/do.vue';
import Split from './pdv/split/do.vue';
// import Flex from './pdv/flex/do.vue';
import Grid from './pdv/grid/do.vue';
import Lang from './pdv/lang/do.vue';
// import Offset from './pdv/offset/do.vue';
import LineGraph from './pdv/line-graph/do.vue';

import TruncatedText from './pdv/truncated/do.vue';
import CompareValues from './pdv/compare/do.vue';
import ShareBlock from './pdv/share/do.vue';
import ModalElement from './pdv/modal/do.vue';
import OutboundLink from './pdv/link/do.vue';
import Loader from './pdv/loader/do.vue';
import LogoItem from './pdv/logo/do.vue';
import CollapsibleElement from './pdv/collapsible/do.vue';
import IconElement from './pdv/icon/do.vue';
import LabelWithDot from './pdv/label/do.vue';

app.component('p-page', Page);
app.component('p-page-header', PageHeader);
app.component('p-page-footer', PageFooter);
app.component('p-page-main', PageMain);

app.component('p-layout-divided', LayoutDivided);
app.component('p-layout-simple', LayoutSimple);

app.component('p-compare', CompareValues);
app.component('p-anchors', Anchors);
app.component('p-block', Block);
app.component('p-block-expandable', BlockExpandable);
app.component('p-headline', Headline);
app.component('p-image', Image);
app.component('p-photo', Photo);
// app.component('p-gap', Gap);
// app.component('p-line', Line);
app.component('p-list', List);
app.component('p-list-linear', ListLinear);
app.component('p-columns', Columns);
app.component('p-area', Area);
app.component('p-quote', Quote);
app.component('p-badge', Badge);
// app.component('p-flex', Flex);
app.component('p-grid', Grid);
app.component('p-stats', Stats);
app.component('p-split', Split);
app.component('p-lang', Lang);
// app.component('p-offset', Offset);
app.component('p-line-graph', LineGraph);
app.component('p-modal', ModalElement);
app.component('p-link', OutboundLink);
app.component('p-share', ShareBlock);
app.component('p-truncated', TruncatedText);
app.component('p-loader', Loader);
app.component('p-logo', LogoItem);
app.component('p-collapsible', CollapsibleElement);
app.component('p-icon', IconElement);
app.component('p-label', LabelWithDot);

// PDV BOX library

import Box from './pdv/box/do.vue';
import BoxGap from './pdv/box/gap/do.vue';
import BoxIcon from './pdv/box/icon/do.vue';
import BoxImage from './pdv/box/image/do.vue';
import BoxLabel from './pdv/box/label/do.vue';
import BoxButton from './pdv/box/button/do.vue';
import BoxGroup from './pdv/box/group/do.vue';
import BoxList from './pdv/box/list/do.vue';
import BoxTicker from './pdv/box/ticker/do.vue';
import BoxColor from './pdv/box/color/do.vue';
import BoxGraph from './pdv/box/graph/do.vue';

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

// import { LMap, LTileLayer, LMarker, LPopup, LGeoJson } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

// app.component('l-map', LMap);
// app.component('l-tile-layer', LTileLayer);
// app.component('l-marker', LMarker);
// app.component('l-geo-json', LGeoJson);
// app.component('l-popup', LPopup);

import VueApexCharts from "vue3-apexcharts";

app.use(VueApexCharts);

app.mount('#app')
