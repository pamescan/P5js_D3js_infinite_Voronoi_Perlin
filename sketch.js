/** dimensiones para el canvas */

var viewNChunckV = 6;
var viewNChunckH = 6;
var offsetx;
var offsety;
var chunksize = 50;
var npoints = 3;

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
var chunkposxround = 5;
var chunkposyround = 5;

var posx = 0;
var posy = 0;
var vertices = [];
var voronoi;
var circles;
var polygon;



function setup() {
    chunkposxround = viewNChunckH
    chunkposyround = viewNChunckV
    var canvasSizex = (viewNChunckH) * chunksize
    var canvasSizey = (viewNChunckV) * chunksize

    createCanvas(canvasSizex, canvasSizey);

    noiseSeed(seed)

    vcolors = [
        color(197, 27, 125), color(222, 119, 174), color(241, 182, 218),
        color(253, 224, 239), color(247, 247, 247), color(230, 245, 208),
        color(184, 225, 134), color(127, 188, 65), color(77, 146, 33)
    ];

    offsetx = (width) / 2 - chunksize / 2
    offsety = (height) / 2 - chunksize / 2
    calculate(chunkposx, chunkposy)
}

function draw() {
    background(255)
    if (mouseY > height / 3) {
        posy += 1;
    } else {

        posy -= 1
    }

    if (mouseX > width / 2) {
        posx += 1;
    } else {
        posx -= 1;
    }

    if (posy % chunksize == 0) {

        this.chunkposy = posy / chunksize;
        calculate(this.chunkposx, this.chunkposy)
    }
    if (posx % chunksize == 0) {
        this.chunkposx = posx / chunksize
        calculate(this.chunkposx, this.chunkposy)

    }


    stroke(255);
    for (var j = 0; j < this.polygon.length; j++) {
        var apolygon = this.polygon[j];
        var polyColor = vcolors[apolygon.length % vcolors.length];
        fill(polyColor);

        beginShape();
        for (var k = 0; k < apolygon.length; k++) {

            var v = apolygon[k];
            vertex(v[0] - posx, v[1] - posy);

        }
        endShape(CLOSE);
    }
    stroke(0);

    for (var i = 0; i < circles.length; i++) {

        var center = circles[i];

        push();
        translate(center[0] - posx, center[1] - posy);
        //fill(200, 200, 0);
        ellipse(0, 0, 1.5, 1.5);
        pop();
    }


    //showGrid();
}

function calculate(chunkposx, chunkposy) {
    this.vertices = generateVertex(chunkposx, chunkposy, this.offsetx, this.offsety)

    calcWidthMax = (chunkposx + 2 * viewNChunckH) * chunksize
    calcWidthMin = (chunkposx - viewNChunckH) * chunksize
    calcHeightMax = (chunkposy + 2 * viewNChunckV) * chunksize
    calcHeightMin = (chunkposy - viewNChunckV) * chunksize
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