import { Injectable } from '@angular/core';
import {ForceDirectedGraph, Node, RunTimeLink,Link, Service, Database, DeploymentTimeLink, CommunicationPattern} from "./d3";
import { inspect } from 'util'; // for converting into json an object
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  graph: ForceDirectedGraph = null;

  private graphUrl = 'http://127.0.0.1:8000/graph/?format=json';  // URL to web api
  private graphUrlPost = 'http://127.0.0.1:8000/graph/';  // URL to web api
  private nodesUrl = 'http://127.0.0.1:8000/nodes/';  // URL to web api
  private analysisUrl = 'http://127.0.0.1:8000/graph/analyse/';  // URL to web api


  constructor(private http: HttpClient) {
    var nodes: Node[] = [];
    var links: Link[] = [];

    var s = new Service(1,'shipping');
    nodes.push(s);
    var o = new Service(1,'order');
    nodes.push(o);
    var cp = new CommunicationPattern(1,'rabbitmq');
    nodes.push(cp);
    var odb  = new Database(1, 'orderdb');
    nodes.push(odb);

    // links.push(new RunTimeLink(nodes[0], nodes[1]));
    // links.push(new DeploymentTimeLink(nodes[1], nodes[2]));

    s.addDeploymentTimeLink(odb);
    s.addRunTimeLink(odb);
    s.addRunTimeLink(cp);

    o.addRunTimeLink(s);
    o.addDeploymentTimeLink(s);
    o.addRunTimeLink(odb);
    o.addDeploymentTimeLink(odb);
    o.addRunTimeLink(cp);

    this.graph = new ForceDirectedGraph(nodes, links, { width:600, height:500 });
    console.log(this.graph);
   }

  getNodes():Node[]{
    return this.graph.getNodes();
  }

  getGraph():ForceDirectedGraph{
    return this.graph;
  }

  addNode(n:Node){
    this.graph.addNode(n);
  }

  addDeploymenttimeLink(source:Node, target:Node){
    this.graph.addDeploymentTimeLink(source, target);
  }

  addRunTimeLink(source:Node, target:Node){
    this.graph.addRunTimeLink(source, target);
  }

  updateAntipatternsOnNodes(json:string){
    this.getNodes().forEach((node)=>{
          console.log(node.name);
    })

  }

  exportToJSON(){
    return JSON.stringify(this.graph);
  }

  /** POST: add a new hero to the server */
  uploadGraph (): Observable<ForceDirectedGraph> {
    var t = this.exportToJSON();
    console.log(t);
    return this.http.post<ForceDirectedGraph>(this.graphUrlPost,t, httpOptions);
  }

  // download the graph stored into the server
  downloadGraph(): Observable<string> {
    return this.http.get<string>(this.graphUrl).pipe(
      tap(_ => this.log(`fetched graph`)),
      // catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }
  
  // download the graph stored into the server
  downloadNodes(): Observable<Node[]> {
    return this.http.get<Node[]>(this.nodesUrl).pipe(
      tap(_ => this.log(`fetched nodes`)),
      // catchError(this.handleError<Hero>(`getHero id=${id}`))
    );

  }

  getAnalysis():Observable<string> {
    return this.http.get<string>(this.analysisUrl).pipe(
      tap(_ => this.log(`reqeusted analysis`)),
      // catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(`GraphServiceService: ${message}`)
    // this.messageService.add(`HeroService: ${message}`);
  }


}