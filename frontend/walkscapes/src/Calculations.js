
export function isCoordinateInsidePolygon(coord, polygon) {
	var x = coord[0], y = coord[1];
	var inside = false;
  
	for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		var xi = polygon[i][0], yi = polygon[i][1];
		var xj = polygon[j][0], yj = polygon[j][1];
  
		var intersect = ((yi > y) != (yj > y)) &&
			(x < ((xj - xi) * (y - yi) / (yj - yi) + xi));
  
		if (intersect) inside = !inside;
	}
  
	return inside;
}

export function getPolygonCenter(polygon) {
    let totalX = 0;
    let totalY = 0;
    
    // Calculate the total sum of x and y coordinates
    for (let i = 0; i < polygon.length; i++) {
        totalX += polygon[i][0];
        totalY += polygon[i][1];
    }
    
    // Calculate the average
    const centerX = totalX / polygon.length;
    const centerY = totalY / polygon.length;
    
    return [centerX, centerY];
}

export function distanceBetween2Points(point1, point2) {
	// console.log('p1: ', point1, ' p2: ', point2);
	return Math.sqrt(((point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1])))
}