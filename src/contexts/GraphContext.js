import React, { useRef, useState } from "react";
import { ALGORITHMS, GRAPH_REPRESENTATION } from "../constants";

export const GraphContext = React.createContext();



export const GraphConfiguration = ({ children }) => {

    const [isWeightedGraph, setWeightedGraph] = useState(false);
    const [isDirectedGraph, setDirectedGraph] = useState(false);
    const [isbiPartiteGraph, setBiPartiteGraph] = useState(false);
    const [graphRepresentation, setGraphRepresentation] = useState(GRAPH_REPRESENTATION.ADJACENCY_MATRIX);
    const [algorithm,setAlgorithm] = useState(ALGORITHMS.BFS);
    const vertices = useRef([]);
    const edges = useRef([]);

    return (
        <>
           <GraphContext.Provider value={{
                isWeightedGraph, isDirectedGraph,
                isbiPartiteGraph, graphRepresentation
                , setWeightedGraph, setDirectedGraph
                , setBiPartiteGraph, setGraphRepresentation
                , edges,
                vertices,
                algorithm,setAlgorithm
            }}
                >
                { children }
            </GraphContext.Provider >
        </>
    );
}
