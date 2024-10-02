export const distanceBetweenTwoCoordinates = (x1,y1,x2,y2)=> {

    return Math.pow(Math.pow((x2-x1),2)+Math.pow((y2-y1),2),(1/2))
}


export const calculateSlope = (x1,y1,x2,y2)=> {
    return (y2-y1)/(x2-x1);
}

export const  radians_to_degrees= (radians)=> 
{
  // Store the value of pi.
  var pi = Math.PI;
  // Multiply radians by 180 divided by pi to convert to degrees.
  return radians * (180/pi);
}

export const VERTEX_ID = (id)=> `VERTEX_${id}`; 
export const EDGE_ID = (id) => `EDGE_${id}`;

export const getUniqueEdgeId = (id)=> id.replace("EDGE_","");
export const getUniqueVertexId = (id)=>id.replace("VERTEX_","");