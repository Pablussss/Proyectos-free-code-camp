let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let req = new XMLHttpRequest();

let data
let values = [];

let heightScale
let xScale
let xAxisScale
let yAxisScale

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {
    heightScale = d3.scaleLinear()
    // domain = coger rango de los valores
        .domain([0,d3.max(values, (item) => {
            return item[1];
        })])
        // dibujar sin sobrepasar los margenes
        .range([0, height - (2 * padding)])
    
    xScale = d3.scaleLinear()
        .domain([0, values.length - 1])
        .range([padding, width - padding])
    
    // convertir formato string a fecha ("1990-11-01" => 1990/11/01)
    let datesArray = values.map((item) => {
        return new Date(item[0])
    })

    console.log(datesArray)

    xAxisScale = d3.scaleTime()
        .domain([])
        .range()
}

let drawBars = () => {

}

let generateAxes = () => {

}

req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText);
    values = data.data;
    console.log(values)
    drawCanvas();
    generateScales();
    drawBars();
    generateAxes();
}
req.send();