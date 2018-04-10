var File = require("fs");
const Duong_dan_Thu_muc_Du_lieu = "..//Media";

class XL_ANH {
  Doc_Du_Lieu_Anh(Ma_So) {
    var Duong_dan = Duong_dan_Thu_muc_Du_lieu + `//${Ma_So}.png`;
    var img = File.readFileSync(Duong_dan);
    return img;
  }
}

//=============================
var Xu_ly = new XL_ANH();
module.exports = Xu_ly;
