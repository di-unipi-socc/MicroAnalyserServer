
import {Refactoring} from "../refactor/refactoring";
import * as joint from 'jointjs';

export class Smell {

    name: string;
    refactorings: Refactoring[];
    linksCause:joint.shapes.microtosca.RunTimeLink[];

    constructor(name:string) {
        this.name = name;
        this.linksCause = [];
        this.refactorings = [];
    }

    addLinkBasedCause(link){
        this.linksCause.push(link);
    }

    getLinkBasedCauses(){
        return this.linksCause;
    }

    addRefactoring(refactoring:Refactoring){
        this.refactorings.push(refactoring);
    }
    
    getRefactorings():Refactoring[]{
        return this.refactorings;
    }

    getDescription():string{
        var descr = "";
        this.getLinkBasedCauses().forEach(causa=>{
            descr +=  `${causa['type']} interaction from  ${causa['source']} to ${causa['target']} \n`;
        })
        return descr;
    }
}