import { createApp } from 'vue'
// import the root component App from a single-file component.
import App from '@/App.vue'

const app = createApp(App)

import Page from './page-parts/page/do.vue';
import PageHeader from './page-parts/header/do.vue';
import PageFooter from './page-parts/footer/do.vue';
import PageMain from './page-parts/main/do.vue';

import LayoutDivided from './page-layouts/divided/do.vue';
import LayoutSimple from './page-layouts/simple/do.vue';

import Anchors from './anchors/do.vue';
import Block from './block/do.vue';
import BlockExpandable from './block-expandable/do.vue';
import Headline from './headline/do.vue';
import Image from './image/do.vue';
import Gap from './gap/do.vue';
import Line from './line/do.vue';
import List from './list/do.vue';
import ListLinear from './list-linear/do.vue';
import Columns from './columns/do.vue';
import Area from './area/do.vue';
import Quote from './quote/do.vue';
import Badge from './badge/do.vue';
import Stats from './stats/do.vue';
import Split from './split/do.vue';
import Flex from './flex/do.vue';
import Grid from './grid/do.vue';
import Lang from './lang/do.vue';
import Offset from './offset/do.vue';
// import LineGraph from './line-graph/do.vue';

import './box';

app.component('p-page', Page);
app.component('p-page-header', PageHeader);
app.component('p-page-footer', PageFooter);
app.component('p-page-main', PageMain);

app.component('p-layout-divided', LayoutDivided);
app.component('p-layout-simple', LayoutSimple);

app.component('p-anchors', Anchors);
app.component('p-block', Block);
app.component('p-block-expandable', BlockExpandable);
app.component('p-headline', Headline);
app.component('p-image', Image);
app.component('p-gap', Gap);
app.component('p-line', Line);
app.component('p-list', List);
app.component('p-list-linear', ListLinear);
app.component('p-columns', Columns);
app.component('p-area', Area);
app.component('p-quote', Quote);
app.component('p-badge', Badge);
app.component('p-flex', Flex);
app.component('p-grid', Grid);
app.component('p-stats', Stats);
app.component('p-split', Split);
app.component('p-lang', Lang);
app.component('p-offset', Offset);
// app.component('p-line-graph', LineGraph);
