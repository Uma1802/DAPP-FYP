const util = require('./util');
const CryptoJS = require("crypto-js");
const arrayBufferToHex = require('array-buffer-to-hex')
const hexToArrayBuffer = require('hex-to-array-buffer');

module.exports = function Crypto(options) {
  util.enforceArgs(options, ['key']);

  let self = {};
  //const algo = 'aes-256-ctr';
  //const hmacAlgo = 'sha256';
  //const key = Buffer.from(options.key, 'hex');
  //const hmacKey = Buffer.from(options.key, 'hex');
  const key=options.key;
  //const hmacKey=options.hmacKey


    var stringify = function(cipherParams) {

    const cthexstr=CryptoJS.enc.Hex.stringify(cipherParams.ciphertext)   //wa to hex
    console.log("hex str of ct wa",cthexstr)

    var htab=hexToArrayBuffer(cthexstr)           //hex to buffer
    console.log("hexToArrayBuffer ",htab)
    console.log("type of hexToArrayBuffer: ",typeof htab)

    /*
    const ctbufFromHex=Buffer.from(cthexstr, 'hex')       //hex to buffer
    console.log("ct hex str to buf ",ctbufFromHex)
    console.log("type of ctbuf from hex: ",typeof ctbufFromHex)
    */
      return htab;
    }

    var parse = function(buffer) {

      console.log("in parse buffer to hex: ",arrayBufferToHex(buffer))
      console.log("in parse ciphertext cipherParam: ",CryptoJS.enc.Hex.parse(arrayBufferToHex(buffer)))

      var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(arrayBufferToHex(buffer))
      }); 
        return cipherParams;
    }
 

  const encryptBuffer = function (buffer) {

    //console.log("parsed key ",CryptoJS.enc.Hex.parse(key))
    //console.log("hex buf 2 ",arrayBufferToHex(buffer))

    try{

    console.log("hex of gn buf ",arrayBufferToHex(buffer))
    console.log("wa of input buf ",CryptoJS.enc.Hex.parse(arrayBufferToHex(buffer)))
    
    var encryptedText = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(arrayBufferToHex(buffer)), CryptoJS.enc.Hex.parse(key),{  mode: CryptoJS.mode.ECB  });
    console.log("en text cp: ",encryptedText)
    console.log("type enc txt ",typeof encryptedText)
    var res= stringify(encryptedText);
    console.log("res: ",res)
  }
    catch(error){
      console.error("errrror: ",error)
    } 

    return res;
  }


const backToHexString = (hexString) => Uint8Array.from(Buffer.from(hexString, 'hex'));

  const decryptBuffer = function (uint8arr) {
    
  console.log("uint8 arr to arr buff: ",uint8arr.buffer)

  const cipParam = parse(uint8arr.buffer)
  console.log("cip param ",cipParam)

  var decryptedText  = CryptoJS.AES.decrypt(cipParam,CryptoJS.enc.Hex.parse(key),{  mode: CryptoJS.mode.ECB});
  console.log("dec wa: ",decryptedText)

  var decryptedData=CryptoJS.enc.Hex.stringify(decryptedText);
  console.log("in hex dec1: ",decryptedData);
  console.log("de1 type: ",typeof decryptedData)

  console.log("hexstr to buf: ",backToHexString(decryptedData))
  //console.log("hex to arr buff",hexToArrayBuffer(decryptedData))
  
  return backToHexString(decryptedData);

  };

  self.encryptBuffer = function(arg) {
    return encryptBuffer(arg);
  };

  self.decryptBuffer = function(arg) {
    return decryptBuffer(arg);
  };

  return self;
};
