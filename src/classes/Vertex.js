import { getUniqueVertexId } from "../helpers/util";

export class Vertex {
    constructor(id,textContent){
        this.id=id;
        this.uniqueId=Number(getUniqueVertexId(id));
        this.textContent=textContent;
    }
}