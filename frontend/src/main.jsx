import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './layout/root.layout.jsx';
import Home from './pages/home/Home.jsx';
import { ContextProvider } from './store/ContextApi.jsx';
import Login from './pages/Auth/Login.jsx';
import AboutUs from './pages/aboutUs/AboutUs.jsx';
import OAuth2RedirectHandler from './pages/Auth/OAuth2RedirectHandler.jsx';
import Signup from './pages/Auth/Signup.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import ResetPassword from './pages/Auth/ResetPassword.jsx';
import AccessDenied from './pages/Auth/AccessDenied.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NotFound from './components/NotFound.jsx';
import Preferences from './pages/Auth/Preference.jsx';
import { NotificationProvider } from './utils/NotificationProvider.jsx';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserList from './pages/admin/users/UserList.jsx';
import UserDetails from './pages/admin/users/UserDetails.jsx';
import SkillList from './pages/admin/skills/SkillList.jsx';
import MyProfile from './pages/user/MyProfile.jsx';
import UserWall from './pages/user/UserWall.jsx';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },

      {
        path: '/account-settings',
        element: <MyProfile />,
      },

      {
        path: '/admin-skills',
        element: <SkillList />,
      },
      {
        path: '/admin/users/:userId',
        element: <UserDetails />,
      },
      {
        path: '/my-wall',
        element: <UserWall />,
      },
      {
        path: '/admin-dashboard',
        element: <AdminDashboard />,
      },
      {
        path: '/preferences',
        element: <Preferences />,
      },
      {
        path: '/oauth2/redirect',
        element: <OAuth2RedirectHandler />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/reset-password',
        element: <ResetPassword />,
      },
      {
        path: '/admin-users',
        element: <UserList />,
      },
      {
        path: '/access-denied',
        element: <AccessDenied />,
      },
      {
        path: '/about-us',
        element: <AboutUs />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ContextProvider>
      <NotificationProvider>
        <Toaster position='top-center' />
        <RouterProvider router={router} />
      </NotificationProvider>
    </ContextProvider>
  </StrictMode>
);
