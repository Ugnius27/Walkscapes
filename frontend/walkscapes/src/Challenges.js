export function TogglerColumn(){
	return (
	  <div className="col-md-auto">
		<nav className="navbar bg-body-tertiary">
		  <button
			className="navbar-toggler ms-auto"
			type="button"
			data-bs-toggle="offcanvas"
			data-bs-target="#offcanvasScrolling"
			aria-controls="offcanvasScrolling"
			aria-label="Toggle navigation"
		  >
			<span className="navbar-toggler-icon"></span>
		  </button>
		</nav>
	  </div>
	);
}

export function OffCanvasBody(){
	return (
	  <div class="offcanvas-body">
		<ol className="list-group list-group-numbered list-group-item-action">
  
		  <li className="list-group-item d-flex justify-content-between align-items-start list-group-item-action list-group-item-success">
			<div className="ms-2 me-auto fw-bold ">Challenge </div>
		  </li>
  
		  <li className="list-group-item d-flex justify-content-between align-items-start list-group-item-action list-group-item-success">
			<div className="ms-2 me-auto fw-bold">Challenge </div>
		  </li>
  
		  <li className="list-group-item d-flex align-items-start list-group-item-action list-group-item-success">
			<a 
			  className="ms-2 me-auto fw-bold nav-link dropdown-toggle" 
			  href="#" 
			  role="button" 
			  data-bs-toggle="dropdown" 
			  aria-expanded="false"
			>
			  Dropdown
			</a>
  
			<ul className="dropdown-menu">
			  <li><a className="dropdown-item" href="#">Route1</a></li>
			  <li><a className="dropdown-item" href="#">Route2</a></li>
			  <li><a className="dropdown-item" href="#">Something else here</a></li>
			</ul>
  
		  </li>
		</ol>
	  </div>
	);
  }

export function ContainerOfTogglerAndTitle(){
	return (
	  <div className="container-fluid text-center" style={{ margin: 0, padding: 0 }}>
  
		<div className="row align-items-center justify-content-end">
  
		  <div className="col-md-auto"></div>
			<div className="col-10">
			  <h1>Walkscapes</h1>
			</div>
  
			<TogglerColumn />
  
			<div 
			  class="offcanvas offcanvas-end" 
			  data-bs-scroll="true" 
			  data-bs-backdrop="false" 
			  tabindex="-1" 
			  id="offcanvasScrolling" 
			  aria-labelledby="offcanvasScrollingLabel"
			>
			<div class="offcanvas-header">
			  <h5 
				class="offcanvas-title" 
				id="offcanvasScrollingLabel"
			  >
				Challenges
			  </h5>
			  <button 
				type="button" 
				class="btn-close" 
				data-bs-dismiss="offcanvas" 
				aria-label="Close"
			  >
			</button>
		  </div>
  
		  <OffCanvasBody />
  
		  </div>        
		</div>
	  </div>
	);
}