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


let fakedata = ['1','2','3','4','5','6','7','8'];
let pos = getLayout(8);
let s_entities = svg.append('g')
	.attr("class", "entity")
	.selectAll("circle")
	.data(fakedata)
	.enter()
	.append("circle")
	.attr("cx", (d, i)=>{
		console.log(d, i, pos[i].x);
		return pos[i].x;
	})
	.attr("cy", (d, i) =>{
		return pos[i].y;
	})
	.attr("r", 40)
	.attr("fill", (d) => {
        return COLOR(d);
    });

console.log(s_entities);