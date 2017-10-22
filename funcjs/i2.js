let PI = Math.PI;

let svg = d3.select("svg");
// let WIDTH = document.,
// let HEIGHT = +svg.height;

let obj = document.getElementById("sbox");
let s_style = null;
if (window.getComputedStyle) {
    s_style = window.getComputedStyle(obj, null);    // 非IE
} else { 
    s_style = obj.currentStyle;  // IE
}
// alert("width=" + s_style.width + "\nheight=" + s_style.height);
let WIDTH = parseInt(s_style.width);
let HEIGHT = parseInt(s_style.height);
console.log(WIDTH,HEIGHT);
let COLOR = d3.scaleOrdinal(d3.schemeCategory20);
let R = 50;
let r = 20;
svg.append('g')
    .attr('class', 'schema');
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
        },
        {
            className: 'conference',
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

//TODO: Build a Class

function transPos(x, y){
    return {
        x: WIDTH*1.0/12*x,
        y: HEIGHT*1.0/9*y
    };
}

function getLayout(n){
    // x 12 y 9
    let pos = [];
    if (n === 8){
        pos.push(transPos(6, 5));
        pos.push(transPos(4, 5));
        pos.push(transPos(8, 5));
        pos.push(transPos(6, 1.5));
        pos.push(transPos(2.5, 3));
        pos.push(transPos(9.5, 3));
        pos.push(transPos(3, 7.5));
        pos.push(transPos(9, 7.5));
    }
    return pos;
}

function getSubLayout(pCoord, n){
    let px = pCoord.x;
    let py = pCoord.y;
    let disToCenter = (R+r)*0.8;
    let coords = [];
    //TODO: left or right, up or down
    for (let i = 0; i < n; ++i){
        let rad = i*1.0/n*2*PI;
        let dx = Math.cos(rad)*disToCenter;
        let dy = Math.sin(rad)*disToCenter;
        coords.push({x: px+dx, y: py+dy});
    }
    return coords;
}

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
                                color: COLOR(i+10)});
        });
        dataPoints.attrs.push(attrTmp);
    });
    return dataPoints;

}

function drawEntities(entity){
    let svgGroup =  svg.select('.schema')
    	.selectAll("g")
    	.data(entity)
    	.enter()
    	.append("g")
        .attr("class", "entity-group")
        .attr("id", (d)=>{
            return "entity-group-id"+d.id;
        });
    svgGroup.append("circle")
        .attr("class", "entity-shape")
        .attr("id", (d)=>{
            return "entity-shape-id"+d.id;
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
        });
    svgGroup.append("text")
        .attr("class", "entity-name")
        .attr("id", (d)=>{
            return d.id;
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
    return svgGroup;
}

function drawAttrs(attrs){

}

let points = loadDataPoints(dataSchema);
let svgEntity = drawEntities(points.entity);
let svgAttrs = drawAttrs(points.attrs);


// let fakedata = ['1','2','3','4','5','6','7','8'];
// let pos = getLayout(8);
// let s_entities = svg.append('g')
// 	.attr("class", "entity")
// 	.selectAll("circle")
// 	.data(fakedata)
// 	.enter()
// 	.append("circle")
// 	.attr("cx", (d, i)=>{
// 		console.log(d, i, pos[i].x);
// 		return pos[i].x;
// 	})
// 	.attr("cy", (d, i) =>{
// 		return pos[i].y;
// 	})
// 	.attr("r", R)
// 	.attr("fill", (d) => {
//         return COLOR(d);
//     });
//
// console.log(s_entities);