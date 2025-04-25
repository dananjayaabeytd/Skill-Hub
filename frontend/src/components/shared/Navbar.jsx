import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { useMyContext } from '../../store/ContextApi.jsx';
import NotificationBell from '../../utils/NotificationBell.jsx';

export function MenuBar() {
  const pathName = useLocation().pathname;
  const navigate = useNavigate();

  // Access the states by using the useMyContext hook from the ContextProvider
  const { token, setToken, currentUser, setCurrentUser, isAdmin, setIsAdmin } =
    useMyContext();

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
                  {currentUser?.name || 'User'}
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
        <Navbar.Link as={Link} to='/pricing' active={pathName === '/pricing'}>
          Pricing
        </Navbar.Link>
        <Navbar.Link as={Link} to='/contact' active={pathName === '/contact'}>
          Contact
        </Navbar.Link>
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
