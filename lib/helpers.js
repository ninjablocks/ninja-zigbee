//SRPC header bit positions
var SRPC_CMD_ID_POS = 0;
var SRPC_CMD_LEN_POS = 1;


exports.parseDeviceInformation = function(msg, msgPtr,msgLen) {

  var profileId=0, deviceId=0, nwkAddr=0;
  var endPoint;
  msgLen = msg[msgPtr + SRPC_CMD_LEN_POS] + 2;
  //index passed len, cmd ID and status
  msgPtr+=2;

  //Get the NwkAddr
  for (var i=0; i < 2; i++, msgPtr++) {
    //javascript does not support unsigned so use a bigger container
    //to avoid conversion issues
    var nwkAddrTemp = (msg[msgPtr] & 0xff);
    nwkAddr += (nwkAddrTemp << (8 * i));
  }

  //Get the EndPoint
  endPoint = msg[msgPtr++];

  //Get the ProfileId
  for (var i=0; i < 2; i++, msgPtr++) {
    //javascript does not support unsigned so use a bigger container
    //to avoid conversion issues
    var profileIdTemp = (msg[msgPtr] & 0xff);
    profileId += (profileIdTemp << (8 * i));
  }

  //Get the DeviceId
  for (var i=0; i < 2; i++, msgPtr++) {
    //javascript does not support unsigned so use a bigger container
    //to avoid conversion issues
    var deviceIdTemp = (msg[msgPtr] & 0xff);
    deviceId += (deviceIdTemp << (8 * i));
  }

  return {
    msgPtr:msgPtr,
    profileId:profileId,
    deviceId:deviceId,
    nwkAddr:nwkAddr,
    endPoint:endPoint,
    msgLen:msgLen
  }

};


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