let svg = d3.select("svg");

let dataSchema =
    [
        {
            className: 'paper',
            attrs:{
                title: 'paper title',
                conf: 'conf',
                time: '12.21'
            }
        },
        {
            className: 'author',
            attrs:{
                name: 'aus',
                age: '18'
            }
        },
        {
            className: 'institute',
            attrs:{
                name: 'ins'
            }
        }
    ];


let thHeight = 28;
let tWidth = 100;
let fontsize = '1em';
let ymargin = 50;
let xmargin = 50;
let yoffset = 20;
let textxmargin = 10;

dataSchema.forEach((d, i) => {
   console.log(i, d.className);
   for (let k in d.attrs){
       console.log(k, d.attrs[k]);
   }
});

drawSchema(dataSchema);

function drawSchema(data){
    let accuRaws = 0;
    data.forEach((d, i) => {
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


