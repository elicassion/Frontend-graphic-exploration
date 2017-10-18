let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
let color = d3.scaleOrdinal(d3.schemeCategory20);

let dataSchema ={
    entity: [
        {
            className: 'paper',
            attrs:[
                'paper_title',
                'paper_conf',
                'paper_time',
                'paper_attr4',
                'paper_attr5',
                'paper_attr6'
            ]
        },
        {
            className: 'author',
            attrs:[
                'author_name',
                'author_age'
            ]
        },
        {
            className: 'institute',
            attrs:[
                'institute_name'
            ]
        }
    ],
    relation: [
        {
            source: 'author',
            target: 'institute',
            name: 'works in'
        },
        {
            source: 'author',
            target: 'paper',
            name: 'write'
        }
    ]
};


let thHeight = 28;
let tWidth = 100;
let fontsize = '1em';
let ymargin = 50;
let xmargin = 50;
let yoffset = 20;
let textxmargin = 10;

// dataSchema.forEach((d, i) => {
//    console.log(i, d.className);
//    for (let k in d.attrs){
//        console.log(k, d.attrs[k]);
//    }
// });

// drawSchema(dataSchema);

function drawSchema(data){
    let accuRaws = 0;
    data.entity.forEach((d, i) => {
        svg.append("rect")
            .attr("x", xmargin)
            .attr("y", i*ymargin + accuRaws*thHeight + yoffset)
            .attr("width", tWidth)
            .attr("height", thHeight)
            .attr("fill", "steelblue");
        svg.append("text")
            .attr("x", xmargin + textxmargin)
            .attr("y", i*ymargin + accuRaws*thHeight + thHeight/2 + yoffset)
            .attr("width", tWidth)
            .attr("height", thHeight)
            .text(d.className)
            .style('font-size', fontsize);
        ++accuRaws;
        let j = 0;
        for (let k in d.attrs){
            svg.append("rect")
                .attr("x", xmargin)
                .attr("y", i*ymargin + (accuRaws+j)*thHeight + yoffset)
                .attr("width", tWidth)
                .attr("height", thHeight)
                .attr("fill", "green");
            svg.append("text")
                .attr("x", xmargin + textxmargin)
                .attr("y", i*ymargin + (accuRaws+j)*thHeight + thHeight/2 + yoffset)
                .attr("width", tWidth)
                .attr("height", thHeight)
                .text(d.attrs[k])
                .style('font-size', fontsize);
            ++j;
        }
        accuRaws += j;
    });
}


function transSchema(data){
    let nodes = [];
    let links = [];
    let number = 0;
    data.entity.forEach((d, i)=>{
        nodes.push({id: d.className,
                    name: d.className,
                    class: 'entity',
                    r: 80});
        // let curfa = number;
        // ++number;
        d.attrs.forEach((attr, j)=>{
            nodes.push({id: attr,
                        class: 'attr',
                        r: 40,
                        name: attr});
            links.push({source: d.className,
                        target: attr,
                        distance: 10});
            // ++number;
        })
    });
    // data.relation.forEach((d, i) => {
    //     d.strenth=10;
    //     console.log(d);
    //     links.push(d);
    // });
    return {nodes: nodes, links: links, relation: data.relation};
}


let transedData = transSchema(dataSchema);
let nodes = transedData.nodes;
let links = transedData.links;

let simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-100))
    .force("link", d3.forceLink()
                    .id((d)=>{ return d.id;})
                    .distance(100)
                    )
    .force("center", d3.forceCenter(width/2, height/2));


let svg_nodes = svg.append("g")
    .attr("class","nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    // .append("g")
    // .attr("class", "node")
    .append("circle")
    .attr("class", (d)=>{
        return d.class;
    })
    .attr("id", (d)=>{
        return d.name;
    })
    .attr("r", (d) =>{
        return d.r;
    })
    .attr("fill", (d) => {
        return color(Math.round(Math.random()*20));
    });

// svg_nodes.append("text")
//     .attr("x", 12)
//     .attr("dy", ".35em")
//     .text((d) => {
//         return d.name;
//     });


let svg_links = svg.append("g")
    .attr("class","attr-links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", (d) => {
        return 3;
    });

let svg_texts = svg.append("g")
    .attr("class","labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .style("fill", "black")
    .style("text-anchor", "middle")
    .text(function(d){
        return d.name;
    });

// console.log(svg_nodes);

relation = transedData.relation;
let svg_relations = svg.append("g")
    .attr("class", "relations")
    .selectAll("line")
    .data(relation)
    .enter()
    .append("line")
    .attr("class", "relation")
    .attr("stroke-width", 3);


simulation.nodes(nodes)
    .on("tick", ticked);


function ticked() {
    // console.log("tick");
    svg_links
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    svg_nodes
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    svg_texts
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });

    svg_relations
        .attr("x1", function(d) {console.log(d3.select("#"+d.source)); return d3.select("#"+d.source).cx;})
        .attr("y1", function(d) {return d3.select("#"+d.source).cy;})
        .attr("x2", function(d) {return d3.select("#"+d.target).cx;})
        .attr("y2", function(d) {return d3.select("#"+d.target).cy;})
}

simulation.force("link")
    .links(links);

console.log(svg_nodes);
