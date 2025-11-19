import  './css/home.css'
import { Navbar } from './Navbar';
import Lottie1 from './Lottie1';
export function HomePage(){
    return(
        <>
        <Navbar />
  

  
  <section className="hero ">
    <div id="Service">
    <div id="content">
    <h1>Zero-Code Web Automation for Digital Accessibility</h1>
    <span className="tagline text-center text-white">
      Empowering non-technical users by enabling them to automate online tasks  
      (forms, alerts, workflows) 
    </span>

    <button className="cta-btn" onclick="scrollToSection('get-started')">
      Start Building Automation →
    </button>
    </div>
    <div id= "img"> <Lottie1 /> </div>
    </div>
  </section>


  
  <section id="features" className="section">
    <h2 class = "h2_a">Why Zero-Code Automation?</h2>

    <div className="features-grid">
      <div className="card">
        <h3 id= "h3_a">No Expert required</h3>
        <p>Create simple automation to fill daily forms</p>
      </div>

      <div className="card">
        <h3 id= "h3_a">Accessible for Everyone</h3>
        <p>Built with WCAG 2.1 for visually impaired & differently-abled users.</p>
      </div>

      <div className="card">
        <h3 id= "h3_a">Private & Secure</h3>
        <p>GDPR-friendly automation with user data safety.</p>
      </div>

      <div className="card">
        <h3 id= "h3_a">Automate Anything</h3>
        <p>Forms, alerts, reminders, notifications & more.</p>
      </div>
    </div>
  </section>

  
  <section id="accessibility" className="section alt">
    <h2 class = "h2_b">Built for Digital Inclusiveness</h2>

    <ul className="a11y-list">
      <li>✔ Screen Reader Friendly</li>
      <li>✔ Keyboard Navigation Support</li>
      <li>✔ Adjustable Text Size</li>
      <li>✔ High Contrast Mode</li>
      <li>✔ Clear Labeling & Alt Text</li>
    </ul>
  </section>

  
  <section id="get-started" className="section">
    <h2 class = "h2_b">Ready to Build?</h2>
    <p>Create automated workflows in minutes — without writing code.</p>

    <button  onClick={
      ()=>{
        console.log('h');
        
        window.location.href = '/register'
      }
    } className="cta-btn big">Get Started Now</button>
  </section>

  </>
    )
}