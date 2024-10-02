import { useContext, useEffect, useRef, useState } from "react";
import { Button, Input, InputGroup } from "reactstrap";
import { Edge } from "../../classes/Edge";
import { Vertex } from "../../classes/Vertex";
import { GraphContext } from "../../contexts/GraphContext";
import { calculateSlope, distanceBetweenTwoCoordinates, EDGE_ID, VERTEX_ID } from "../../helpers/util";

const Canvas = () => {

    const vertexCount = useRef(1);
    const edgeCount = useRef(1);
    const EDGE_HEIGHT_SIZE = 12;
    const VERTEX_WIDTH_SIZE = 35;
    const VERTEX_HEIGHT_SIZE = 35;
    const isDoubleClicked = useRef(false);
    const isVertexDoubleClicked = useRef(false);
    const vertexSelected = useRef(null);
    const edgeSelected = useRef(null);
    const canvasRef = useRef();
    const { edges,vertices,isDirectedGraph } = useContext(GraphContext);
    const [property, setProperty] = useState('');
    const [value, setValue] = useState('');
    


    useEffect(()=> {

    },[isDirectedGraph])



    const highlightVertex = (vertex, shouldHighlight) => {
        if (shouldHighlight && edgeSelected.current) {
            toggleEdgeSelection(edgeSelected.current);
        }
        vertexSelected.current = shouldHighlight ? vertex : null;
        vertex.style.border = shouldHighlight ? "3px solid blue" : "none";
    }

    const deleteVertex = (vertex, e) => {
        isDoubleClicked.current = true;
        //remove edge from state
        vertices.current = vertices.current.filter(currentVertex => currentVertex.id != vertex.id);
        //delete if any edges exists from this vertex;
        //deleted edges from state
        const edgesToBeSaved=[];
        edges.current =  edges.current.map(currentEdge => {
            
            if(currentEdge.firstNode.id == vertex.id || currentEdge.secondNode.id == vertex.id){
                //delete From DOM
                document.getElementById(currentEdge.id).style.display="none";
            }
            else{
                edgesToBeSaved.push(currentEdge);
            }
        });
        edges.current = edgesToBeSaved;
        vertex.style.display = "none";
        e.stopPropagation();
        console.log(e);
        console.log('selected');
        setTimeout(() => {
            isDoubleClicked.current = false;
        }, 200)
    }

    const deleteEdge = (edge, e) => {
        isVertexDoubleClicked.current = true;
        edge.style.display = "none";
        e.stopPropagation();
        edges.current =  edges.current.filter(currentEdge => currentEdge.id !== edge.id);
        setTimeout(() => {
            isVertexDoubleClicked.current = false;
        }, 200)
    }


    const onVertexClick = (vertex,e)=> {
        e.stopImmediatePropagation();
        if (vertexSelected.current == vertex) {
            //if he clicked same vertex as selected,we gotta stop highlighting,
            highlightVertex(vertex, false);
        }
        else if (vertexSelected.current) {
            //if one vertex is already selected,and he is clicking this new vertex,we gotta draw new edge,else
            createEdge(vertexSelected.current, vertex);
            highlightVertex(vertexSelected.current, false);
        }
        else {
            //if no vertex is selected,highlight current vertex, and mark it as selected
            highlightVertex(vertex, true);
        }
    }


    //circle also called node or vertex
    const createVertex = (x, y) => {
        const vertex = document.createElement('div');
        vertex.id = VERTEX_ID(vertexCount.current);
        vertex.uniqueId = vertexCount.current;
        vertex.textContent = `${vertexCount.current}`;
        vertex.style.width = `${VERTEX_WIDTH_SIZE}px`;
        vertex.style.height = `${VERTEX_HEIGHT_SIZE}px`;
        vertex.style.backgroundColor = "black";
        vertex.style.position = "absolute";
        vertex.style.left = (x - 15) + 'px';
        vertex.style.top = (y - 75) + 'px';
        vertex.style.borderRadius = "50%";
        // vertex.style.border="2px solid brown"
        vertex.style.color = "white";
        vertex.style.textAlign = "center";
        // vertex.style.zIndex=1000;
        vertex.addEventListener('dblclick', (e) => {
            deleteVertex(vertex, e);
        })
        vertex.addEventListener('click', (e) => {
            onVertexClick(vertex,e)
        })
        vertexCount.current++;
        return vertex;
    }

    const drawVertex = (e) => {
        const clickerTimeoutId = setTimeout(() => {
            if (!isDoubleClicked.current && vertexSelected.current == null && !isVertexDoubleClicked.current) {
                const newVertex = createVertex(e.clientX, e.clientY);
                //saving vertex to state
                const tempVertex = new Vertex(newVertex.id, newVertex.textContent);
                vertices.current = [...vertices.current, tempVertex];
                //create p node inside new vertex to show text
                const pText = document.createElement("p");
                pText.style.position="relative";
                pText.style.top="-30px";
                pText.style.color="black";
                pText.textContent=newVertex.textContent;
                newVertex.textContent="";
                newVertex.appendChild(pText);
                canvasRef.current.appendChild(newVertex);
                // console.log('clicked');
            }
        }, 200)
        return () => {
            clearTimeout(clickerTimeoutId);
        }
    }


    const toggleEdgeSelection = (edge) => {
        const isEdgeAlreadySelected = edgeSelected.current;
        edge.style.border = isEdgeAlreadySelected ? "none" : "2px solid blue";
        edgeSelected.current = isEdgeAlreadySelected ? null : edge;
        if (!isEdgeAlreadySelected && vertexSelected.current) {
            highlightVertex(vertexSelected.current, false);
        }
    }


    const edgeAlreadyExists = (oneVertex,twoVertex)=> {
        let exists = false;
        edges.current.map(edge=> {
            if(edge.firstNode.id == oneVertex.id && edge.secondNode.id == twoVertex.id){
                exists= true;
            }
        });
        return exists;
    }

    //twoVertex is current selected edge
    //vertex goes from oneVertex to TwoEdge.so vertext initial point is from oneVertex
    const createEdge = (oneVertex, twoVertex) => {
        if(edgeAlreadyExists(oneVertex,twoVertex)){
            return;
        }
        const canvasHeight = canvasRef.current.offsetHeight;
        // console.log(canvasHeight);
        // console.log(oneVertex, twoVertex);
        const x1 = oneVertex.offsetLeft;
        const y1 = canvasHeight - oneVertex.offsetTop;
        const x2 = twoVertex.offsetLeft;
        const y2 = canvasHeight - twoVertex.offsetTop;
        // console.log(x1, y1, x2, y2);
        let slope = calculateSlope(x1, y1, x2, y2);
        // console.log(slope, y2 - y1, x2 - x1);
        slope = Math.atan(slope);
        if (x2 - x1 < 0) {
            if (y2 - y1 >= 0) {
                slope = slope + Math.PI;
            }
            else {
                slope = slope - Math.PI;
            }
        }
        let angle = (slope * (180 / Math.PI));
        // console.log('angle ', angle);
        // if(angle<0 && (x2-x1)<0){
        //     angle = 180+angle;
        // }
        angle = -1 * angle;
        // console.log(slope);
        const lengthOfLine = distanceBetweenTwoCoordinates(x1, y1, x2, y2);
        const edge = document.createElement('div');
        edge.id =  EDGE_ID(edgeCount.current);
        edge.uniqueId = vertexCount.current;
        edge.classList.add('edge');
        edge.style.width = lengthOfLine + 'px';
        edge.style.height = `${EDGE_HEIGHT_SIZE}px`;
        edge.style.left = (x1 + EDGE_HEIGHT_SIZE) + 'px';
        edge.style.top = (oneVertex.offsetTop + EDGE_HEIGHT_SIZE) + 'px';
        if(isDirectedGraph){
        edge.style.borderTopRightRadius = "50%";
        edge.style.borderBottomRightRadius = "50%";
        }
        // vertex.style.webkitTransform = 'rotate('+slope+'deg)'; 
        // vertex.style.mozTransform    = 'rotate('+slope+'deg)'; 
        // vertex.style.msTransform     = 'rotate('+slope+'deg)'; 
        // vertex.style.oTransform      = 'rotate('+slope+'deg)'; 
        edge.style.transform = `rotate(${angle}deg)`;
        edge.style.transformOrigin = "0 0";
        // vertex.style.transform=`rotateY(${slope}deg`;
        edge.addEventListener('dblclick', (e) => {
            deleteEdge(edge, e)
        })
        edge.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            toggleEdgeSelection(edge, e);
        })
        canvasRef.current.appendChild(edge);
        saveEdgeToState(edge.id, oneVertex, twoVertex);
        edgeCount.current++;
    }

    const saveEdgeToState = (id, vertex1, vertex2) => {
        const [firstVertex] = vertices.current.filter(vertex => vertex.id === vertex1.id);
        const [secondVertex] = vertices.current.filter(vertex => vertex.id === vertex2.id);

        if(isDirectedGraph){
            edges.current =  [...edges.current, new Edge(id, firstVertex, secondVertex, 0)];
        }
        else{
            edges.current =  [...edges.current, new Edge(id, firstVertex, secondVertex, 0)];
            edges.current =  [...edges.current, new Edge(id, secondVertex, firstVertex, 0)];
        }
    }

    const doubleClicked = (e) => {
        e.preventDefault();
        console.log('double', e);
    }


    const addProperty = () => {
        if (!property) {
            return;
        }
        console.log(edgeSelected.current);
        console.log(vertexSelected.current);
        if (edgeSelected.current) {
            edgeSelected.current[property] = value;
            
            edges.current  = edges.current.map(edge => {
                    if(edge.id == edgeSelected.current.id){
                        return {[property] : value,...edge};
                    }
                    else{
                        return edge;
                    }
                });          
        }
        else if (vertexSelected.current) {
            if(property==="textContent"){
                vertexSelected.current.firstChild.textContent=value;
            }
            else{
                vertexSelected.current[property] = value;
            }
            
                const updatedVertices = vertices.current.map(vertex => {
                    if (vertex.id == vertexSelected.current.id) {
                        return {...vertex,[property] : value };
                    }
                    else {
                        return vertex;
                    }
                });
                vertices.current =updatedVertices;
        }
        else {
            console.log('nothing selected')
        }
        setProperty('');
        setValue('');
    }
    return (
        <>
            <div
                ref={canvasRef}
                onClick={(e) => { drawVertex(e) }} onDoubleClick={(e) => { doubleClicked(e) }} className="canvas">
                <InputGroup className="inputs" onClick={(e) => e.stopPropagation()}>
                    <Input placeholder="Enter Property" value={property} onChange={(e) => setProperty(e.target.value)} />
                    <Input placeholder="Enter Value" value={value} onChange={(e) => setValue(e.target.value)} />
                    <Button color="primary" disabled={!(property && value)} onClick={() => addProperty()}>
                        Save
                    </Button>
                </InputGroup>
            </div>
        </>
    )
}

export default Canvas;