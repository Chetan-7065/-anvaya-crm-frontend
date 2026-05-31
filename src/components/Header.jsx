export default function Header(){
return(
//  <header className="navbar navbar-expand bg-white sticky-top d-flex align-items-center justify-content-between p-2 shadow-sm w-100 border-bottom">
//     <a className="navbar-brand me-0 px-3 fs-5 text-dark fw-bold" href="/">
//         <i className="bi bi-cpu-fill me-2 text-dark"></i>Anvaya CRM Dashboard
//     </a>
// </header>
    <div className="navbar bg-white sticky-top p-2 w-100 ">
  {/* FIXED: Added container-fluid wrapper inside to anchor margins perfectly to the screen walls */}
  <div className="container-fluid d-flex align-items-center justify-content-between px-0">
    <a className="navbar-brand me-0 px-3 fs-5 text-dark fw-bold" href="/">
      <i className="bi bi-cpu-fill me-2 text-dark"></i>Anvaya CRM Dashboard
    </a>
  </div>
</div>
)
}