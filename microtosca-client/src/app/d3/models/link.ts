import { Node } from './node';

// Implementing SimulationLinkDatum interface into our custom Link class
export class Link implements d3.SimulationLinkDatum<Node> {
    // Optional - defining optional implementation properties - required for relevant typing assistance
    index?: number;
    
    // Must - defining enforced implementation properties
    source: Node | string | number;
    target: Node | string | number;

    type: string; // runtime, deploymenttime
    constructor(source, target, type) {
        this.source = source;
        this.target = target;
        this.type = type;
    }

    // is called byt JSON.stringify()
    toJSON(key){
        if(this.target instanceof Node)
            return {'target': this.target.name, 'type':this.type};
        else
            return {'target': this.target, 'type':this.type};
    }    

}

export class RunTimeLink extends Link {
    constructor(source, target) { 
            super(source, target, "runtime"); 
    }
}

export class DeploymentTimeLink extends Link {
    constructor(source, target) { 
            super(source, target,'deploymenttime'); 
    }
}