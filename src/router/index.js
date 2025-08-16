import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/homepage/do.vue'
import PointerView from '../views/pointer/do.vue'
import PointerCandidatesView from '../views/pointer/candidates/do.vue'
import PointerProgramView from '../views/pointer/program/do.vue'
import PointerPriorityView from '../views/pointer/priority/do.vue'
import PointerQAView from '../views/pointer/qa/do.vue'
import VolbySenatDetail from '../views/volby/detail/senatni-volby/obvod/do.vue'
import VolbyDetail from '../views/volby/detail/do.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/volby',
      name: 'volby',
      component: () => import('../views/volby/do.vue')
    },
    {
      path: '/pruvodce',
      name: 'guide-actual',
      redirect: '/pruvodce/snemovni-volby-2025',
    },
    {
      path: '/pruvodce/snemovni-volby-2025',
      name: 'guide-ps-25',
      component: () => import('../views/aktivity/guide/25-snemovna/do.vue')
    },
    {
      path: '/pruvodce/senatni-volby-2025-leden',
      name: 'guide-senat-2025-leden',
      component: () => import('../views/aktivity/guide/25-senat-leden/do.vue')
    },
    {
      path: '/pruvodce/krajske-a-senatni-volby-2024',
      name: 'guide-kz-senat-2024',
      component: () => import('../views/aktivity/guide/24-kz-senat/do.vue')
    },
    {
      path: '/pro-kandidaty/otazky/krajske-a-senatni-volby-2024',
      name: 'pro-question-kz24',
      component: () => import('../views/pro-kandidaty/otazky/kz-2024/do.vue')
    },
    {
      path: '/volby/:hash',
      name: 'volby-typ',
      component: () => import('../views/volby/typ/do.vue'),
      props: true
    },
    {
      path: '/volby/:hash/:id',
      name: 'volby-detail',
      component: VolbyDetail, // () => import('../views/volby/detail/do.vue'),
      props: true
    },
    {
      path: '/volby/snemovni-volby/:id/kraj/:region',
      name: 'volby-detail-snemovni-kraj',
      component: () => import('../views/volby/detail/snemovni-volby/region/do.vue'),
      props: true
    },
    {
      path: '/volby/krajske-volby/:id/kraj/:region',
      name: 'volby-detail-krajske-kraj',
      component: () => import('../views/volby/detail/krajske-volby/region/do.vue'),
      props: true
    },
    {
      path: '/volby/krajske-volby/:id/aktivita/:party',
      name: 'volby-krajske-aktivity',
      component: () => import('../views/volby/detail/krajske-volby/activity/do.vue'),
      props: true
    },
    {
      path: '/volby/senatni-volby/:id/aktivita/:party',
      name: 'volby-senatni-aktivity',
      component: () => import('../views/volby/detail/senatni-volby/activity/do.vue'),
      props: true
    },
    {
      path: '/volby/snemovni-volby/:id/aktivita/:party',
      name: 'volby-senatni-aktivity',
      component: () => import('../views/volby/detail/snemovni-volby/activity/do.vue'),
      props: true
    },
    {
      path: '/volby/komunalni-volby/:id/obec/:zast',
      name: 'volby-detail-komunal-kraj',
      component: () => import('../views/volby/detail/komunalni-volby/obec/do.vue'),
      props: true
    },
    {
      path: '/volby/senatni-volby/:id/obvod/:obvod', 
      name: 'volby-detail-senat-obvod',
      component: VolbySenatDetail, // () => import('../views/volby/detail/senatni-volby/obvod/do.vue'),
      props: true
    },
    {
      path: '/volby/:hash/:id/tema/:qid',
      name: 'volby-tema',
      component: () => import('../views/volby/tema/do.vue'),
      props: true
    },
    {
      path: '/volby/:hash/:id/kalkulacka/:qid',
      name: 'volby-kalkulacka',
      component: () => import('../views/volby/kalkulacka/do.vue'),
      props: true
    },
    {
      path: '/volby/:hash/:id/otazka/:qid',
      name: 'volby-otazka',
      component: () => import('../views/volby/otazka/do.vue'),
      props: true
    },
    {
      path: '/volby/:volbyType/:volbyID/:page/:tableID/volebni-program/:programID',
      name: 'volby-pointer-program',
      component: PointerProgramView,
      props: true
    },
    {
      path: '/volby/:volbyType/:volbyID/:page/:tableID/priority',
      name: 'volby-pointer-priority',
      component: PointerPriorityView,
      props: true
    },
    {
      path: '/volby/:volbyType/:volbyID/:page/:tableID/kandidati',
      name: 'volby-pointer-candidates',
      component: PointerCandidatesView,
      props: true
    },
    {
      path: '/volby/:volbyType/:volbyID/:page/:tableID/kandidati/:focus',
      name: 'volby-pointer-candidates-focus',
      component: PointerCandidatesView,
      props: true
    },
    {
      path: '/volby/:volbyType/:volbyID/:page/:tableID/otazky-a-odpovedi',
      name: 'volby-pointer-questions',
      component: PointerQAView,
      props: true
    },
    {
      path: '/volby/:volbyType/:volbyID/:page/:tableID',
      name: 'volby-pointer',
      component: PointerView,
      props: true
    },
    {
      path: '/bod/csu_cvs/:tableID',
      name: 'party-pointer',
      redirect: to => {
        return { path: '/rejstrik/' + to.params.tableID }
      },
      props: true
    },
    {
      path: '/bod/profile_list/:tableID',
      name: 'profile-pointer',
      redirect: to => {
        return { path: '/lide/profil/' + to.params.tableID }
      },
      props: true
    },
    {
      path: '/bod/csu_coco/:tableID',
      name: 'town-pointer',
      redirect: to => {
        return { path: '/obec/' + to.params.tableID }
      },
      props: true
    },
    {
      path: '/bod/:tableName/:tableID/volebni-program/:programID',
      name: 'generic-pointer-with-subpage-and-id',
      component: PointerProgramView,
      props: true
    },
    {
      path: '/bod/:tableName/:tableID/otazky-a-odpovedi',
      name: 'generic-pointer-answers',
      component: PointerQAView,
      props: true
    },
    {
      path: '/bod/:tableName/:tableID/priority',
      name: 'generic-pointer-priority',
      component: PointerPriorityView,
      props: true
    },
    {
      path: '/bod/:tableName/:tableID',
      name: 'generic-pointer',
      component: PointerView,
      props: true
    },
    {
      path: '/rejstrik',
      name: 'parties',
      component: () => import('../views/rejstrik/do.vue'),
      props: true
    },
    {
      path: '/rejstrik/:cid',
      name: 'party',
      component: () => import('../views/rejstrik/detail/do.vue'),
      props: true
    },
    {
      path: '/obce',
      name: 'towns',
      component: () => import('../views/history/obce/do.vue'),
      props: true
    },
    {
      path: '/obec/:num',
      name: 'town',
      component: () => import('../views/history/obce/detail/do.vue'),
      props: true
    },
    {
      path: '/ceska-republika',
      name: 'country',
      component: () => import('../views/history/cr/do.vue'),
      props: true
    },
    {
      path: '/kraj/:id',
      name: 'region',
      component: () => import('../views/history/kraj/do.vue'),
      props: true
    },
    {
      path: '/obvod/:id',
      name: 'district',
      component: () => import('../views/history/obvod/do.vue'),
      props: true
    },
    {
      path: '/lide',
      name: 'People',
      component: () => import('../views/lide/do.vue'),
      props: true
    },
    {
      path: '/lide/profil/:id',
      name: 'Profile',
      component: () => import('../views/lide/profil/do.vue'),
      props: true
    },
    {
      path: '/sedmideni',
      name: 'LayoutNewsSedmideni',
      redirect: to => {
        return { path: '/novinky'}
      }
    },
    {
      path: '/novinky',
      name: 'LayoutNewsWeekly',
      component: () => import('../views/news/weekly/do.vue'),
      props: true
    },
    {
      path: '/novinky/archiv',
      name: 'LayoutNews',
      component: () => import('../views/news/list/do.vue'),
    },
    {
      path: '/novinky/:id',
      name: 'LayoutNewsDetail',
      component: () => import('../views/news/detail/do.vue'),
      props: true
    },
    {
      path: '/jak-volit/snemovni-volby',
      name: 'LayoutHowSnemovni',
      component: () => import('../views/jak-volit/snemovni-volby/do.vue'),
      props: true
    },
    {
      path: '/jak-volit/krajske-volby',
      name: 'LayoutHowKrajske',
      component: () => import('../views/jak-volit/krajske-volby/do.vue'),
      props: true
    },
    {
      path: '/o-projektu',
      name: 'LayoutAbout',
      component: () => import('../views/about/do.vue'),
    },
    {
      path: '/o-projektu/kontakty',
      name: 'LayoutAboutContants',
      component: () => import('../views/about/kontakty/do.vue'),
    },
    {
      path: '/o-projektu/jak-podporit',
      name: 'LayoutAboutFundraising',
      component: () => import('../views/about/fundraising/do.vue'),
    },
    {
      path: '/o-projektu/pro-media',
      name: 'LayoutAboutMedia',
      component: () => import('../views/about/media/do.vue'),
    },
    {
      path: '/podporit-projekt',
      name: 'LayoutAboutFundraisingRedirect',
      redirect: '/o-projektu/jak-podporit',
    },
    {
      path: '/kontakty',
      name: 'LayoutAboutContactsRedirect',
      redirect: '/o-projektu/kontakty',
    },
    {
      path: '/widgety',
      name: 'LayoutWidgety',
      component: () => import('../views/widgets/do.vue'),
    },
    {
      path: '/volebni-pruzkumy',
      name: 'LayoutPolls',
      component: () => import('../views/polls/do.vue'),
    },
    {
      path: '/volebni-pruzkumy/:id',
      name: 'LayoutPollsDetail',
      component: () => import('../views/polls/detail/do.vue'),
      props: true
    },
    {
      path: '/vypocet-mandatu',
      name: 'LayoutPollsSimulation',
      component: () => import('../views/polls/simulation/do.vue'),
    },
  ]
})

router.beforeEach((to, from, next) => {
  document.querySelector('header').classList.add('_processing');
  next();
})

router.afterEach((to, from) => {
  document.querySelector('header').classList.remove('_processing');
})

export default router
