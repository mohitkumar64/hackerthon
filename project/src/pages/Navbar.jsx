import './nav.css'
export function Navbar(){
    return(
         <nav className="navbar">
        <div className="logo">ZeroCode Automator</div>
        <ul className="nav-links">
          <li><a href="/">HomePage</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/automation">Automation</a></li>
          <li><a href="/accessibility">Accessibility</a></li>
          <li>
            <a href="/login" className="active login">
              Login
            </a>
          </li>
        </ul>
      </nav>
    )
}