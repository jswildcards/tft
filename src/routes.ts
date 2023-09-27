import HomePage from './pages/Home.vue'
import ChampionsPage from './pages/Champions.vue'
import SingleChampionPage from './pages/SingleChampion.vue'

export default [
  { path: '/', component: HomePage },
  { path: '/champions', component: ChampionsPage },
  { path: '/champions/:id', component: SingleChampionPage },
]
