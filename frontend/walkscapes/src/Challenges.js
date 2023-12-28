import './offCanvas.css';

export function TogglerColumn(){
	return (
	  <div className="col-md-auto">
		<nav className="navbar custom-bg">
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
 
<div class="accordion accordion-flush " id="accordionFlushExample">

  <div class="accordion-item p-1 custom-bg">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed acordion-in-offCanvas" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
	   Challenge 1
      </button>
    </h2>
    <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body acordion-in-offCanvas-item">
		<h5>Description:</h5>
		<p className="text-start">
			Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item's accordion body.
		</p>
		</div>
		
	    <ul className="list-group list-group-flush list-group-item-action">
			<li className="list-group-item d-flex justify-content-between align-items-start acordion-in-offCanvas-item" style={{ border: 'none' }}>
				<button 
					className="ms-0 me-auto acordion-in-offCanvas-item" 
					style={{ border: 'none' }}
				>&#8226; 
					Route1 
				</button>
			</li>
			<li className="list-group-item d-flex justify-content-between align-items-start acordion-in-offCanvas-item">
				<button 
					className="ms-0 me-auto acordion-in-offCanvas-item" 
					style={{ border: 'none' }}
				>&#8226; 
					Route 2 
				</button>
			</li>
		</ul>


	
	</div>
  </div>



  <div class="accordion-item p-1 custom-bg">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed acordion-in-offCanvas" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
        Challenge 2
      </button>
    </h2>
    <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body acordion-in-offCanvas-item">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the second item's accordion body. Let's imagine this being filled with some actual content.</div>
    </div>
  </div>
  <div class="accordion-item p-1 custom-bg">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed acordion-in-offCanvas" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
	  Challenge 3
      </button>
    </h2>
    <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body acordion-in-offCanvas-item">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the third item's accordion body. Nothing more exciting happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application.</div>
    </div>
  </div>
</div>




// </div>
	//   <div class="offcanvas-body">
	// 	<ol className="list-group list-group-numbered list-group-item-action">
  
	// 	  <li className="list-group-item d-flex justify-content-between align-items-start list-group-item-action list-group-item-success">
	// 		<div className="ms-2 me-auto fw-bold ">Challenge </div>
	// 	  </li>
  
	// 	  <li className="list-group-item d-flex justify-content-between align-items-start list-group-item-action list-group-item-success">
	// 		<div className="ms-2 me-auto fw-bold">Challenge </div>
	// 	  </li>
  
	// 	  <li className="list-group-item d-flex align-items-start list-group-item-action list-group-item-success">
	// 		<a 
	// 		  className="ms-2 me-auto fw-bold nav-link dropdown-toggle" 
	// 		  href="#" 
	// 		  role="button" 
	// 		  data-bs-toggle="dropdown" 
	// 		  aria-expanded="false"
	// 		>
	// 		  Dropdown
	// 		</a>
  
	// 		<ul className="dropdown-menu">
	// 		  <li><a className="dropdown-item" href="#">Route1</a></li>
	// 		  <li><a className="dropdown-item" href="#">Route2</a></li>
	// 		  <li><a className="dropdown-item" href="#">Something else here</a></li>
	// 		</ul>
  
	// 	  </li>
	// 	</ol>
	//   </div>
	);
  }

export function ContainerOfTogglerAndTitle(){
	return (
	  <div className="container-fluid text-center custom-bg" style={{ margin: 0, padding: 0 }}>
  
		<div className="row align-items-center justify-content-end">
  
		  <div className="col-md-auto"></div>
			<div className="col-10">
			  <h1>Walkscapes</h1>
			</div>
  
			<TogglerColumn />
  
			<div 
			  class="offcanvas offcanvas-end custom-bg" // putting background on whole offCanvas
			  data-bs-scroll="true" 
			  data-bs-backdrop="false" 
			  tabindex="-1" 
			  id="offcanvasScrolling" 
			  aria-labelledby="offcanvasScrollingLabel"
			>
			<div class="offcanvas-header">
			  <h2 
				class="offcanvas-title" 
				id="offcanvasScrollingLabel"
			  >
				Challenges
			  </h2>
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