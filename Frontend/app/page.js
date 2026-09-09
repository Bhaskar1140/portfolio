import Header from "../Components/Header";
import Navbar from "../Components/Navbar";
import About_me from "../Components/About_me";  
import  Work from "../Components/Work"
import Contact  from "../Components/Contact";
import Footer from "../Components/Footer";

export default function Home() {
  
  return (
    <>
     <Navbar />
     <Header />
     <section id="About me" className="relative min-h-screen" aria-label="About me">
       <About_me />
     </section>
     <Work />
     <Contact />
      <Footer />
      
    </>
  );
}
