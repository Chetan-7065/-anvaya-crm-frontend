export default function Header(){
return(
 <header className="navbar navbar-light sticky-top bg-white d-flex align-items-center justify-content-between p-2 shadow">
    <a className="navbar-brand me-0 px-3 fs-5 text-dark fw-bold" href="/">
        <i className="bi bi-cpu-fill me-2 text-dark"></i>Anvaya CRM Dashboard
    </a>
    
    <div className="navbar-nav flex-row align-items-center px-3">
        <div className="nav-item text-nowrap me-2 me-sm-3">
            <a className="nav-link px-2 px-sm-3 text-dark border border-dark rounded-pill fs-7" href="/">
                <i className="bi bi-person-circle me-1"></i> <span className="d-none d-sm-inline">My Profile</span>
            </a>
        </div>
        <div className="nav-item text-nowrap">
            <button className="btn btn-outline-danger btn-sm px-2 px-sm-3" type="button">
                <i className="bi bi-box-arrow-right me-1"></i><span className="d-none d-sm-inline">Sign out</span>
            </button>
        </div>
    </div>
</header>
)
}