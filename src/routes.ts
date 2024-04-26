import HomePage from './pages/Home.vue'
import ChampionsPage from './pages/Champions.vue'
import SingleChampionPage from './pages/SingleChampion.vue'
import ItemsPage from './pages/Items.vue'
import AugmentsPage from './pages/Augments.vue'
import TraitsPage from './pages/Traits.vue'
import BuildPage from './pages/Build.vue'

import SearchEmptyComponent from './components/SearchEmpty.vue'

export default [
  { path: '/', component: HomePage },
  { path: '/champions', component: ChampionsPage },
  { path: '/champions/:id', component: SingleChampionPage },
  { path: '/items', component: ItemsPage },
  { path: '/augments', component: AugmentsPage },
  { path: '/traits', component: TraitsPage },
  { path: '/build', component: BuildPage },
  { path: '/:pathMatch(.*)', component: SearchEmptyComponent },
]
