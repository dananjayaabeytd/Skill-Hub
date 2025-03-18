import { Outlet } from 'react-router-dom';
import { MenuBar } from '../components/shared/Navbar';
import { FooterComponent } from '../components/shared/Footer';

function RootLayout() {
  return (
    <>
      <MenuBar />
      <Outlet />
      <FooterComponent />
    </>
  );
}

export default RootLayout;
