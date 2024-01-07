import React, { useEffect, useRef, useState, useCallback } from 'react';

import * as Database from './GetDataFromDB.js'

const Markers = () => {
	useEffect(() => {
		var r = Database.fetchRecordsForMarker(8);
		console.log('8th marker: ');
		console.log(r);

		Database.fetchMarkers();
	})
}

export default Markers