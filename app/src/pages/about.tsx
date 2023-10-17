/* eslint-disable react/no-unescaped-entities */ 

import Link from 'next/link';

export default function About() {
  return (
  <>
    <Link href="/">Home</Link>
    <br />
    <h1>About the Project</h1>  
    <p>
      This project serves not only as a testament to my skills and capabilities in web development but also as a bridge to my next professional journey. Designed and built from scratch, it showcases my proficiency in handling modern web technologies and my readiness to take on more challenging roles in the industry.
    </p>

    <h3>Technologies used:</h3>
    <p>TypeScript: Provided type-safe coding, ensuring robustness and improved developer experience.</p>
    <p>React: Enabled component-based architecture, streamlining UI development.</p>
    <p>React-Redux: Allowed seamless state management within React components, utilizing hooks, and the Redux store for consistent state handling.</p>
    <p>NextJS: Facilitated server-side rendering, boosting site performance and SEO.</p>
    <p>Axios: Enhanced API calls with ease, optimizing data-fetching processes.</p>

    <h2>About Me</h2> 
    <p>I&apos;m Tom, a dedicated web developer with a keen eye for design and a passion for creating efficient, user-friendly applications. My goal is to secure a front-end development position where I can further harness my skills and contribute to meaningful projects.</p>
    <p>During the development of this site, I delved deeper into the intricacies of APIs, refining my techniques in interacting with, testing, and seamlessly integrating them. I navigated various challenges, from UI/UX decisions to intricate code debugging, which further solidified my love for this craft and my determination to excel in the front-end domain.</p>

    <h4>Connect with me:</h4>
    <ul>
      <li>
        <a href="https://www.linkedin.com/in/tom-childress/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </li>
      <li>
        <a href="https://github.com/chil-t" target="_blank" rel="noopener noreferrer">Github</a>
      </li>
    </ul>
  </>
  )
}