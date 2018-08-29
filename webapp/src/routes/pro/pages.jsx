// @material-ui/icons
import PersonAdd from '@material-ui/icons/PersonAdd';
import Fingerprint from '@material-ui/icons/Fingerprint';
import MonetizationOn from '@material-ui/icons/MonetizationOn';
import LockOpen from '@material-ui/icons/LockOpen';

import PricingPage from '../../views/pro/Pages/PricingPage';
import LoginPage from '../../views/pro/Pages/LoginPage';
import RegisterPage from '../../views/pro/Pages/RegisterPage';
import LockScreenPage from '../../views/pro/Pages/LockScreenPage';

const pagesRoutes = [
  {
    path: '/pages/register-page',
    name: 'Register Page',
    short: 'Register',
    mini: 'RP',
    icon: PersonAdd,
    component: RegisterPage,
  },
  {
    path: '/pages/login-page',
    name: 'Login Page',
    short: 'Login',
    mini: 'LP',
    icon: Fingerprint,
    component: LoginPage,
  },
  {
    path: '/pages/pricing-page',
    name: 'Pricing Page',
    short: 'Pricing',
    mini: 'PP',
    icon: MonetizationOn,
    component: PricingPage,
  },
  {
    path: '/pages/lock-screen-page',
    name: 'Lock Screen Page',
    short: 'Lock',
    mini: 'LSP',
    icon: LockOpen,
    component: LockScreenPage,
  },
  {
    redirect: true,
    path: '/pages',
    pathTo: '/pages/register-page',
    name: 'Register Page',
  },
];

export default pagesRoutes;
