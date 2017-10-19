let svg = d3.select("svg"),
    WIDTH = +svg.attr("width"),
    HEIGHT = +svg.attr("height");
let COLOR = d3.scaleOrdinal(d3.schemeCategory20);

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

function transPos(x, y){
    return {
        x: WIDTH*1.0/12*x,
        y: HEIGHT*1.0/9*y
    };
}

function getPositions(n){
    // x 12 y 9
    pos = [];
    if (n === 8){
        pos.push(transPos(6, 5.5));
        pos.push(transPos(4, 5.5));
        pos.push(transPos(9, 5.5));
        pos.push(transPos(6, 1.5));
        pos.push(transPos(2, 3.5));
        pos.push(transPos(10, 3.5));
        pos.push(transPos(4, 7.5));
        pos.push(transPos(8, 7.5));
    }
    return pos;
}

let pos = getPositions(8);
let s_entities =