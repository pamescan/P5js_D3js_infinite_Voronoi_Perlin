/** dimensiones para el canvas */

var viewNChunckV = 5;
var viewNChunckH = 5;
var offsetx;
var offsety;
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
var chunkposxround = 3;
var chunkposyround = 3;

var posx = 0;
var posy = 0;
var vertices = [];
var voronoi;
var circles;
var polygon;

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
    offsetx = (width) / 2 - chunksize / 2
    offsety = (height) / 2 - chunksize / 2
    calculate(chunkposx, chunkposy)
}

function draw() {
    background(255)
    posy += 1;
    if (posy % chunksize == 0) {
        print(posy)
        chunkposy += 1;
        calculate(chunkposx, chunkposy)

    }



    stroke(255);
    for (var j = 0; j < this.polygon.length; j++) {
        var apolygon = this.polygon[j];
        var polyColor = vcolors[j % vcolors.length];
        fill(color(184, 225, 134));

        beginShape();
        for (var k = 0; k < apolygon.length; k++) {

            var v = apolygon[k];
            vertex(v[0], v[1] - posy);

        }
        endShape(CLOSE);
    }
    stroke(0);

    for (var i = 0; i < circles.length; i++) {

        var center = circles[i];

        push();
        translate(center[0], center[1] - posy);
        //fill(200, 200, 0);
        ellipse(0, 0, 1.5, 1.5);
        pop();
    }


    showGrid();
}

function calculate(chunkposx, chunkposy) {
    this.vertices = generateVertex(chunkposx, chunkposy, this.offsetx, this.offsety)
    /*     calcWidthMax = (viewNChunckH + chunkposx) * chunksize
        calcWidthMin = chunkposx
        calcHeightMax = (viewNChunckV + chunkposy) * chunksize
        calcHeightMin = chunkposy */
    calcWidthMax = (chunkposx + 2 * chunkposxround + 1) * chunksize
    calcWidthMin = (chunkposx) * chunksize
    calcHeightMax = (chunkposy + 2 * chunkposyround + 1) * chunksize
    calcHeightMin = (chunkposy) * chunksize
    this.voronoi = d3.geom.voronoi()
        .clipExtent([
            [calcWidthMin, calcHeightMin],
            [calcWidthMax, calcHeightMax]
        ]);
    this.polygon = this.voronoi(this.vertices);
    stroke(0);
    this.circles = this.vertices.slice(1);
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

function showGrid() {
    var centrovisiblex = width / 2
    var centrovisibley = height / 2
    push();
    translate(centrovisiblex, centrovisibley);
    ellipse(0, 0, 15, 15);
    pop();
    stroke(color(255, 0, 255))
    line(width / 2, 0, width / 2, height)
    line(0, height / 2, width, height / 2)
}