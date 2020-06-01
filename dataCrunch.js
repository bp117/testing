
// /**
//  * 
//  * @param {Array} dataSet 
//  * @param {string} initialTransactionId 
//  */
// export function constructServiceDepPath(dataSet, initialTransactionId){
//     let links = [], nodes = [];

//     function findAndLinkFromSpan(currentTransId, currentServiceSpan, rootSpan, links, nodes) {
//         let childSpans = dataSet.filter(t=>t["parent.id"] == rootSpan["span.id"] && rootSpan["span.id"] != null);
            
//         childSpans.forEach(childSpan=>{
//             if(childSpan["span.id"] == null && childSpan["transaction.id"] !== currentTransId) {
//                 links.push({
//                     source: currentServiceSpan,
//                     target: childSpan
//                 });
//                 nodes.push(childSpan);
//                 constructDependencies(childSpan["transaction.id"]);
//             } else {
//                 findAndLinkFromSpan(currentTransId, currentServiceSpan, childSpan, links, nodes)
//             }
//         });
//     }

//     function constructDependencies(currentTransId) {
//         //0. Get all the spans for this transaction from the input data.
//         let transactionSpans = dataSet.filter(t=>t["transaction.id"] == currentTransId);

//         //1. Find the service or initial span of this transaction
//         let serviceSpan = transactionSpans.find( t => t["span.id"] == null );
//         // nodes.push(serviceSpan);
        
//         //2. Find other spans participating in this transaction (excluding the service span above)
//         let otherSpans = transactionSpans.filter( t => t["span.id"] != null );

//         //3. Connect particpating (other) spans to the service span (in 1)
//         otherSpans.forEach(span=>{
//             findAndLinkFromSpan(currentTransId, serviceSpan, span, links, nodes);
//         });
//     }

//     //
//     let initialServiceSpan = dataSet.filter(t=>t["transaction.id"] == initialTransactionId).find( t => t["span.id"] == null );
//     console.log("INITIAL SERVICE SPAN ", initialServiceSpan, ", DATASET ", dataSet, " INITIAL TRANS ID ", initialTransactionId)
//     if(initialServiceSpan)
//         nodes.push(initialServiceSpan);

//     constructDependencies(initialTransactionId)

//     return {links, nodes};
// }


// /**
//  * 
//  * @param {Array} inputData 
//  * @param {string} initialTransactionId 
//  */
// export function constructServiceDepPath(inputData, initialTransactionId){
//     let links = [], nodes = [];

//     function constructBacktrace(transactionId) {
//         //0. Get all the spans for this transaction from the input data.
//         let transactionSpans = inputData.filter(t=>t["transaction.id"] == transactionId);

//         //1. Find the service or initial span of this transaction
//         let serviceSpan = transactionSpans.find( t => t["span.id"] == null );
        
//         console.log("CURRENTLY ON ", transactionId, " SERVICE SPAN ", serviceSpan)
//         if(serviceSpan["parent.id"]){
//             console.log("CHECKING ", serviceSpan)
//             //4. Locate a span in the input data who's span id is the parent id of the service span
//             let linkSpans = inputData.filter(t=> t["span.id"] == serviceSpan["parent.id"] && t["transaction.id"] !== serviceSpan["transaction.id"]);
//             linkSpans.forEach(linkSpan=>{
//                 if(linkSpan){
//                     if(linkSpan["span.id"] == null && linkSpan["transaction.id"] && linkSpan["transaction.id"] !== transactionId){
//                         links.push({
//                             target: linkSpan,
//                             source: serviceSpan
//                         });
//                         nodes.push(linkSpan);
//                     } 
                    
//                     if(linkSpan["transaction.id"] && linkSpan["transaction.id"] !== serviceSpan["transaction.id"]) {
//                         constructBacktrace(linkSpan["transaction.id"]);
//                     }
//                 }
//             })
//         } 
//     }

//     //0. Get all the spans for this transaction from the input data.
//     let initialServiceSpan = inputData.filter(t=>t["transaction.id"] == initialTransactionId).find( t => t["span.id"] == null );
//     nodes.push(initialServiceSpan);

//     constructBacktrace(initialTransactionId)

//     return {links, nodes};
// }

function getSpanId(span){
    return span["span.id"]+span["span.name"]+span["transaction.id"];
}

function linkIsEqual(link1, link2){
    return getSpanId(link1.source) == getSpanId(link2.source) && getSpanId(link1.target) == getSpanId(link2.target);
}

/**
 * 
 * @param {Array} inputData 
 * @param {string|Array} initialTransactionId 
 */
export function constructBacktracePath(inputData, initialTransactionIds){
    let links = [], nodes = [];
    if(Array.isArray(initialTransactionIds)){
        for(let initialTransactionId of initialTransactionIds){
            let { links:l, nodes:n } = constructBacktracePath(inputData, initialTransactionId);
            l = l.filter(link=>{
                return !links.find(mLink=>linkIsEqual(mLink, link));
            });
            n = n.filter(node=>{
                return !nodes.find(mNode=>getSpanId(mNode)==getSpanId(node));
            });
            links.push(...l);
            nodes.push(...n);
        }
        return {links, nodes};
    }else {
        return _constructBacktracePath(inputData, initialTransactionIds);
    }
}

function _constructBacktracePath(inputData, initialTransactionId){
    let links = [], nodes = [];

    function constructBacktrace(transactionId) {
        //0. Get all the spans for this transaction from the input data.
        let transactionSpans = inputData.filter(t=>t["transaction.id"] == transactionId);

        //1. Find the service or initial span of this transaction
        let serviceSpans = transactionSpans.filter( t => t["span.id"] == null );
        
        serviceSpans.forEach(serviceSpan=>{
            //2. Find other spans participating in this transaction (excluding the service span above)
            let otherSpans = transactionSpans.filter( t => t["span.id"] != null );
    
            //3. Connect particpating (other) spans to the service span (in 1)
            otherSpans.forEach(span=>{
                links.push({
                    target: serviceSpan,
                    source: {...span, isSpan:true}
                    //you might want to differentiate other the transactions from here
                });
                nodes.push({...span, isSpan:true});
            });
    
            if(serviceSpan && serviceSpan["parent.id"]){
                nodes.push({...serviceSpan, isSource:transactionId==initialTransactionId});
                //4. Locate a span in the input data who's span id is the parent id of the service span
                let linkSpan = inputData.find(t=> t["span.id"] == serviceSpan["parent.id"] && t["transaction.id"] !== serviceSpan["transaction.id"]);
                if(linkSpan){
                    links.push({
                        target: {...linkSpan, isSpan:true},
                        source: serviceSpan,
                        // isResultLink: true
                    });
                    
                    let nextTransactioId = linkSpan["transaction.id"];
                    constructBacktrace(nextTransactioId);
                }
            } else if(serviceSpan){
                nodes.push({...serviceSpan, isTarget:true});
            }
        })
    }

    constructBacktrace(initialTransactionId)

    return {links, nodes};
}

export function constructServiceDepPath(rangeData, serviceName, traceColors={}) {
    let links = [], nodes = [], nodesTraceCount={};
    Object.keys(rangeData).forEach(traceId=>{
        let traceData = rangeData[traceId]||[];
        let serviceTransId = (traceData.find(t=>t["service.name"]==serviceName)||{})["transaction.id"];
        if(serviceTransId){
            let backtrace = constructBacktracePath(traceData, serviceTransId);
            backtrace = trimSpans(backtrace.links, backtrace.nodes);
            backtrace.nodes.forEach(node=>{
                nodesTraceCount[node["service.name"]] = [...(nodesTraceCount[node["service.name"]]||[]), traceId];
                if(node.isTarget){
                    node["node.color"] = traceColors[traceId]
                }
            });
            links.push(...backtrace.links);
            nodes.push(...backtrace.nodes);
        }
    });

    nodes = nodes.map(node=>{
        node.traces = nodesTraceCount[node["service.name"]] || [];
        return node;
    });

    return {links, nodes};
}

function trimSpans(links, nodes){
    let mNodes = [];

    nodes.forEach(node=>{
        if(node.isSpan){
            let thisSpanLinks = links.filter(link=>{
                return getSpanId(link.source) == getSpanId(node) || 
                        getSpanId(link.target) == getSpanId(node);
            });
            let pivotLink;
            links = links.filter(link=>{
                pivotLink = getSpanId(link.target) == getSpanId(node)? link : pivotLink;
                return getSpanId(link.source) != getSpanId(node) && 
                        getSpanId(link.target) != getSpanId(node);
            });

            if(pivotLink){
                thisSpanLinks.forEach(link=>{
                    if(getSpanId(link.target)!==getSpanId(node)){
                        let newLink = {source:pivotLink.source, target:link.target}
                        links.push(newLink);
                    }
                });
            }
        }
        else {
            mNodes.push(node);
        }
    });

    return {links, nodes:mNodes};
}