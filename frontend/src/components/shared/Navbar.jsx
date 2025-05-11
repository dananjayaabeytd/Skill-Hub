import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { useMyContext } from '../../store/ContextApi.jsx';
import NotificationBell from '../../utils/NotificationBell.jsx';
import GlobalSearch from './GlobalSearch.jsx';
import api from '../../services/api.js';

export function MenuBar() {
  //handle the header opening and closing menu for the tablet/mobile device
  const pathName = useLocation().pathname;
  const navigate = useNavigate();

  // Access the states by using the useMyContext hook from the ContextProvider
  const { token, setToken, currentUser, setCurrentUser, isAdmin, setIsAdmin } =
    useMyContext();

  // Handle premium checkout process
  const handlePremiumCheckout = async e => {
    e.preventDefault();
    try {
      const response = await api.post('/payment/checkout', {
        amount: 100,
        quantity: 1,
        currency: 'USD',
        name: 'Premium',
      });

      if (response.data.status === 'SUCCESS' && response.data.sessionUrl) {
        // Open payment URL in a new tab
        window.open(response.data.sessionUrl, '_blank');
      } else {
        console.error('Payment session creation failed');
      }
    } catch (err) {
      console.error('Error initiating payment:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('JWT_TOKEN');
    localStorage.removeItem('USER');
    localStorage.removeItem('CSRF_TOKEN');
    localStorage.removeItem('IS_ADMIN');
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href='/'>
        <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>
          Skill Hub
        </span>
      </Navbar.Brand>

      {/* Center-right - Search */}
      <div className='flex-grow mx-4 hidden md:block md:max-w-sm lg:max-w-md'>
        <GlobalSearch />
      </div>
      <div className='flex md:order-2'>
        {token ? (
          <div className='flex items-center gap-3'>
            {/* Add Notification Bell here */}
            <NotificationBell />

            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt='User settings'
                  img={
                    currentUser?.profileImage ||
                    'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                  }
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className='block truncate text-sm font-medium'>
                  {currentUser?.username || 'User'}
                </span>
              </Dropdown.Header>
              {isAdmin && (
                <Dropdown.Item onClick={() => navigate('/admin-dashboard')}>
                  Admin Dashboard
                </Dropdown.Item>
              )}
              <Dropdown.Item onClick={() => navigate('/my-wall')}>
                My Wall
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate('/account-settings')}>
                Account Settings
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate('/settings')}>
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
            </Dropdown>
          </div>
        ) : (
          <div className='flex gap-2'>
            <Link
              to='/login'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2'
            >
              Login
            </Link>
            <Link
              to='/signup'
              className='text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-4 py-2'
            >
              Sign Up
            </Link>
          </div>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={Link} to='/' active={pathName === '/'}>
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} to='/about-us' active={pathName === '/about-us'}>
          About
        </Navbar.Link>
        <Navbar.Link as={Link} to='/services' active={pathName === '/services'}>
          Services
        </Navbar.Link>
        {token && currentUser && !currentUser.premium && (
          <Navbar.Link
            href='#'
            onClick={handlePremiumCheckout}
            active={pathName === '/pricing'}
            className='relative group'
          >
            <span className='flex items-center'>
              Get Premium
              <span className='ml-1.5 hidden group-hover:inline-block'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='w-4 h-4 text-amber-500'
                >
                  <path
                    fillRule='evenodd'
                    d='M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
            </span>
            <span className='absolute -top-1 -right-1 flex h-3 w-3'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-3 w-3 bg-amber-500'></span>
            </span>
          </Navbar.Link>
        )}
        {/* Plans Dropdown with hover effects */}
        <Dropdown
          inline
          label="Plans"
          className="text-gray-700 hover:text-blue-700 font-medium"
        >
          <Dropdown.Item as={Link} to="/plans">
            View Plans
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/plans/create">
            Create Plan
          </Dropdown.Item>
        </Dropdown>

        <Dropdown
          inline
          label="Progress"
          className="text-gray-700 hover:text-blue-700 font-medium"
        >
        <Dropdown.Item as={Link} to="/progress/all">
            View User Progress
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/progress/my">
            View My Progress
          </Dropdown.Item>
        </Dropdown>

      </Navbar.Collapse>
    </Navbar>
  );
}
