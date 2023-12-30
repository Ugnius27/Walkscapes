import React, { useState } from 'react';

import './OffCanvas.css';
import '../Accordion/Accordion.jsx';
import Accordion from '../Accordion/Accordion.jsx';

const TogglerColumn = () => {
	return (
	  <div className="col-2">
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

const OffCanvas = ({Challenges}) => {
	return (
		<>
		<div className="col-2"></div>
		<div className="col-8">
			<h1>Walkscapes</h1>
		</div>
		  
		<TogglerColumn />
		  
		<div 
			className="offcanvas offcanvas-end custom-bg" // putting background on whole offCanvas
			data-bs-scroll="true" 
			data-bs-backdrop="false" 
			tabIndex="-1" 
			id="offcanvasScrolling" 
			aria-labelledby="offcanvasScrollingLabel"
		>
			<div className="offcanvas-header">
				<h2 
					className="offcanvas-title" 
					id="offcanvasScrollingLabel"
				>
					Challenges
				</h2>
				<button 
					type="button" 
					className="btn-close" 
					data-bs-dismiss="offcanvas" 
					aria-label="Close"
				>
				</button>
			</div>
			<Accordion Challenges={Challenges}/>
		</div>        	
		</>
	);
};

export default OffCanvas;
