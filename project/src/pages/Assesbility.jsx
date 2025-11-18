import React, { useEffect, useState } from "react";
import "./css/ass.css";



export default function Assesbility(){
  return(
      <div class="body">

<nav class="navbar">
  <div class="logo">
    <span class="logo-dot"></span> ZeroCode Automator
  </div>

  <ul class="nav-links">
    <li><a href="/New project/index.html">HomePage</a></li>
    <li><a href="automation.html">Automation</a></li>
    <li><a class="active" href="accessibility.html">Accessibility</a></li>
    <li><a href="extra.html">Extra Layout</a></li>
        <li><a href="/profile">Profile</a></li>

    <li><a href="login.html" id="login">LogOut</a></li>
  </ul>
</nav>


<section class="small-hero">
  <h1>Accessibility Settings</h1>
  <p>Customize how you see and interact with ZeroCode Automator.</p>
</section>


<div class="access-box">

  
  <h3 class="section-title">Font Size</h3>
  <div class="setting">
    <label for="fontSize">Choose font size</label>
    <select id="fontSize">
      <option value="default">Default</option>
      <option value="large">Large</option>
      <option value="xl">Extra Large</option>
    </select>
  </div>

  
  <h3 class="section-title">High Contrast Mode</h3>
  <div class="toggle">
    <input type="checkbox" id="contrastToggle"/>
    <label for="contrastToggle">Enable high contrast mode</label>
  </div>

  
  <h3 class="section-title">Dyslexia-Friendly Font</h3>
  <div class="toggle">
    <input type="checkbox" id="dyslexiaToggle"/>
    <label for="dyslexiaToggle">Enable dyslexic-friendly reading mode</label>
  </div>

  <h3 class="section-title">Screen Reader Support</h3>
  <div class="toggle">
    <input type="checkbox" id="readerToggle" />
    <label for="readerToggle">Enable screen reader accessibility (ARIA)</label>
  </div>

  
  <h3 class="section-title">Cursor Size</h3>
  <div class="setting">
    <label for="cursorSize">Cursor Size</label>
    <select id="cursorSize">
      <option value="normal">Normal</option>
      <option value="big">Big</option>
      <option value="xl">Extra Big</option>
    </select>
  </div>

  
  <h3 class="section-title">Motion Sensitivity</h3>
  <div class="toggle">
    <input type="checkbox" id="motionToggle"/>
    <label for="motionToggle">Reduce animations and motion</label>
  </div>

  
  <h3 class="section-title">Color Blind Filters</h3>
  <div class="setting">
    <label for="colorBlind">Apply color filter</label>
    <select id="colorBlind">
      <option value="none">None</option>
      <option value="protanopia">Protanopia</option>
      <option value="deuteranopia">Deuteranopia</option>
      <option value="tritanopia">Tritanopia</option>
    </select>
  </div>

  <button class="save-btn" id="saveBtn">Save Accessibility Settings</button>
</div>

<div class="toast" id="toast">Settings Saved</div>

</div>
  )
}