  import { Link, useNavigate } from 'react-router-dom'
  import { useAuth } from '../context/useAuth'
  import toast from 'react-hot-toast'

  const Navbar = () => {
    const { logout, isAuthenticated, switchRole, activeRole } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
      logout()
      navigate("/")
      toast.success("Come Back Soon")
    }

    const handleSwitchRole = () => {
    const newRole = activeRole === "client" ? "freelancer" : "client"
    switchRole(newRole)
    toast.success(`Switched to ${newRole}`)
  }


    return (
      <div className="navbar px-5 bg-base-100 text-white shadow-sm">
        {/* Left: Logo */}
        <div className="flex-none">
          <Link to="/" className="text-3xl">WIA!</Link>
        </div>

        {/* Center: Menu */}
        <div className="flex-1 justify-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-10 px-1 text-white text-base">
            <li><Link to="/">Home</Link></li>
            {!isAuthenticated && (
              <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              </>
            )}
            <li><Link to="/homepage">Browse Jobs</Link></li>
             {isAuthenticated && activeRole && (
            <li>
              <button onClick={handleSwitchRole} className="btn btn-ghost">
                Switch to {activeRole === "client" ? "freelancer" : "client"}
              </button>
            </li>
          )}
          </ul>
        </div>

        {/* Right: Search + Avatar */}
        {isAuthenticated && (
          <div className="flex-none flex gap-2 items-center">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li><Link to="/profile">Profile</Link></li>
                <li><a>Settings</a></li>
                <li><a onClick={handleLogout}>Logout</a></li>
              </ul>
            </div>
          </div>
        )}
      </div>
    )
  }

  export default Navbar
