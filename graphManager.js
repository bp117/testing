import svgPanZoom from "svg-pan-zoom";
import * as d3 from "d3";
import dagreD3 from "dagre-d3";
import { createPopper } from '@popperjs/core';
import tippy from "tippy.js";

function getSpanId(span){
    return span["span.id"]+span["span.name"]+span["transaction.id"];
}

function getServiceId(span) {
    return span["service.name"];
}


/**
 * Renders the Directed Acyclic Graph for the experiment.
 */
export default class D3GraphManager {
    constructor(anchorNode, dataNodes, depNodes, gType, onTraceIdClick) {
        this.anchorNode = anchorNode;
        this.dataNodes = dataNodes;
        this.depNodes = depNodes;
        this.gType = gType;
        this.svgId = "svg_" + ("" + Math.random()).slice(2);
        this.isRunning = false;
        this.onTraceIdClick = onTraceIdClick;
        this.traceColors = {}
    }

    setTraceColors = (traceColors={})=>{
        this.traceColors = traceColors
    }

    /**
     * Generates a visual representation of a node (component including it's selected hosts)
     */
    getSVGNodeView = (item) => {
        let nodeContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");

        let compNameNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        compNameNode.setAttribute("x", 15);
        compNameNode.setAttribute("y", 15);
        compNameNode.style = "fill:#0d47a1; font-size:14px; font-weight:bold;";
        let name = item["span.name"]? item["span.name"] : item["service.name"];
        compNameNode.textContent = name+ "\u2003".repeat(2);


        let transIdNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
        transIdNode.setAttribute("x", 15);
        transIdNode.setAttribute("y", 40);
        transIdNode.style = "fill:#0d47a1; font-size:14px;";
        transIdNode.textContent = "transId: " + item["transaction.id"]+ "\u2003".repeat(2);


        let spanIdNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
        spanIdNode.setAttribute("x", 15);
        spanIdNode.setAttribute("y", 58);
        spanIdNode.style = "fill:#0d47a1; font-size:14px;";
        spanIdNode.textContent = "spanId: " + item["span.id"]+ "\u2003".repeat(2);


        let parentIdNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
        parentIdNode.setAttribute("x", 15);
        parentIdNode.setAttribute("y", 76);
        parentIdNode.style = "fill:#0d47a1; font-size:14px;";
        parentIdNode.textContent = "parentId: " + item["parent.id"]+ "\u2003".repeat(2);
        
        nodeContainer.append(compNameNode, transIdNode, spanIdNode, parentIdNode);

        return nodeContainer;
    };

    getSimpleSVGNode = (item)=>{
        let nodeContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");

        let compNameNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        compNameNode.setAttribute("x", 10);
        compNameNode.setAttribute("y", -25);
        compNameNode.style = `fill:${item["node.color"]?item["node.color"]:"#0d47a1"} !important; font-size:20px; font-weight:bold;`;
        let name = item["service.name"];
        compNameNode.textContent = name//+ "\u2003".repeat(2);
        

        let traceCountNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
        traceCountNode.setAttribute("x", 4.75*item["name-length-max"] - 5*item["name-diff-length"]);
        traceCountNode.setAttribute("y", 65);
        traceCountNode.style = "fill:whitesmoke !important; font-size:30px;";
        traceCountNode.textContent = (" ".repeat(name.length/2))+(item.traces||[]).length+(" ".repeat(name.length/2))//+ "\u2003".repeat(2);

        
        nodeContainer.append(compNameNode, traceCountNode);
        return nodeContainer;
    }

    arrangeNodeTextsToFixLength = ()=>{
        let longestText = "";
        for(let node of this.dataNodes){
            if(node["service.name"].length>longestText.length){
                longestText = node["service.name"];
            }
        }
        this.dataNodes = this.dataNodes.map(node=>{
            let text = node["service.name"];
            let diffLength = longestText.length - text.length;
            // text = (" ".repeat(diffLength/2))+text+(" ".repeat(diffLength/2));
            // node["service.name.fixed"] = text;
            node["name-diff-length"] = diffLength;
            node["name-length-max"] = longestText.length;
            return node;
        })
    }

    /**
     * Manages the creation of a new Dagre-D3 instance, nodes and edges.
     */
    processDagre = () => {
        if(this.gType == "ANALYZER"){ this.arrangeNodeTextsToFixLength() }

        this.dagre = new dagreD3.graphlib.Graph({ compound: true })
            .setGraph({ rankdir: this.gType=="ANALYZER"? "LR" : "BT", marginy: 80 })
            .setDefaultEdgeLabel(function() {
                return {};
            });

        this.dataNodes.forEach(item => {
            let traces = [...new Set((item.traces||[]).filter(t=>t.length>2).map(t=>t+"-->"+this.traceColors[t]))];
            if(this.gType == "ANALYZER"){
                let fillColor = item["node.color"];
                this.dagre.setNode(getServiceId(item), {
                    labelType: "svg",
                    shape: "circle",
                    style: `fill: ${fillColor?fillColor:"#0d47a1"} !important`,
                    width: 200,
                    height:200,
                    label:  this.getSimpleSVGNode(item),//"circle",
                    // label:  item["service.name"]+"("+item.traces.length+")",
                    class: (item.traces?"["+traces+"] ":"") + 
                            ("analyzer-node ") + 
                            (item.isSource? "source-node" : item.isTarget? "target-node" : "")
                });
            } else {
                this.dagre.setNode(getSpanId(item), {
                    labelType: "svg",
                    label: this.getSVGNodeView(item),
                    class: (item.traces?"["+item.traces.join(";")+"] ":"") + 
                            (item.isSource? "source-node" : item.isTarget? "target-node" : "")
                });
            }
        });
        this.depNodes.forEach(item => {
            if(this.gType == "ANALYZER"){
                this.dagre.setEdge(getServiceId( item.source ), getServiceId( item.target ), { curve: d3.curveBasis, class: item.isResultLink?"result-link":"" /*, class: "animation animation-medium density-high weight-medium" */});
            } else {
                this.dagre.setEdge(getSpanId( item.source ), getSpanId( item.target ), { curve: d3.curveBasis, class: item.isResultLink?"result-link":"" /*, class: "animation animation-medium density-high weight-medium" */});
            }
        });
    };

    /**
     * Sets up d3 and renders the configured graph
     */
    drawGraph = (hideSpans) => {
        this.processDagre(hideSpans);
        let render = new dagreD3.render();

        this.svgRoot = d3
            .select(this.anchorNode)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("id", this.svgId);

        let svgContainer = this.svgRoot
            .append("g")
            .attr("class", "main_graph")
            .attr("width", "100%")
            .attr("height", "100%");

        render(d3.select(`svg#${this.svgId}`).select("g.main_graph"), this.dagre);

        this.panZoomTrigger = svgPanZoom("#" + this.svgId, { controlIconsEnabled: true, maxZoom: 5 });
        this.panZoomTrigger.center().zoom( this.depNodes.length < 3? 0.4 : this.depNodes.length < 5 ? 0.7 : 0.85);
        
        setTimeout(() => {
            document.querySelectorAll("g.node rect.label-container").forEach(item => {
                if(this.gType != "ANALYZER"){
                    item.setAttribute("rx", "5" );
                    item.setAttribute("ry", "5" );
                }
            });
            document.querySelectorAll("g.node circle.label-container").forEach(item => {
                    item.setAttribute("r", "60" );
            });
            document.querySelectorAll("g.node.analyzer-node").forEach(item => {
                let tracesStr = [...item.classList].find(t=>t.startsWith("[")&&t.endsWith("]")) || "";
                tracesStr = tracesStr.replace(/\[|\]/g, ""); // remove [ and ]
                let traces = (tracesStr||"").split(";").map(t=>t.split("-->"));
                tippy(item, {
                    content:`<div class="item-traces-list">
                    <!--<div class="traces-title">complaintsservice traces</div>-->
                    ${traces.map(trace=>(`
                        <div class="traces-item" data-trace="${trace[0]}" style="color:${trace[1]}">${trace[0]}</div>
                    `)).join("")}
                </div>`,  //trace[0] is the trace id while trace[1] is the color
                    theme: "light-border",
                    trigger: "click",
                    allowHTML: true,
                    interactive: true,
                    appendTo: this.anchorNode
                });
            });
            document.body.onclick = (evt)=>{
                if(evt.target && evt.target.className == "traces-item"){
                    let traceId = evt.target.getAttribute("data-trace");
                    this.onTraceIdClick(traceId);
                }
            }
        }, 500);
    };
}
