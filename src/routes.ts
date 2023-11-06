import HomePage from './pages/Home.vue'
import ChampionsPage from './pages/Champions.vue'
import SingleChampionPage from './pages/SingleChampion.vue'
import ItemsPage from './pages/Items.vue'

export default [
  { path: '/', component: HomePage },
  { path: '/champions', component: ChampionsPage },
  { path: '/champions/:id', component: SingleChampionPage },
  { path: '/items', component: ItemsPage },
]
