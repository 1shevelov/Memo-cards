import { PointData } from "pixi.js";

// Pixi.PointData {x: number, y: number} holds coordinates in pixels
export type SizeData = { width: number; height: number }; // for absolut sizes in pixels, values >= 0 only
export type VectorData = { dx: number; dy: number }; // for shift of coordinates in pixels

// returns direction from center to point
// in the form of vector with +/- 1 for values
// returns random vector if point is in the center
export function calculateQuadrant(point: PointData, screenSize: SizeData): VectorData {
    let dx = point.x - screenSize.width / 2;
	if (dx === 0)
		Math.round(Date.now() * 0.05) % 2 === 0 ? dx = -1 : 1; // randomizing direction of vector
    let dy = point.y - screenSize.height / 2;
	if (dy === 0)
		Math.round(Date.now() * 0.05) % 2 === 0 ? dy = -1 : 1;

    if (dx < 0)
        if (dy < 0)
			return { dx: -1, dy: -1 }; // top left
		else
		    return { dx: -1, dy: +1 }; // bottom left
	else
	    if (dy < 0)
			return { dx: +1, dy: -1 }; // top right
		else
			return { dx: +1, dy: +1 }; // bottom right
}