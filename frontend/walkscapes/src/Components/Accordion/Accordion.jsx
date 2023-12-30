
// export function OffCanvasBody(){
// 	return (
 
// <div className="accordion accordion-flush " id="accordionFlushExample">

//   <div className="accordion-item p-1 custom-bg">
//     <h2 className="accordion-header">
//       <button className="accordion-button collapsed acordion-in-offCanvas" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
// 	   Challenge 1
//       </button>
//     </h2>
//     <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
//       <div className="accordion-body acordion-in-offCanvas-item">
// 		<h5>Description:</h5>
// 		<p className="text-start">
// 			Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item's accordion body.
// 		</p>
// 		</div>
		
// 	    <ul className="list-group list-group-flush list-group-item-action">
// 			<li className="list-group-item d-flex justify-content-between align-items-start acordion-in-offCanvas-item" style={{ border: 'none' }}>
// 				<button 
// 					className="ms-0 me-auto acordion-in-offCanvas-item" 
// 					style={{ border: 'none' }}
// 				>&#8226; 
// 					Route1 
// 				</button>
// 			</li>
// 			<li className="list-group-item d-flex justify-content-between align-items-start acordion-in-offCanvas-item">
// 				<button 
// 					className="ms-0 me-auto acordion-in-offCanvas-item" 
// 					style={{ border: 'none' }}
// 				>&#8226; 
// 					Route 2 
// 				</button>
// 			</li>
// 		</ul>


	
// 	</div>
//   </div>



//   <div className="accordion-item p-1 custom-bg">
//     <h2 className="accordion-header">
//       <button className="accordion-button collapsed acordion-in-offCanvas" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
//         Challenge 2
//       </button>
//     </h2>
//     <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
//       <div className="accordion-body acordion-in-offCanvas-item">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the second item's accordion body. Let's imagine this being filled with some actual content.</div>
//     </div>
//   </div>
//   <div className="accordion-item p-1 custom-bg">
//     <h2 className="accordion-header">
//       <button className="accordion-button collapsed acordion-in-offCanvas" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
// 	  Challenge 3
//       </button>
//     </h2>
//     <div id="flush-collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
//       <div className="accordion-body acordion-in-offCanvas-item">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the third item's accordion body. Nothing more exciting happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application.</div>
//     </div>
//   </div>
// </div>
// 	);
//   }

const Route = ({RouteTitle}) => {
	return (
		<li 
			className="list-group-item d-flex justify-content-between align-items-start acordion-in-offCanvas-item" 
			style={{ border: 'none' }}>
			<button 
				className="ms-0 me-auto acordion-in-offCanvas-item" 
				style={{ border: 'none' }}
			>&#8226; 
				{RouteTitle} 
			</button>
		</li>
	);
}

const RoutesInAccordionItem = ({RoutesTitles}) => {
	return (
		<>
		<ul className="list-group list-group-flush list-group-item-action">
			{/* <Route RouteTitle={RoutesTitles[0]}/> */}
			{RoutesTitles.map((route, index) => (
          	<Route 
				key={index}
				RouteTitle={route} 
			/>
        ))}
		</ul>
		
		</>
	);
}

const AccordionItem = ({Challenge, numberOfChallenge}) => {
	return (
		<div className="accordion-item p-1 custom-bg">
    		<h2 className="accordion-header">
      			<button 
	  				className="accordion-button collapsed acordion-in-offCanvas" 
					type="button" 
					data-bs-toggle="collapse" 
					data-bs-target={`#flush-collapse${numberOfChallenge}`}//"#flush-collapseOne" 
					aria-expanded="false" 
					aria-controls={`flush-collapse${numberOfChallenge}`}
				>
	   				{Challenge.title}
      			</button>
    		</h2>
    		<div 
				id={`flush-collapse${numberOfChallenge}`} 
				className="accordion-collapse collapse" 
				data-bs-parent="#accordionFlushExample"
			>
      			<div className="accordion-body acordion-in-offCanvas-item">
					<h5>Description:</h5>
					<p className="text-start">
						{Challenge.description}
					</p>
				</div>
		
	    {/* <ul className="list-group list-group-flush list-group-item-action">
			<li 
				className="list-group-item d-flex justify-content-between align-items-start acordion-in-offCanvas-item" 
				style={{ border: 'none' }}>
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
		</ul> */}
		<RoutesInAccordionItem RoutesTitles={Challenge.Routes}/>


	
	</div>
  </div>
	);
	
}

// Returns an accordion of challenges
const Accordion = ({Challenges}) => {
	return (
	  <>
	  <div className="accordion accordion-flush" id="accordion">
        {Challenges.map((challenge, index) => (
          <AccordionItem 
			// React uses the key to keep track of which 
			// items were added, modified, or removed.
		  	key={index}
			Challenge={challenge}
			numberOfChallenge={index} />
        ))}
      </div>
	  </>
	);
};
  
export default Accordion;