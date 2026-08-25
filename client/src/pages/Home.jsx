import Seo from '../components/Seo.jsx';
import Hero from '../sections/Hero.jsx';
import Stats from '../sections/Stats.jsx';
import About from '../sections/About.jsx';
import Services from '../sections/Services.jsx';
import Skills from '../sections/Skills.jsx';
import FeaturedProject from '../sections/FeaturedProject.jsx';
import Projects from '../sections/Projects.jsx';
import Experience from '../sections/Experience.jsx';
import Testimonials from '../sections/Testimonials.jsx';
import Support from '../sections/Support.jsx';
import Contact from '../sections/Contact.jsx';

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Pradosh Mukherjee',
  jobTitle: 'Senior Full-Stack Developer',
  address: { '@type': 'PostalAddress', addressLocality: 'Kolkata', addressCountry: 'IN' },
  knowsAbout: ['Laravel', 'PHP', 'Node.js', 'React', 'MongoDB', 'SaaS', 'AI'],
};

export default function Home() {
  return (
    <>
      <Seo jsonLd={personSchema} />
      <Hero />
      <Stats />
      <About />
      <Services />
      <Skills />
      <FeaturedProject />
      <Projects />
      <Experience />
      <Testimonials />
      <Support />
      <Contact />
    </>
  );
}
