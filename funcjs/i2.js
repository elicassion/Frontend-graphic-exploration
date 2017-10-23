// import Queue from "utils.js"
let dataSchema ={
    entity: [
        {
            className: 'Paper',
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
            className: 'Author',
            attrs:[
                'author_name',
                'author_age'
            ]
        },
        {
            className: 'Institute',
            attrs:[
                'institute_name'
            ]
        },
        {
            className: 'Conference',
            attrs:[
                'conference_location',
                'conference_series',
                'official_conference_url',
                'under_cs',
                'start_date',
                'end_data',
                'conference_location',
                'abstract_registration_date',
                'submission_deadline',
                'notification_due_date',
                'final_version_due_date'
            ]
        },
        {
            className: 'Affiliation',
            attrs:[
                'league_name'
            ]
        },
        {
            className: 'Field',
            attrs:[

            ]
        },
        {
            className: 'Venue',
            attrs:[
                'name'
            ]
        },
        {
            className: 'Journal',
            attrs:[

            ]
        }
    ],
    relation: [
        {
            source: 'Author',
            target: 'Institute',
            id: 'works in',
            name: 'works in'
        },
        {
            source: 'Author',
            target: 'Paper',
            id: 'write',
            name: 'write'
        }
    ]
};

//TODO: Build a Class


/*------------------------------------------
**************Draw SVG Related**************
------------------------------------------*/
let PI = Math.PI;
let svg = d3.select("svg");

let obj = document.getElementById("sbox");
let s_style = null;
if (window.getComputedStyle) {
    s_style = window.getComputedStyle(obj, null);    // 非IE
} else {
    s_style = obj.currentStyle;  // IE
}

let WIDTH = parseInt(s_style.width);
let HEIGHT = parseInt(s_style.height);
console.log(WIDTH,HEIGHT);
let COLOR = d3.scaleOrdinal(d3.schemeCategory20);
let R = 50;
let r = 20;
svg.append('g')
    .attr('class', 'schema');
svg.append('g')
    .attr('class', 'drag-links');
svg.append('g')
    .attr('class', 'drag-tmp');
let lineGenerator = d3.line()
    .x(function(d) {
        return d[0]
    })
    .y(function(d) {
        return d[1];
    });

/* Transform ratio coordinate to Real Coordinate */
function transPos(x, y){
    return {
        x: WIDTH*1.0/12*x,
        y: HEIGHT*1.0/9*y
    };
}

/* Gain Layout of Main Entities */
function getLayout(n){
    // x 12 y 9
    let pos = [];
    if (n === 8){
        pos.push(transPos(6, 6));
        pos.push(transPos(4, 5));
        pos.push(transPos(8, 5));
        pos.push(transPos(6, 2));
        pos.push(transPos(2.5, 3));
        pos.push(transPos(9.5, 3));
        pos.push(transPos(3, 7.5));
        pos.push(transPos(9, 7.5));
    }
    return pos;
}


/* Gain Layout of **Attrs**  */
function getSubLayout(pCoord, n){
    let px = pCoord.x;
    let py = pCoord.y;
    let disToCenter = (R+r)*1.4;
    let coords = [];
    //TODO: left or right, up or down
    for (let i = 0; i < n; ++i){
        let rad = i*1.0/n*2*PI + 15.0/180*PI;
        let dx = Math.cos(rad)*disToCenter;
        let dy = Math.sin(rad)*disToCenter;
        coords.push({x: px+dx, y: py+dy});
    }
    return coords;
}

/* Convert Schema to Data Points on SVG */
function loadDataPoints(schema){
    let dataPoints = {entity:[], attrs:[]};
    console.log(schema.entity.length);
    let entityPos = getLayout(schema.entity.length);
    console.log(entityPos);
    schema.entity.forEach((d, i) => {
        //TODO: color schema
        let attrPos = getSubLayout(entityPos[i],d.attrs.length);
        dataPoints.entity.push({name: d.className,
                                id: d.className,
                                x: entityPos[i].x,
                                y: entityPos[i].y,
                                color: COLOR(i)});
        let attrTmp = {parent: d.className, data:[]};
        d.attrs.forEach((e, j) => {
            attrTmp.data.push({name: e,
                                id: e,
                                x: attrPos[j].x,
                                y: attrPos[j].y,
                                color: COLOR(i+8)});
        });
        dataPoints.attrs.push(attrTmp);
    });
    return dataPoints;

}

/* Draw Shapes and Texts */
function drawEntities(data){
    let entity = data.entity;
    let attrs = data.attrs;
    let svgGroup =  svg.select('.schema')
    	.selectAll("g")
    	.data(entity)
    	.enter()
    	.append("g")
        .attr("class", "entity-tuple")
        .attr("id", (d)=>{
            return "entity-tuple-id-"+d.id;
        });
    svgGroup.append("circle")
        .attr("class", "entity-shape")
        .attr("id", (d)=>{
            return "entity-shape-id-"+d.id;
        })
    	.attr("cx", (d)=>{
    		// console.log(d, i, pos[i].x);
    		return d.x;
    	})
    	.attr("cy", (d) =>{
    		return d.y;
    	})
    	.attr("r", R)
    	.attr("fill", (d) => {
            return d.color;
        })
        .call(dragDrawLinkEvent);
    svgGroup.append("text")
        .attr("class", "entity-name")
        .attr("id", (d)=>{
            return "entity-name-id-"+d.id;
        })
        .attr("x", (d)=>{
            return d.x;
        })
        .attr("y", (d)=>{
            return d.y;
        })
        .text((d)=>{
            return d.name;
        });

    attrs.forEach((d, i)=>{
        let pName = d.parent;
        let dt = d.data;
        let pg = d3.select("#entity-tuple-id-"+pName)
            .append("g")
            .attr("class", "entity-attr-group")
            .attr("id", "entity-attr-group-id-"+pName)
            .selectAll("g")
            .data(dt)
            .enter()
            .append("g")
            .attr("class", "entity-attr-tuple")
            .attr("id", (e, j)=>{
                return "entity-attr-tuple-id-"+e.id;
            });
        pg.append("circle")
            .attr("class", "entity-attr-shape")
            .attr("id", (e)=>{
                return "entity-attr-shape-id-"+e.id;
            })
            .attr("cx", (e)=>{
                // console.log(d, i, pos[i].x);
                return e.x;
            })
            .attr("cy", (e) =>{
                return e.y;
            })
            .attr("r", r)
            .attr("fill", (e) => {
                return e.color;
            });
        pg.append("text")
            .attr("class", "entity-attr-name")
            .attr("id", (e)=>{
                return "entity-attr-name-id-"+e.id;
            })
            .attr("x", (e)=>{
                return e.x;
            })
            .attr("y", (e)=>{
                return e.y;
            })
            .text((e)=>{
                return e.name;
            });
    });


    return svgGroup;
}

/* Execute */
let points = loadDataPoints(dataSchema);
let svgEntity = drawEntities(points);
/******************************************/



/*-----------------------------------------
**************Link Algorithm***************
------------------------------------------/

/* Convert attr and relation into Paths */
function loadPath(schema){
    let paths = {};
    // path: object
    // path[source]: array of object
    // path[source] = [{target:name,
    //                  relation: (parent/attr/subject/object),
    //                  relation_description_id: 'works_in',
    //                  relation_description_name: '工作'}]

    schema.relation.forEach((d, i)=>{
        if (paths[d.source] === undefined)
            paths[d.source] = [];
        if (paths[d.target] === undefined)
            paths[d.target] = [];
        paths[d.source].push({
            target: d.target,
            relation: 'link',
            relation_description_id: d.id,
            relation_description_name: d.name
        });

        paths[d.target].push({
            target: d.source,
            relation: 'link',
            relation_description_id: '^'+d.id,
            relation_description_name: 'passive_' + d.name
        });

    });

    schema.entity.forEach((d, i)=>{
        d.attrs.forEach((e, j)=>{
            if (paths[d.className] === undefined)
                paths[d.className] = [];
            if (paths[e] === undefined)
                paths[e] = [];
            paths[d.className].push({
                target: e,
                relation: 'attr',
                relation_description_id: null,
                relation_description_name: null});
            paths[e].push({
                target: d.className,
                relation: 'parent',
                relation_description_id: null,
                relation_description_name: null
            });
        })
    });

    return paths;
}
function shortestPath(paths, s, t){
    // paths: paths, see above in function loadPath(schema)
    // s: source, node id
    // t: target, node id
    // return: [node id]

    // BFS here
    let q = new Queue();
    q.push({node: s, hop: 0, p: []});
    while (!q.isEmpty()) {
        let cur = q.pop();
        console.log(cur.node);
        if (cur.node == t) {
            cur.p.push(t);
            return cur.p;
        }
        paths[cur.node].forEach((d, i) => {
            let tmpp = cloneObj(cur.p);
            tmpp.push(cur.node);
            q.push({
                node: d.target,
                hop: cur.hop + 1,
                p: tmpp
            });
        })
    }
}

/* Execute Load Path */
let paths = loadPath(dataSchema);
// console.log('PATHS:', paths);
/* Test for shortest path */
// console.log(shortestPath(paths, 'Paper', 'Institute'));
// console.log(shortestPath(paths, 'Author', 'Conference'));
/*----------------------------------------*/





/* Events */
function toggleAttrs(e){
    // let targetEntity = e;
    // console.log(e.target.id);
    let strs = e.target.id.split("-");
    let id = strs[strs.length-1];
    console.log(id);
    $("#entity-attr-group-id-" + id).toggle(2000);
}
// selection.on("click", function() {
//     if (d3.event.defaultPrevented) return; // click suppressed
//     console.log("clicked!");
// });
$(".entity-tuple").click((e) => {
    // console.log(e);
    if (d3.event.defaultPrevented) return;
    toggleAttrs(e);
});

let curLinks = [];
let curStartNode = undefined;
let curEndNode = undefined;
let dragsx = undefined;
let dragsy = undefined;


let dragDrawLinkEvent  = d3.behavior.drag()
    .on("dragstart", beginDragDrawLink)
    .on("drag", onDragDrawLink)
    .on("dragend", endDragDrawLink);

function beginDragDrawLink(t) {
    dsx = t.cx;
    dsy = t.cy;
    let g = d3.select(".dag-tmp");
    g.append("path")
        .attr("class", "drag-link-tmp")
        .attr("id", "drag-link-tmp-id-"+(curLinks.length-1).toString())
        .attr("stroke, '#ccc")
        .attr('stroke-width', '2')
        .attr('fill', 'none');
}

function onDragDrawLink(t) {
    let x = d3.event.x;
    let y = d3.event.y;
    let tmpLineData = [[dsx, dsy], [x, y]];
    d3.select("#drag-link-tmp-id-"+(curLinks.length-1).toString())
        .attr('d', lineGenerator(tmpLineData));
}

function endDragDrawLink(t) {

}

