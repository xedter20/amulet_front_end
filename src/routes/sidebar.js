/** Icons are imported separatly to reduce build time */
import checkAuth from '../app/auth';
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon';
import QrCodeIcon from '@heroicons/react/24/outline/QrCodeIcon';
import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
import PresentationChartLineIcon from '@heroicons/react/24/outline/PresentationChartLineIcon';
const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const token = checkAuth();

let routes = [];

if (token) {
  routes = [
    {
      path: '/app/dashboard',
      icon: <Squares2X2Icon className={iconClasses} />,
      name: 'Dashboard'
    },
    {
      path: '/app/users', // url
      icon: <UsersIcon className={iconClasses} />, // icon component
      name: 'Users' // name that appear in Sidebar
    },
    {
      path: '/app/network_tree',
      icon: <PresentationChartLineIcon className={iconClasses} />,
      name: 'Network Tree'
    },
    {
      path: '/app/code_generator',
      icon: <QrCodeIcon className={iconClasses} />,
      name: 'Code Generator'
    }
  ];
} else {
  routes = [
    {
      path: '/app/dashboard',
      icon: <Squares2X2Icon className={iconClasses} />,
      name: 'Dashboard'
    }
  ];
}

export default routes;
