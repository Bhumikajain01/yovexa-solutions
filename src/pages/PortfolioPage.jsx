import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Portfolio from '../components/Portfolio';
import ProjectModal from '../components/ProjectModal';
import Footer from '../components/Footer';

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Portfolio & Selected Projects | Yovexa Solutions';
  }, []);

  const handleDiscussProject = (projectTitle) => {
    window.location.href = `/#contact`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0B1B3A] font-sans">
      <Navbar />

      <main className="flex-1 pt-16">
        <Portfolio onSelectProject={setSelectedProject} />
      </main>

      <Footer />

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onDiscussProject={handleDiscussProject}
        />
      )}
    </div>
  );
}
