import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import Team from './pages/Team'
import JoinUs from './pages/JoinUs'
import AdminLayout from './admin/components/AdminLayout'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminLeads from './admin/pages/AdminLeads'
import AdminClients from './admin/pages/AdminClients'
import AdminProjects from './admin/pages/AdminProjects'
import AdminPortfolio from './admin/pages/AdminPortfolio'
import AdminServices from './admin/pages/AdminServices'
import AdminPricing from './admin/pages/AdminPricing'
import AdminMessages from './admin/pages/AdminMessages'
import AdminProposals from './admin/pages/AdminProposals'
import AdminInvoices from './admin/pages/AdminInvoices'
import AdminTasks from './admin/pages/AdminTasks'
import AdminSupport from './admin/pages/AdminSupport'
import AdminBlog from './admin/pages/AdminBlog'
import AdminAnalytics from './admin/pages/AdminAnalytics'
import AdminMedia from './admin/pages/AdminMedia'
import AdminTeam from './admin/pages/AdminTeam'
import AdminSettings from './admin/pages/AdminSettings'
import AdminTestimonials from './admin/pages/AdminTestimonials'
import Login from './admin/pages/Login'
import ProtectedRoute from './admin/components/ProtectedRoute'
import { AuthProvider } from './admin/context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-white">
          <Routes>
            <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
            <Route path="/services" element={<><Navbar /><Services /><Footer /></>} />
            <Route path="/portfolio" element={<><Navbar /><Portfolio /><Footer /></>} />
            <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
            <Route path="/join-us" element={<><Navbar /><JoinUs /><Footer /></>} />
            <Route path="blog" element={<><Navbar /><Blog /><Footer /></>} />
            <Route path="team" element={<><Navbar /><Team /><Footer /></>} />

            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="proposals" element={<AdminProposals />} />
              <Route path="invoices" element={<AdminInvoices />} />
              <Route path="tasks" element={<AdminTasks />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App