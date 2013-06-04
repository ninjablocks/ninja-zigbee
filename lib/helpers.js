exports.string2rgb = function(color) {
  //Param is a hex string of color info
  //Common hex prefixes of '0x' and '#'
  //is accepted.

  //Properties
  this.color = color;

  //Methods
  this.getColor = function(){
    /*Return original color string*/

    return this.color;
  };

  this.getDecimalVals = function(){
    /*Returns an object with red, green, and blue
    properties in decimal value*/

    var color = this.color;

    var rgb;
    var colorObj;

    //Replace hex prefixes if present
    color = color.replace("0x", "");
    color = color.replace("#", "");

    //Easier to visualize bitshifts in hex
    rgb = parseInt(color, 16);

    //Extract rgb info
    colorObj = new Object();
    colorObj.red = (rgb & (255 << 16)) >> 16;
    colorObj.green = (rgb & (255 << 8)) >> 8;
    colorObj.blue = (rgb & 255);

    return colorObj;
  };
};

exports.rgb2hsl = function(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
    h = s = 0; // achromatic
  }else{
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [Math.floor(h * 255), Math.floor(s * 255), Math.floor(l * 255)];
}