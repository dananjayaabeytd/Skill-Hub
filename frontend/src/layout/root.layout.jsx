import { Outlet } from 'react-router-dom';
import { MenuBar } from '../components/shared/Navbar';
import { FooterComponent } from '../components/shared/Footer';
import { Toaster } from 'react-hot-toast';
import { ContextProvider } from '../store/ContextApi';

function RootLayout() {
  return (
    <>
      <MenuBar />
      {/* <Toaster position='bottom-center' reverseOrder={false} /> */}
      <Outlet />
      <FooterComponent />
    </>
  );
}

export default RootLayout;
