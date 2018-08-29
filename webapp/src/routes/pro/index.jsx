import Pages from '../../layouts/Pages';
import RTL from '../../layouts/RTL';
import Dashboard from '../../layouts/Dashboard';

const indexRoutes = [
  { path: '/rtl', name: 'RTL', component: RTL },
  { path: '/pages', name: 'Pages', component: Pages },
  { path: '/', name: 'Home', component: Dashboard },
];

export default indexRoutes;
