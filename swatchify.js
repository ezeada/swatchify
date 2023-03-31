
// randomly generate a color with rgb
function getRandomColor() {
    var r = Math.floor(Math.random() * 256); // 0 to 255
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
}

// converts rgb values to hex bc hex is cuter
function rgbToHex(rgbColor) {
    const hexDict = [[10, 11, 12, 13, 14, 15], ['a', 'b', 'c', 'd', 'e', 'f']];

    hex = "";
    for (i in rgbColor) {
        var int = Math.floor(rgbColor[i]/16);
        var frac = ((rgbColor[i]/16) % 1) * 16;

        if (int > 9) {
            hex += hexDict[1][hexDict[0].indexOf(int)];
        } else {
            hex += parseInt(int);
        }

        if (frac > 9) {
            hex += hexDict[1][hexDict[0].indexOf(frac)];
        } else {
            hex += parseInt(frac);
        }
    }
    return hex;
}

// converts to rgb to xyz and then xyz to LAB using D65 white ref illuminant
function rgbToLAB(rgbColor) {
    // rgb to xyz -- from https://mina86.com/2019/srgb-xyz-matrix/ (not perfect but hey)
    const M = [[0.4124108464885388, 0.3575845678529519, 0.18045380393360833], 
            [0.21264934272065283,  0.7151691357059038,  0.07218152157344333], 
            [0.019331758429150258, 0.11919485595098397, 0.9503900340503373]];
    var rgb = [rgbColor[0]/255, rgbColor[1]/255, rgbColor[2]/255];

    for (i in rgb) {
        if (rgb[i] <= 0.04045) {
            rgb[i]/=12.92;
        } else {
            rgb[i] = Math.pow((rgb[i] + 0.055)/1.055, 2.4);
        }
    }

    var x = M[0][0] * rgb[0] + M[0][1] * rgb[1] +  M[0][2] * rgb[2];
    var y = M[1][0] * rgb[0] + M[1][1] * rgb[1] +  M[1][2] * rgb[2];
    var z = M[2][0] * rgb[0] + M[2][1] * rgb[1] +  M[2][2] * rgb[2];

    // xyz to LAB -- from http://www.brucelindbloom.com/index.html?Eqn_XYZ_to_Lab.html
    const rx =  0.9504;
    const ry = 1.0000;
    const rz = 1.0888;

    const [var_X, var_Y, var_Z] = [x / rx, y / ry, z / rz]
        .map(a => a > 0.008856
            ? Math.pow(a, 1 / 3)
            : (7.787 * a) + (16 / 116));

    L = (116 * var_Y) - 16;
    a = 500 * (var_X - var_Y);
    b = 200 * (var_Y - var_Z);

    return [L, a, b];
}

// gets distance between to LAB colors (using LAB bc it is closer to human perception of color)
function getDist(c1, c2) {
    return Math.sqrt(Math.pow(c2[0]-c1[0], 2) + Math.pow(c2[1]-c1[1], 2) + Math.pow(c2[2]-c1[2], 2));
}
