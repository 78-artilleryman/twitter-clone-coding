import React, { ReactNode } from 'react'
import MenuList from './Menu';

interface LayoutProps {
  children: ReactNode;
}

function Layout({children}: LayoutProps) {
  return (
    <div className='layout'>
      <MenuList/>
      {children}
    </div>

  )
}

export default Layout