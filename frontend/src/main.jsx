import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client';
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './layout/root.layout.jsx';
import Home from './pages/home/Home.jsx';
import AboutUs from './pages/aboutUs/AboutUs.jsx';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home/>,
      },
      {
        path: '/about-us', 
        element: <AboutUs/>,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);