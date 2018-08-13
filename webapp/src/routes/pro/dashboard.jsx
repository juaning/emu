// @material-ui/icons
import DashboardIcon from '@material-ui/icons/Dashboard';
import Image from '@material-ui/icons/Image';
import Apps from '@material-ui/icons/Apps';
import ContentPaste from '@material-ui/icons/ContentPaste';
import GridOn from '@material-ui/icons/GridOn';
import Place from '@material-ui/icons/Place';
import WidgetsIcon from '@material-ui/icons/Widgets';
import Timeline from '@material-ui/icons/Timeline';
import DateRange from '@material-ui/icons/DateRange';

import Dashboard from '../../views/Dashboard/Dashboard';
import Buttons from '../../views/Components/Buttons';
import GridSystem from '../../views/Components/GridSystem';
import Panels from '../../views/Components/Panels';
import SweetAlert from '../../views/Components/SweetAlert';
import Notifications from '../../views/Components/Notifications';
import Icons from '../../views/Components/Icons';
import Typography from '../../views/Components/Typography';
import RegularForms from '../../views/Forms/RegularForms';
import ExtendedForms from '../../views/Forms/ExtendedForms';
import ValidationForms from '../../views/Forms/ValidationForms';
import Wizard from '../../views/Forms/Wizard';
import RegularTables from '../../views/Tables/RegularTables';
import ExtendedTables from '../../views/Tables/ExtendedTables';
import ReactTables from '../../views/Tables/ReactTables';
import GoogleMaps from '../../views/Maps/GoogleMaps';
import FullScreenMap from '../../views/Maps/FullScreenMap';
import VectorMap from '../../views/Maps/VectorMap';
import Charts from '../../views/Charts/Charts';
import Calendar from '../../views/Calendar/Calendar';
import Widgets from '../../views/Widgets/Widgets';
import UserProfile from '../../views/Pages/UserProfile';
import TimelinePage from '../../views/Pages/Timeline';
import RTLSupport from '../../views/Pages/RTLSupport';

import pagesRoutes from './pages';

const pages = [
  {
    path: '/timeline-page',
    name: 'Timeline Page',
    mini: 'TP',
    component: TimelinePage,
  },
  {
    path: '/user-page',
    name: 'User Profile',
    mini: 'UP',
    component: UserProfile,
  },
  {
    path: '/rtl/rtl-support-page',
    name: 'RTL Support',
    mini: 'RS',
    component: RTLSupport,
  },
].concat(pagesRoutes);

const dashRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: DashboardIcon,
    component: Dashboard,
  },
  {
    collapse: true,
    path: '-page',
    name: 'Pages',
    state: 'openPages',
    icon: Image,
    views: pages,
  },
  {
    collapse: true,
    path: '/components',
    name: 'Components',
    state: 'openComponents',
    icon: Apps,
    views: [
      {
        path: '/components/buttons',
        name: 'Buttons',
        mini: 'B',
        component: Buttons,
      },
      {
        path: '/components/grid-system',
        name: 'Grid System',
        mini: 'GS',
        component: GridSystem,
      },
      {
        path: '/components/panels',
        name: 'Panels',
        mini: 'P',
        component: Panels,
      },
      {
        path: '/components/sweet-alert',
        name: 'Sweet Alert',
        mini: 'SA',
        component: SweetAlert,
      },
      {
        path: '/components/notifications',
        name: 'Notifications',
        mini: 'N',
        component: Notifications,
      },
      {
        path: '/components/icons', name: 'Icons', mini: 'I', component: Icons,
      },
      {
        path: '/components/typography',
        name: 'Typography',
        mini: 'T',
        component: Typography,
      },
    ],
  },
  {
    collapse: true,
    path: '/forms',
    name: 'Forms',
    state: 'openForms',
    icon: ContentPaste,
    views: [
      {
        path: '/forms/regular-forms',
        name: 'Regular Forms',
        mini: 'RF',
        component: RegularForms,
      },
      {
        path: '/forms/extended-forms',
        name: 'Extended Forms',
        mini: 'EF',
        component: ExtendedForms,
      },
      {
        path: '/forms/validation-forms',
        name: 'Validation Forms',
        mini: 'VF',
        component: ValidationForms,
      },
      {
        path: '/forms/wizard', name: 'Wizard', mini: 'W', component: Wizard,
      },
    ],
  },
  {
    collapse: true,
    path: '/tables',
    name: 'Tables',
    state: 'openTables',
    icon: GridOn,
    views: [
      {
        path: '/tables/regular-tables',
        name: 'Regular Tables',
        mini: 'RT',
        component: RegularTables,
      },
      {
        path: '/tables/extended-tables',
        name: 'Extended Tables',
        mini: 'ET',
        component: ExtendedTables,
      },
      {
        path: '/tables/react-tables',
        name: 'React Tables',
        mini: 'RT',
        component: ReactTables,
      },
    ],
  },
  {
    collapse: true,
    path: '/maps',
    name: 'Maps',
    state: 'openMaps',
    icon: Place,
    views: [
      {
        path: '/maps/google-maps',
        name: 'Google Maps',
        mini: 'GM',
        component: GoogleMaps,
      },
      {
        path: '/maps/full-screen-maps',
        name: 'Full Screen Map',
        mini: 'FSM',
        component: FullScreenMap,
      },
      {
        path: '/maps/vector-maps',
        name: 'Vector Map',
        mini: 'VM',
        component: VectorMap,
      },
    ],
  },
  {
    path: '/widgets', name: 'Widgets', icon: WidgetsIcon, component: Widgets,
  },
  {
    path: '/charts', name: 'Charts', icon: Timeline, component: Charts,
  },
  {
    path: '/calendar', name: 'Calendar', icon: DateRange, component: Calendar,
  },
  {
    redirect: true, path: '/', pathTo: '/dashboard', name: 'Dashboard',
  },
];
export default dashRoutes;
