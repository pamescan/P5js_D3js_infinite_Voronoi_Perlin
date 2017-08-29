/** dimensiones para el canvas */

var viewNChunckV = 5;
var viewNChunckH = 5;
var chunksize = 100;
var npoints = 10;

/** dimensiones para el calculo de las zonas */
var calcWidthMax
var calcHeightMax
var calcWidthMin
var calcHeightMin

/* var viewoffsetx
var viewoffsety */

var seed = 1;
var noisesql = 100;




var chunkposx = 0;
var chunkposy = 0;
var chunkposxround = 1;
var chunkposyround = 1;

var posx = 0;
var posy = 0;
var vertices = [];

function setup() {
    var canvasSizex = (viewNChunckH) * chunksize
    var canvasSizey = (viewNChunckV) * chunksize
    /*   viewoffsetx = viewNChunckH * chunksize / 2
      viewoffsety = viewNChunckV * chunksize / 2 */

    createCanvas(canvasSizex, canvasSizey);

    noiseSeed(seed)




    vcolors = [
        color(197, 27, 125), color(222, 119, 174), color(241, 182, 218),
        color(253, 224, 239), color(247, 247, 247), color(230, 245, 208),
        color(184, 225, 134), color(127, 188, 65), color(77, 146, 33)
    ];
    /*     var tempx = (viewNChunckH - 1) * chunksize / 2
        var tempy = (viewNChunckV - 1) * chunksize / 2 */
    var tempx = (width) / 2 - chunksize / 2
    var tempy = (height) / 2 - chunksize / 2
    this.vertices = generateVertex(chunkposx, chunkposy, tempx, tempy)

}

function draw() {
    background(255)


    //print("(", chunkposx - chunkposxround, ",", chunkposy - chunkposyround, ")-(", chunkposx + chunkposxround, ",", chunkposy + chunkposxround, ")")
    // print(chunkposx + chunkposxround, chunkposy + chunkposxround)
    //chunkposy += 1;
    //vertices = generateVertex(chunkposy, chunkposx)


    /**traslación de los puntos al centro de la pantalla*/
    /*     var transladados = this.vertices.map(function (d) {
            d[0] += (viewNChunckH - 1) * chunksize / 2;
            d[1] += (viewNChunckV - 1) * chunksize / 2;
        }); */
    calcWidthMax = viewNChunckH * chunksize
    calcWidthMin = 0
    calcHeightMax = viewNChunckV * chunksize
    calcHeightMin = 0
    voronoi = d3.geom.voronoi()
        .clipExtent([
            [calcWidthMin, calcHeightMin],
            [calcWidthMax, calcHeightMax]
        ]);
    var polygon = voronoi(this.vertices);
    stroke(0);
    var circles = this.vertices.slice(1);


    for (var j = 0; j < polygon.length; j++) {
        var apolygon = polygon[j];
        var polyColor = vcolors[j % vcolors.length];
        fill(color(184, 225, 134));

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
        //fill(200, 200, 0);
        ellipse(0, 0, 1.5, 1.5);
        pop();
    }
    var centrovisiblex = width / 2
    var centrovisibley = height / 2
    push();
    translate(centrovisiblex, centrovisibley);
    ellipse(0, 0, 15, 15);
    pop();
    stroke(color(255, 0, 255))
    line(width / 2, 0, width / 2, height)
    line(0, height / 2, width, height / 2)

    //showChunk();
}

function concatenar(lista1, lista2) {
    for (var i = 0; i < lista2.length; i++) {
        lista1.push(lista2[i])
    }
    return lista1
}
/**
 * Todos los vértices
 * @param {number} chunkposx 
 * @param {number} chunkposy 
 */
function generateVertex(chunkposx, chunkposy, xoff, yoff) {
    var total = []
    for (var i = chunkposx - this.chunkposxround; i <= chunkposx + this.chunkposxround; i++) {
        for (j = chunkposy - this.chunkposyround; j <= chunkposy + this.chunkposyround; j++) {
            temp = generateChunckVertices(i, j, xoff, yoff)
            total = concatenar(total, temp)
        }
    }
    return total
}

function generateChunckVertices(tx, ty, xoff, yoff) {
    noisexoff = 0;
    noiseyoff = 1000;
    pxini = tx * chunksize + xoff;
    pxfin = pxini + chunksize;
    pyini = ty * chunksize + yoff;
    pyfin = pyini + chunksize;
    /*   tx = x;
      ty = y; */
    var verticeschunk = d3.range(this.npoints).map(function (d) {

        x = map(noise(noisexoff + tx), 0, 1, pxini, pxfin);
        y = map(noise(noiseyoff + ty), 0, 1, pyini, pyfin);
        // x = map(0.5, 0, 1, pxini, pxfin);
        // y = map(0.5, 0, 1, pyini, pyfin);
        noisexoff += noisesql
        noiseyoff += noisesql
        return [x, y]
    });
    return verticeschunk
}