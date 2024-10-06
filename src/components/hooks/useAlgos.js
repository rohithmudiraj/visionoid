import { useContext } from "react";
import { ALGORITHMS, GRAPH_REPRESENTATION } from "../../constants";
import { GraphContext } from "../../contexts/GraphContext";

const useAlgos = () => {

    const { algorithm, edges, vertices, isDirectedGraph, isWeighted, graphRepresentation } = useContext(GraphContext);

    const getFormattedVertex = (vertexId) => Number(vertexId.replace("VERTEX_", ""));


    const createAdjacencyMatrix = () => {
        console.log(vertices);
        console.log(edges)
        const matrix = [];
        let vertexCount = 0;
        vertices.current.map(vertex => {

            let curr_vertex = vertex.uniqueId;
            vertexCount = Math.max(vertexCount, curr_vertex);
        });
        vertexCount++;
        for (let i = 0; i < vertexCount; i++) {
            matrix[i] = new Array(vertexCount);
        }
        for (let i = 0; i < edges.current.length; i++) {
            let { firstNode, secondNode, weight } = edges.current[i];
            const first = firstNode.uniqueId;
            const second = secondNode.uniqueId;
            if (!isWeighted) {
                weight = 0;
            }
            else if (isWeighted && (weight == null || weight == undefined)) {
                throw Error(`Weight is Empty for edge from vertex ${first} to ${second}`);
            }
            if (isDirectedGraph) {
                matrix[first][second] = weight;
            }
            else {
                matrix[first][second] = weight;
                matrix[second][first] = weight;
            }
        }
        console.log(matrix);
        return matrix;
    }

    const createAdjacencyList = () => {
        const adjacencyList = [];
        let verticesWithEdges = [];
        for (let i = 0; i < edges.current.length; i++) {
            const tempEdge = edges.current[i];
            const { firstNode, secondNode } = tempEdge;
            const { uniqueId: firstnodeId } = firstNode;
            const { uniqueId: secondNodeId } = secondNode;
            if (!verticesWithEdges.includes(firstnodeId)) {
                verticesWithEdges.push(firstnodeId);
            }
            if (!verticesWithEdges.includes(secondNodeId)) {
                verticesWithEdges.push(secondNodeId);
            }
            if (adjacencyList[firstnodeId] === undefined) {
                adjacencyList[firstnodeId] = [secondNodeId];
            }
            else {
                adjacencyList[firstnodeId].push(secondNodeId);
            }
        }
        //pushing edgeless vertices so that we can traverse
        for (let i = 0; i < vertices.current.length; i++) {
            if (!verticesWithEdges.includes(vertices.current[i].uniqueId)) {
                adjacencyList[vertices.current[i].uniqueId] = [];
            }

        }

        console.log(adjacencyList);
        return adjacencyList;
    }


    const processAlgorithm = async () => {
        switch (algorithm) {
            case ALGORITHMS.BFS:
                await bfs();
                resetCanvasColors();
                return bfs;
            case ALGORITHMS.DFS:
                await dfs();
                resetCanvasColors();
                return dfs;
                break;
            case ALGORITHMS.HAS_PATH_DFS:
                checkIfHasPathUsingDfs();
                resetCanvasColors();
                break;
            case ALGORITHMS.HAS_PATH_BFS:
                checkIfHasPathUsingBfs();
                resetCanvasColors();
                break;

            case ALGORITHMS.CONNECTED_COMPONENTS_COUNT_DFS:
                countConnectedComponentsUsingDfs();
                resetCanvasColors();
                break;

            case ALGORITHMS.CONNECTED_COMPONENTS_COUNT_BFS:
                countConnectedComponentsUsingBfs();
                resetCanvasColors();
                break;
            default:
                throw new Error("No Algorithm Selected");
        }
    }


    const bfsMatrix = async () => {
        const matrix = createAdjacencyMatrix();
        const visited = [];
        for (let i = 0; i < vertices.current.length; i++) {
            const vertex = vertices.current[i];
            const queue = [];
            const vertexId = vertex.uniqueId;
            if (visited[vertexId]) {
                continue;
            }
            queue.push(vertexId);
            while (queue.length > 0) {
                const first_Vertex_id = queue.shift();
                const [firstVertexElement] = vertices.current.filter(vertex => vertex.uniqueId == first_Vertex_id);
                await animateElement(firstVertexElement.id, true);
                visited[first_Vertex_id] = -1;
                //highlight first vertex;
                console.log(firstVertexElement);
                for (let j = 0; j < matrix[first_Vertex_id]?.length; j++) {
                    const weight = matrix[first_Vertex_id][j];
                    //if weight ==0 ,then there is connecting edge btw two vertices
                    if (weight == 0) {
                        if (!visited[j]) {
                            console.log('animating', first_Vertex_id, j);
                            await animatePreviousNodeToCurrentNode(first_Vertex_id, j);
                            console.log('animating done', first_Vertex_id, j);
                            visited[j] = first_Vertex_id;
                            queue.push(j);
                        }
                    }
                }
            }
        }
    }

    const bfsList = async () => {
        let previousVisitedNode = null;
        const list = createAdjacencyList();
        console.log(vertices);
        console.log(edges);
        const visited = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i] == undefined || visited[i]) {
                continue;
            }
            //we are processing vertexId i
            const vertexId = i;
            //maintaining queue to visit all child elements of  vertex i.
            const queue = [];
            //
            queue.push(vertexId);
            const [firstVertexElement] = vertices.current.filter(vertex => vertex.uniqueId == vertexId);
            //we animate 
            await animateElement(firstVertexElement.id, true);
            visited[vertexId] = -1;
            while (queue.length > 0) {
                const firstVertex = queue.shift();

                if (visited[firstVertex] && visited[firstVertex] !== -1) {
                    await animatePreviousNodeToCurrentNode(visited[firstVertex], firstVertex);
                }
                console.log(firstVertex);
                if (list[firstVertex] !== undefined) {
                    for (const vertex of list[firstVertex]) {
                        if (!visited[vertex]) {
                            visited[vertex] = firstVertex;
                            queue.push(vertex);
                        }
                    }
                }
            }
        }

        console.log('bfs traversal with list is done.');
    }


    const dfs = async () => {
        if (GRAPH_REPRESENTATION.ADJACENCY_MATRIX == graphRepresentation) {
            await dfsMatrix();
        }
        else if (GRAPH_REPRESENTATION.ADJACENCY_LIST == graphRepresentation) {
            await dfsList();
        }
        else {
            throw new Error("Lazy Guy has not written code yet");
        }
    }

    const dfsMatrix = async () => {
        const matrix = createAdjacencyMatrix();
        const visited = [];
        for (let i = 0; i < vertices.current.length; i++) {
            const curr_vertex = vertices.current[i];
            const curr_vertex_id = curr_vertex.uniqueId;
            if (!visited[curr_vertex_id]) {
                await animateElement(curr_vertex.id, true);
            }
            visited[curr_vertex_id] = true;
            await recursiveDFS(curr_vertex_id, matrix, visited);
        }

    }

    const recursiveDFS = async (currentId, matrix, visited) => {
        for (let i = 0; i < matrix[currentId].length; i++) {
            if (matrix[currentId][i] == 0 && !visited[i]) {
                visited[i] = true;
                await animatePreviousNodeToCurrentNode(currentId, i);
                await recursiveDFS(i, matrix, visited);
            }
        }
    }

    const dfsList = async () => {

        const list = createAdjacencyList();
        const visited = [];
        for (let i = 0; i < vertices.current.length; i++) {
            const curr_vertex = vertices.current[i];
            const curr_vertex_id = curr_vertex.uniqueId;
            if (!visited[curr_vertex_id]) {
                await animateElement(curr_vertex.id, true);
            }
            visited[curr_vertex_id] = true;
            await recursiveDFSList(curr_vertex_id, list, visited);
        }

    }

    const recursiveDFSList = async (currentId, list, visited) => {
        for (let i = 0; i < list[currentId].length; i++) {
            const connectingOtherVertexId = list[currentId][i];
            if (!visited[connectingOtherVertexId]) {
                visited[connectingOtherVertexId] = true;
                await animatePreviousNodeToCurrentNode(currentId, connectingOtherVertexId);
                await recursiveDFSList(connectingOtherVertexId, list, visited);
            }
        }
    }


    const animatePreviousNodeToCurrentNode = async (fromVertexId, toVertexId) => {
        const [fromVertex] = vertices.current.filter(vertex => vertex.uniqueId == fromVertexId);
        const [toVertex] = vertices.current.filter(vertex => vertex.uniqueId == toVertexId);
        const [connectingEdge] = edges.current.filter(edge => edge.firstNode.id == fromVertex.id && edge.secondNode.id == toVertex.id);
        console.log("going from", fromVertex.id);
        console.log("connecting edge", connectingEdge);
        console.log("going to", toVertex.id);

        await animateElement(fromVertex.id, true);
        await animateElement(connectingEdge.id);
        await animateElement(toVertex.id, true);
    }

    const animateElement = (id, isVertex) => {
        const element = document.getElementById(id);
        return new Promise((resolve, reject) => {
            try {
                const onAnimatationEnd = (event) => {
                    console.log(element);
                    element.classList.remove('alerts-border');
                    console.log(element);
                    element.style.webkitAnimation = 'none';
                    setTimeout(() => {
                        element.style.webkitAnimation = '';
                    }, 10);

                    console.log(`removing class for element ${element.id}`);
                    element.removeEventListener('animationend', onAnimatationEnd);
                    resolve();
                };
                console.log(`adding class for element ${element.id}`);
                element.classList.add('alerts-border');
                element.addEventListener('animationend', onAnimatationEnd);
                // element.addEventListener('animationcancel',()=> `${element.id} event is cancelled`);
                if (isVertex) {
                    element.style.backgroundColor = "grey";
                }
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    const resetCanvasColors = () => {
        vertices.current.map(({ id }) => {
            document.getElementById(id).style.backgroundColor = "black";
        });
        edges.current.map(({id})=> {
            document.getElementById(id).style.backgroundColor = "brown";
        })
    }

    const bfs = async () => {
        if (GRAPH_REPRESENTATION.ADJACENCY_MATRIX == graphRepresentation) {
            await bfsMatrix();
        }
        else if (GRAPH_REPRESENTATION.ADJACENCY_LIST == graphRepresentation) {
            await bfsList();
        }
        else {
            throw new Error("Not Yet Written");
        }

    }


    const checkIfHasPathUsingDfs = () => {
        const startVertex = vertices.current.find(vertex => vertex.startNode == "true");
        const endVertex = vertices.current.find(vertex => vertex.endNode == "true");

        if (!startVertex || !endVertex) {
            throw new Error('startNode and endNode should be given');
        }
        if (GRAPH_REPRESENTATION.ADJACENCY_MATRIX == graphRepresentation) {
            checkIfHasPathUsingDFSMatrix(startVertex, endVertex);
        }
        else if (GRAPH_REPRESENTATION.ADJACENCY_LIST == graphRepresentation) {
            checkIfHasPathUsingDFSList(startVertex, endVertex);
        }
        else {
            throw new Error("Lazy Developer has not written yet");
        }
    }

    const checkIfHasPathUsingDFSMatrix = (startVertex, endVertex) => {
        const matrix = createAdjacencyMatrix();
        //using stack
        const stack = [startVertex.uniqueId];
        const prev = [];
        const visited = [];
        let pathFound = false;
        while (stack.length > 0) {
            const currentVertexId = stack.shift();
            visited[currentVertexId] = true;
            for (let i = 0; i < matrix[currentVertexId].length && !pathFound; i++) {
                if (matrix[currentVertexId][i] != 0 || visited[i] == true) {
                    continue;
                }
                prev[i] = currentVertexId;
                if (i == endVertex.uniqueId) {
                    console.log("Path Exists");
                    pathFound = true;
                }
                else {
                    // visited[i]=true;
                    stack.push(i);
                }
            }
        }

        if (pathFound) {
            drawConnectingPath(startVertex, endVertex, prev);
        }
        else {
            window.alert("No Path Exists");
        }
    }

    const drawConnectingPath = (startVertex, endVertex, prev) => {
        let curr = prev[endVertex.uniqueId];
        let fullPath = [endVertex.uniqueId];

        while (curr != undefined) {
            fullPath = [curr, ...fullPath];
            console.log(curr);
            curr = prev[curr];
        }
        for (let i = 0; i < fullPath.length - 1; i++) {
            drawPreviousNodeToCurrentNodePath(fullPath[i], fullPath[i + 1]);
        }

        console.log(fullPath);
    }

    const drawPreviousNodeToCurrentNodePath = (fromVertexId, toVertexId, color) => {
        const [fromVertex] = vertices.current.filter(vertex => vertex.uniqueId == fromVertexId);
        const [toVertex] = vertices.current.filter(vertex => vertex.uniqueId == toVertexId);
        const [connectingEdge] = edges.current.filter(edge => edge.firstNode.id == fromVertex.id && edge.secondNode.id == toVertex.id);
        document.getElementById(fromVertex.id).style.backgroundColor = "turquoise";
        document.getElementById(connectingEdge.id).style.backgroundColor = "black";
        document.getElementById(toVertex.id).style.backgroundColor = "turquoise";
    }

    const checkIfHasPathUsingDFSList = (startVertex, endVertex) => {
        const list = createAdjacencyList();

        let stack = [startVertex.uniqueId];
        const prev = [];
        let pathFound = false;

        while (stack.length > 0) {
            const currentElementId = stack.shift();
            for (let i = 0; i < list[currentElementId].length && !pathFound; i++) {
                const neighbourElementId = list[currentElementId][i];
                if (prev[neighbourElementId] == true) {
                    continue;
                }
                prev[neighbourElementId] = currentElementId;
                if (neighbourElementId == endVertex.uniqueId) {
                    pathFound = true;
                }
                else {
                    stack = [neighbourElementId, ...stack];
                }
            }
        }

        if (pathFound) {
            drawConnectingPath(startVertex, endVertex, prev);
        }
        else {
            window.alert('No Path exists');
        }

    }


    const checkIfHasPathUsingBfs = ()=> {
        const startVertex = vertices.current.find(vertex => vertex.startNode == "true");
        const endVertex = vertices.current.find(vertex => vertex.endNode == "true");

        if (!startVertex || !endVertex) {
            throw new Error('startNode and endNode should be given');
        }
        if (GRAPH_REPRESENTATION.ADJACENCY_MATRIX == graphRepresentation) {
            checkIfHasPathUsingBFSMatrix(startVertex, endVertex);
        }
        else if (GRAPH_REPRESENTATION.ADJACENCY_LIST == graphRepresentation) {
            checkIfHasPathUsingBFSList(startVertex, endVertex);
        }
        else {
            throw new Error("Lazy Developer has not written yet");
        }
    }


    const checkIfHasPathUsingBFSMatrix = (startVertex, endVertex)=> {
        const matrix = createAdjacencyMatrix();
        let queue = [startVertex.uniqueId];
        const prev = [];
        const visited=[];
        let pathFound = false;
        while(queue.length>0){
            const currentElementId = queue.pop();
            visited[currentElementId]=true;
            for(let i =0;i<matrix[currentElementId].length;i++){
                const hasEdge = matrix[currentElementId][i];
                if(hasEdge!=0 || visited[i]){
                    continue;
                }
                prev[i]=currentElementId;
                if(i == endVertex.uniqueId){
                    pathFound=true;
                }
                else{
                    queue.push(i);
                }
            }
        }
        if(pathFound){
            drawConnectingPath(startVertex, endVertex, prev);
        }
        else{
            window.alert("path doesn't exist");
        }
    }


    const checkIfHasPathUsingBFSList = (startVertex, endVertex)=> {
        const list = createAdjacencyList();
        let queue = [startVertex.uniqueId];
        const prev = [];
        const visited = [];
        let pathFound = false;
        while(queue.length>0){
            const currentElementId = queue.pop();
            visited[currentElementId]=true;
            for(let i =0;i<list[currentElementId].length;i++){
                const neighbourElementId = list[currentElementId][i];
                if(visited[neighbourElementId]){
                    continue;
                }
                prev[neighbourElementId]=currentElementId;
                if(neighbourElementId == endVertex.uniqueId){
                    pathFound=true;
                }
                else{
                    queue.push(neighbourElementId);
                }

            }
        }
        if(pathFound){
            drawConnectingPath(startVertex, endVertex, prev);
        }
        else{
            window.alert("path doesn't exist");
        }
    }



    const countConnectedComponentsUsingDfs = ()=> {
        if (GRAPH_REPRESENTATION.ADJACENCY_MATRIX == graphRepresentation) {
            countConnectedComponentsUsingDfsAdjacentMatrix();
        }
        else if (GRAPH_REPRESENTATION.ADJACENCY_LIST == graphRepresentation) {
            countConnectedComponentsUsingDfsAdjacentList();
        }
        else {
            throw new Error("Lazy Developer has not written yet");
        }
    }

    const countConnectedComponentsUsingDfsAdjacentMatrix = ()=> {
        const matrix = createAdjacencyMatrix();
        let count =0;
        const visited = [];
        for(let i=0;i<matrix.length;i++){
            if(visited[i]==true || !vertices.current.some(vertex=>vertex.uniqueId==i) ){
                continue;
            };
            count++;
            const queue =[];
            queue.push(i);
            while(queue.length>0){
                const curr =queue.pop();
                for (let index = 0; index < matrix[curr].length; index++) {
                    const hasConnection = matrix[curr][index] ==0;
                    if(!visited[index] && hasConnection){
                        queue.push(index);
                        visited[index]=true;
                    }
                }
            }
        }
        window.alert(count);
    }

    const countConnectedComponentsUsingDfsAdjacentList = ()=> {
        const list = createAdjacencyList();
        let count =0;
        const visited = [];
        for(let i=0;i<list.length;i++){
            if(visited[i]==true || !vertices.current.some(vertex=>vertex.uniqueId==i) ){
                continue;
            };
            count++;
            const queue =[];
            queue.push(i);
            while(queue.length>0){
                const curr =queue.pop();
                for (let index = 0; index < list[curr].length; index++) {
                    const neighbour = list[curr][index];
                    if(!visited[neighbour]){
                        queue.push(neighbour);
                        visited[neighbour]=true;
                    }
                }
            }
        }
        window.alert(count);
    }

    const countConnectedComponentsUsingBfs = ()=> {
        if (GRAPH_REPRESENTATION.ADJACENCY_MATRIX == graphRepresentation) {
            countConnectedComponentsUsingBfsAdjacentMatrix();
        }
        else if (GRAPH_REPRESENTATION.ADJACENCY_LIST == graphRepresentation) {
            countConnectedComponentsUsingBfsAdjacentList();
        }
        else {
            throw new Error("Lazy Developer has not written yet");
        }
    }

    const countConnectedComponentsUsingBfsAdjacentMatrix = ()=> {
        const matrix = createAdjacencyMatrix();
        let count =0;
        const visited = [];
        for(let i=0;i<matrix.length;i++){
            if(visited[i]==true || !vertices.current.some(vertex=>vertex.uniqueId==i) ){
                continue;
            };
            count++;
            let stack =[];
            stack.push(i);
            while(stack.length>0){
                const curr =stack.shift();
                for (let index = 0; index < matrix[curr].length; index++) {
                    const hasConnection = matrix[curr][index] ==0;
                    if(!visited[index] && hasConnection){
                        stack = [index,...stack];
                        visited[index]=true;
                    }
                }
            }
        }
        window.alert(count);
    }

    const countConnectedComponentsUsingBfsAdjacentList = ()=> {
        const list = createAdjacencyList();
        let count =0;
        const visited = [];
        for(let i=0;i<list.length;i++){
            if(visited[i]==true || !vertices.current.some(vertex=>vertex.uniqueId==i) ){
                continue;
            };
            count++;
            let stack =[];
            stack.push(i);
            while(stack.length>0){
                const curr =stack.shift();
                for (let index = 0; index < list[curr].length; index++) {
                    const neighbour = list[curr][index];
                    if(!visited[neighbour]){
                        stack = [neighbour,...stack];
                        visited[neighbour]=true;
                    }
                }
            }
        }
        window.alert(count);
    }

    return { processAlgorithm };

}

export default useAlgos;