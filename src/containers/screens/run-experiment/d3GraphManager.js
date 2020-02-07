import svgPanZoom from "svg-pan-zoom";
import * as d3 from "d3";

export default class D3GraphManager{
    constructor(anchorNode, dataNodes, depNodes){
        this.anchorNode = anchorNode;
        this.dataNodes = dataNodes;
        this.depNodes = depNodes;
        this.svgId = "svg_"+((""+Math.random()).slice(2))
        this.isRunning = false
    }

    _getTranslation = (transform) => {
        transform = transform.replace("translate", "").replace("(", "").replace(")", "").split(",");
        return [+transform[0], +transform[1]];
    }

    _getPositionConnector = (name) => {
        let nodePos = this._getTranslation(this.svgRoot.select("."+name).attr("transform"))
        let connPos = [Number(this.svgRoot.select(".connector-"+name).attr("cx")), Number(this.svgRoot.select(".connector-"+name).attr("cy"))]
        return {x: nodePos[0]+connPos[0], y:nodePos[1]+connPos[1]}
    }

    _repeatDepAnimation = (dotConnector) => {
        if(!dotConnector) return;
        dotConnector.transition()
        .ease(d3.easeSin)
        .duration(1000)
        .attr("cx", d=>this._getPositionConnector(d.target).x)
        .attr("cy", d=>this._getPositionConnector(d.target).y)
        .transition()
        .duration(0)
        .attr("cx", d=>this._getPositionConnector(d.source).x)
        .attr("cy", d=>this._getPositionConnector(d.source).y)
        .on("end", ()=>this._repeatDepAnimation(dotConnector))
    }

    _addDependencyLine = ()=>{
        let lineConnector = this.svgRoot.selectAll(".line-connecting")
            .data(this.depNodes)
            .enter()

        lineConnector.append("line")
            .attr("class", "line-connecting")
            .attr("x1", d => this._getPositionConnector(d.source).x)
            .attr("y1", d => this._getPositionConnector(d.source).y)
            .attr("x2", d => this._getPositionConnector(d.target).x)
            .attr("y2", d => this._getPositionConnector(d.target).y)
            .style("stroke-width", 2)
            .style("stroke", `rgba(0,0,220, ${this.isRunning?"0.5":"0"})`)  //
            .style("stroke-dasharray", "3,3")

        let dotConnector = lineConnector.append("circle")
            .attr("class", "dot-connecting")
            .attr("r", 5)
            .attr("cx", d=>this._getPositionConnector(d.source).x)
            .attr("cy", d=>this._getPositionConnector(d.source).y)
            .style("fill", `rgba(220,0,0,${this.isRunning?"0.5":"0"})`)  //

        return dotConnector
    }

    drawGraph = ()=>{
        d3.select(`svg#${this.svgId}`).remove();
        this.svgRoot = d3.select(this.anchorNode)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "98%")
                .attr("id", this.svgId)
                .append("g")
                .attr("class", "main_graph");

        if(!this.dataNodes || this.dataNodes.length == 0) return;        
        let gNode = this.svgRoot.selectAll("g")
                .data(this.dataNodes)
                .enter()
                .append("g")
                .attr("class", d=> "node "+d.name)
                .attr("id", d=> d[0])
                .attr("transform", d => "translate(100, "+(d.nodeCount*200)+")")
                
        let rectNode = gNode.append("rect")
                .attr("height", 100)
                .attr("width", 250)
                .style("fill", "rgba(0,0,0,0")
                .style("stroke", "#2378ae")
        
        let cyNodeConnector = gNode.append("circle")
                .attr("class", d=>"connector-"+d.name)
                .attr("r", 5)
                .attr("cx", 125)
                .attr("cy", d=>d.nodeCount==0? 100 : 0 )
                .style("fill", `rgb(0,0,0, ${this.isRunning?"1":"0"})`)  //
        
        let textNode = gNode.append("text")
                .attr("x", 100)
                .attr("y", 20)
                .style("font-size", "13px")
                .style("font-weight", "bold")
                .text(d=>d.name)

        let gHost = gNode.selectAll("g")
                .data(d=> d.hosts)
                .enter()
                .append("g")
                .attr("class", d=>d.hostname)

        let cyHost = gHost.append("circle")
                .attr("r", 10)
                .attr("cx", 20)
                .attr("cy", d=>40 + d.hostCount*25 )
                .style("fill", d=> !this.isRunning? "rgba(220,220,0,0.8)" : d.status == "success"?"rgba(0,220,0,0.8":d.status=="failure"?"rgba(220,0,0,0.8)":"rgba(220,220,0,0.8)")
                .style("stroke-width", 2)
                .style("stroke", "#0000ff")

        let txtHost = gHost.append("text")
                .attr("x", 35)
                .attr("y", d=>45 + d.hostCount*25)
                .text(d=>d.hostname.replace(/_/g, "."))
                .style("font-size", "12px")
        
        let dotConnector = null;
        if(this.depNodes && this.depNodes.length>0){
            dotConnector = this._addDependencyLine()
            this._repeatDepAnimation(dotConnector);
        }
        
        let dragHandler = d3.drag() 
            .on("drag", ()=>{
                d3.select(this)
                    .attr("transform", 'translate('+(d3.event.x-100)+','+(d3.event.y-50)+')')
            
            this.svgRoot.selectAll(".line-connecting")
                .transition()
                .duration(0)
                .attr("x1", d=>this._getPositionConnector(d.source).x)
                .attr("y1", d=>this._getPositionConnector(d.source).y)
                .attr("x2", d=>this._getPositionConnector(d.target).x)
                .attr("y2", d=>this._getPositionConnector(d.target).y)

                this._repeatDepAnimation(dotConnector);
        });

        dragHandler(this.svgRoot.selectAll(".node"))
        this.panZoomTrigger = svgPanZoom("#"+this.svgId, {controlIconsEnabled:true, maxZoom:5 })
        
        this.panZoomTrigger.zoom(this.zoomScaleVal || 0.8)
        this.panPointVal && this.panZoomTrigger.pan(this.panPointVal)


        this.panZoomTrigger.setOnPan((point)=>{
            this.panPointVal = point;
        });
        this.panZoomTrigger.setOnZoom((scale)=>{
            this.zoomScaleVal = scale;
        })
    }

    updateGraph = (dataNodes, depNodes, isRunning)=>{
        this.dataNodes = dataNodes;
        this.depNodes = depNodes
        this.isRunning = isRunning;

        this.drawGraph();
    }

}