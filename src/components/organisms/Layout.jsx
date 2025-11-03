import { Outlet } from 'react-router-dom'
import Header from '@/components/organisms/Header'

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout