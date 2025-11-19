import './nav.css'
export function Navbar(){
    return(
         <nav className="navbar">
        <div className="logo">Automator</div>
        <ul className="nav-links" style={{color : "white"}}>
          <li><a href="/">HomePage</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/automation">Auto Form</a></li>
          <li><a href="/accessibility">Automation</a></li>
          <li>
            {/* <a href="/login" className="active login">   Login
            </a>*/}
            
          </li>
        </ul>
      </nav>
    )
}