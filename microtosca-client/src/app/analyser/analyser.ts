import { Refactoring } from "./refactoring";
import * as joint from 'jointjs';
import { GraphService } from "../graph.service";

export class Analyser {


    nodes = {};

    constructor(private gs: GraphService) {
        this.nodes = {};
        console.log("ANALYSER CREATEA");
        this.gs.getGraph().ticker.subscribe((evt)=>{
            console.log("analyser received evt");
            console.log(evt);
        })
    }

    //TODO: implement the analysis at client side.
    analyse() {

    }

    //TODO: move this method on the analysis.service (to be created)
    addNodeAnalysis(analysis_json: string) {

        analysis_json['nodes'].forEach(node => {
            let jnode: joint.dia.Cell = this.gs.getGraph().getNode(node['name'])
            console.log(node);
            var n = {
                'label': this.gs.getGraph().getNameOfNode(jnode),
                collapsedIcon: 'fa-folder',
                expandedIcon: 'fa-folder-open',
                selectable: false
            };
            // if(principles.length == 0)
            //   n['type'] = "ok"; // type used to show the green icon
            // else
            //   n['children'] = [];
            this.nodes[jnode.id] = n;
        });
        console.log(this.nodes);
    }

}
