import { useContext } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { GraphContext } from "../../contexts/GraphContext";
import { GRAPH_REPRESENTATION } from "../../constants";

const Settings = () => {

    const { isWeightedGraph, isDirectedGraph,
        isbiPartiteGraph, graphRepresentation, setWeightedGraph, setDirectedGraph
        , setBiPartiteGraph, setGraphRepresentation } = useContext(GraphContext);
    return (
        <Form>
            <FormGroup
                check
                inline
            >
                <Input type="radio"  onClick={()=>setGraphRepresentation(GRAPH_REPRESENTATION.ADJACENCY_MATRIX)}  checked={graphRepresentation===GRAPH_REPRESENTATION.ADJACENCY_MATRIX}
                />
                <Label check>
                    Adjacency Matrix
                </Label>
            </FormGroup>
            <FormGroup
                check
                inline
               
            >
                <Input type="radio"  onClick={()=>setGraphRepresentation(GRAPH_REPRESENTATION.ADJACENCY_LIST)}  checked={graphRepresentation===GRAPH_REPRESENTATION.ADJACENCY_LIST} />
                <Label check>
                    Adjacency List
                </Label>
            </FormGroup>
            <FormGroup
                check
                inline
                onClick={()=>setWeightedGraph(weight=>!weight)} 
            >
                <Input type="checkbox" checked={isWeightedGraph} />
                <Label check>
                    Weighted Graph
                </Label>
            </FormGroup>
            <FormGroup
                check
                inline
                onClick={()=>{setDirectedGraph(direct=>!direct)}}
            >
                <Input type="checkbox"  checked={!isDirectedGraph} />
                <Label check>
                    Undirected Graph
                </Label>
            </FormGroup>
        </Form>
    )
}
export default Settings;