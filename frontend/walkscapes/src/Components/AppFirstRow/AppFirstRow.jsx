import '../OffCanvas/OffCanvas.jsx';
import OffCanvas from '../OffCanvas/OffCanvas.jsx';

const AppFirstRow = ({Challenges}) => {
	return (
		<div 
			className="container-fluid text-center custom-bg m-3" 
			style={{ margin: 0, padding: 0 }}
		>
			<div className="row align-items-center justify-content-end">
				<OffCanvas Challenges={Challenges}/>
			</div>
		</div>
	);
}

export default AppFirstRow;