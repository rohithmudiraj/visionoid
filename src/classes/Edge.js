import { getUniqueEdgeId } from "../helpers/util";

//this is line connecting 2 vertices or nodes.
export class Edge {

    constructor(id, firstNode, secondNode, weight,textContent) {
        this.id=id;
        this.uniqueId=Number(getUniqueEdgeId(id));
        this.weight = weight;
        this.firstNode = firstNode;
        this.secondNode = secondNode;
        this.textContent=textContent;
    }
}