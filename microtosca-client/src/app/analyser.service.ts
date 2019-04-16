import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';

import { ANode } from "./analyser/node";
import { AGroup } from "./analyser/group";

import { GraphService } from './graph.service';
import { Principle } from './model/principles';
import { Smell } from './analyser/smell';
import { MergeServicesRefactoring, AddMessageRouterRefactoring, AddMessageBrokerRefactoring, AddServiceDiscoveryRefactoring, UseTimeoutRefactoring, AddCircuitBreakerRefactoring } from "./refactor/refactoring";
import { CommunicationPattern } from "./model/communicationpattern";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class AnalyserService {


  private analysisUrl = environment.serverUrl + '/v2/graph/analyse/';

  analysednodes: ANode[] = [];   // list of analysed node;
  analysedgroups: AGroup[] = []; // list of analysed groups;

  constructor(private http: HttpClient, private gs: GraphService) { }

  // Remove the graphics "smells" showed in the graph.
  clearSmells() {
    this.gs.getGraph().getNodes().forEach(node => {
      node.resetSmells();
    });
  }

  getCommunicationPatterns() {
    return this.http.get<any>('assets/data/communicationpatterns.json')
      .toPromise()
      .then(res => <CommunicationPattern[]>res.data);
  }

  getPrinciplesToAnalyse() {
    return this.http.get<any>('assets/data/principles.json')
      .toPromise()
      .then(res => (<Principle[]>res.data).filter(principle => principle.id == 2 || principle.id == 3 || principle.id == 4))
  }

  getPrinciplesAndSmells() {
    return this.http.get<any>('assets/data/principles.json')
      .toPromise()
      .then(res => <Principle[]>res.data);
  }

  getSmells() {
    return this.http.get<any>('assets/data/smells.json')
      .toPromise()
      .then(res => <Smell[]>res.data);
  }

  getSmellById(id: number) {
    return this.http.get<any>('assets/data/smells.json')
      .toPromise()
      .then(res => (<Smell[]>res.data).find(smell => 5 == 5))//smell.id === id))
  }


  runRemoteAnalysis(principles: string[]): Observable<Boolean> {
    const params = new HttpParams().set('principles', principles.join()); // principles to be analysed: principles separated by commma

    // TODO: the analysi should send allso the ingore once, ingore always smell for the nodes.
    // Myabe instead of a get is s POST operation.
    return this.http.get(this.analysisUrl, { params })
      .pipe(
        map((response: Response) => {
          this.analysednodes = [];
          // TODO: saved the analysed node ?? in order to hav ethe history of the analysis.
          this.clearSmells(); // removed the smell in the graph view

          response['nodes'].forEach((node) => {
            var anode = this.buildAnalysedNodeFromJson(node);
            this.analysednodes.push(anode);
            // this.analysednodes.push(ANode.fromJSON(node));
          });
          this.analysedgroups = [];
          response['groups'].forEach((group) => {
            this.analysedgroups.push(AGroup.fromJSON(group));
          });
          console.log(this.analysedgroups);
          return true;
        }),
        tap(_ => this.log(`Send analysis`),
        ),
        catchError((e: Response) => throwError(e))
      );
  }

  buildAnalysedNodeFromJson(data: Object) {
    var anode: ANode = new ANode(data['name']);

    data['smells'].forEach((smellJson) => {
      let smell: Smell = new Smell(smellJson.name);

      smellJson['cause'].forEach((cause) => {
        var source = this.gs.getGraph().findNodeByName(cause['source']);
        var target = this.gs.getGraph().findNodeByName(cause['target']);
        var link = this.gs.getGraph().getLinkFromSourceToTarget(source, target);
        smell.addLinkBasedCause(link);
      });

      

        // if (smell['refactorings']) {
      smellJson['refactorings'].forEach((refactoring) => {
            let refactoringName = refactoring['name'];
            let refactoringAction;
            switch (refactoringName) {
              case "Add Message Router":
                refactoringAction = new AddMessageRouterRefactoring(this.gs.getGraph(), smell);
                break;
              case "Add Message Broker":
                refactoringAction = new AddMessageBrokerRefactoring(this.gs.getGraph(), smell);
                break;
              case "Add Service Discovery":
                refactoringAction = new AddServiceDiscoveryRefactoring(this.gs.getGraph(), smell);
                break;
              case "Add Circuit Breaker":
                refactoringAction = new AddCircuitBreakerRefactoring(this.gs.getGraph(), smell);
                break;
              case "Use Timeouts":
                refactoringAction = null;// new UseTimeoutRefactoring(this.gs.getGraph(), smell);
                break;
              case "Merge services":
                refactoringAction = new MergeServicesRefactoring(this.gs.getGraph(), smell)
                break;
                  // refactoringAction = new MergeServicesRefactoring(this.gs.getGraph(), smell.getLinkBasedCauses());
              default:
                break;
            }
            if (refactoringAction)
              smell.addRefactoring(refactoringAction);
          });
  
        anode.addSmell(smell);
      });
    return anode;
  }

  getAnalysedNodeByName(name: string) {
    return this.analysednodes.find(node => {
      return name === node.name;
    });
  }

  /** Log a AnalyserService message with the MessageService */
  private log(message: string) {
    console.log(`AnalyserService: ${message}`)
    // this.messageService.add(`HeroService: ${message}`);
  }
}
