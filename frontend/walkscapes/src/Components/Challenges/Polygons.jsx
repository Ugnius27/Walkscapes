import { useEffect, useState } from 'react'
import * as Database from './GetDataFromDB.js'

const Polygons = () => {
	const [polygons, setPolygons] = useState(null);

	useEffect(() => {
		setPolygons(() => Database.fetchPolygons());
	}, [])


}

export default Polygons