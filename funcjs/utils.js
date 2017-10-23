function Queue() {
    // attributes
    let items = [];

    // methods
    this.push = (e) => {
        items.push(e);
    };

    this.pop = () => {
        return items.shift();
    };

    this.front = () => {
        return items[0];
    };

    this.back = () => {
        return items[items.length-1];
    };

    this.size = () => {
        return items.length;
    };

    this.print = () => {
        console.log(items.toString());
    };

    this.isEmpty = () => {
        return items.length === 0;
    }
}


let cloneObj = function(obj){
    let str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else if(window.JSON){
        str = JSON.stringify(obj);
        newobj = JSON.parse(str);
    } else {
        for(let i in obj){
            newobj[i] = typeof obj[i] === 'object' ?
                cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
};
