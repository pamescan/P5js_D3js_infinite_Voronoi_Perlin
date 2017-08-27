/** dimensiones para el canvas */

var viewNChunckV = 5
var viewNChunckH = 5
var chunksize = 100;

/** dimensiones para el calculo de las zonas */
var calcWidthMax
var calcHeightMax
var calcWidthMin
var calcHeightMin

var viewoffsetx
var viewoffsety

var seed = 1;
var noisesql = 100;




var chunkposx = 0;
var chunkposy = 0;
var chunkposxround = 1;
var chunkposyround = 1;

var posx = 0;
var posy = 0;
var vertices

function setup() {
    var canvasSizex = (viewNChunckH + 1) * chunksize
    var canvasSizey = (viewNChunckV + 1) * chunksize
    viewoffsetx = viewNChunckH * chunksize / 2
    viewoffsety = viewNChunckV * chunksize / 2

    createCanvas(canvasSizex - chunksize, canvasSizey - chunksize);

    noiseSeed(seed)

    calcWidthMax = viewNChunckH * chunksize
    calcWidthMin = 0
    calcHeightMax = viewNChunckV * chunksize
    calcHeightMin = 0

    vcolors = [
        color(197, 27, 125), color(222, 119, 174), color(241, 182, 218),
        color(253, 224, 239), color(247, 247, 247), color(230, 245, 208),
        color(184, 225, 134), color(127, 188, 65), color(77, 146, 33)
    ];

}

function draw() {
    background(255)

    /** Generación de los vértices para los chunk inplicados 
     * el central y los de alrededor
     */

    var vertices = []
    for (var i = chunkposx - chunkposxround; i <= chunkposx + chunkposxround; i++) {
        for (j = chunkposy - chunkposyround; j <= chunkposy + chunkposxround; j++) {
            temp = generateChunckVertices(i, j)
            vertices = concatenar(vertices, temp)
        }
    }

    var transladados = vertices.map(function (d) {
        console.log(d);
        d[0] += (viewNChunckH - 1) * chunksize / 2;
        d[1] += (viewNChunckV - 1) * chunksize / 2;
    });

    voronoi = d3.geom.voronoi()
        .clipExtent([
            [calcWidthMin, calcHeightMin],
            [calcWidthMax, calcHeightMax]
        ]);
    var polygon = voronoi(vertices);
    stroke(255);
    var circles = vertices.slice(1);


    for (var j = 0; j < polygon.length; j++) {
        var apolygon = polygon[j];
        var polyColor = vcolors[j % vcolors.length];
        fill(polyColor);

        beginShape();
        for (var k = 0; k < apolygon.length; k++) {

            var v = apolygon[k];
            vertex(v[0], v[1]);

        }
        endShape(CLOSE);
    }
    stroke(0);

    for (var i = 0; i < circles.length; i++) {

        var center = circles[i];

        push();
        translate(center[0], center[1]);
        fill(200, 200, 0);
        ellipse(0, 0, 1.5, 1.5);
        pop();
    }

    //showChunk();
}

function concatenar(lista1, lista2) {
    for (var i = 0; i < lista2.length; i++) {
        lista1.push(lista2[i])
    }
    return lista1
}

function generateChunckVertices(x, y) {
    xoff = 0;
    yoff = 1000;
    tx = x;
    ty = y;
    vertices = d3.range(5).map(function (d) {

        x = map(noise(xoff + tx), 0, 1, tx * chunksize, tx * chunksize + chunksize);
        y = map(noise(yoff + ty), 0, 1, ty * chunksize, ty * chunksize + chunksize);
        xoff += noisesql
        yoff += noisesql


        return [x, y]
    });
    return vertices
}

function showChunk() {
    for (var i = 0; i < width; i += chunksize) {
        stroke(0)
        push()

        line(i, 0, i, height)
        pop()
    }
    for (var j = 0; j < height; j += chunksize) {
        stroke(0)
        push()

        line(0, j, width, j)
        pop()
    }
}