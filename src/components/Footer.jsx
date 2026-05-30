export default function Footer(){
  // Dynamic year generation
  const currentYear = new Date().getFullYear();

  return(
    // Uses py-3 (compact vertical padding) and border-top to separate cleanly from <main>
    <footer className="bg-white text-dark py-3 border-top mt-auto">
      <div className="container-fluid px-4"> 
  <div className="row align-items-center">
    
    {/* col-12 spans full width, text-center keeps it perfectly centered on all viewports */}
    <div className="col-12 text-center">
      <p className="text-muted small mb-0">
        &copy; {currentYear} <span className="fw-semibold text-dark">Anvaya CRM</span>. All rights reserved.
      </p>
    </div>

  </div>
</div>
    </footer>
  );
};

