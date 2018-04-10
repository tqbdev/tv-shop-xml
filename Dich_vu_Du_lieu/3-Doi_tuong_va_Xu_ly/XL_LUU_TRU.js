var File = require("fs");
var format = require("pretty-data").pd;
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;

const Duong_dan_Thu_muc_Du_lieu_Tivi = "..//2-Du_lieu_Luu_tru//Tivi//";
const Duong_dan_Thu_muc_Du_lieu_Cuahang = "..//2-Du_lieu_Luu_tru//Cua_hang//";
const Ten_Tap_tin_Cuahang = "Cua_hang.xml";
const Ten_Tap_tin_Nhanvien = "Nhan_vien.xml";

class XL_LUU_TRU {
  Doc_Du_lieu_Cua_hang() {
    var Chuoi_XML = File.readFileSync(Duong_dan_Thu_muc_Du_lieu_Cuahang + Ten_Tap_tin_Cuahang, "UTF-8");
    var Du_lieu = new DOMParser().parseFromString(Chuoi_XML, "text/xml");
    return Du_lieu;
  }

  Doc_Du_lieu_Nhan_vien() {
    var Chuoi_XML = File.readFileSync(Duong_dan_Thu_muc_Du_lieu_Cuahang + Ten_Tap_tin_Nhanvien, "UTF-8");
    var Du_lieu = new DOMParser().parseFromString(Chuoi_XML, "text/xml");
    return Du_lieu;
  }

  Doc_Du_lieu_Danh_sach_Tivi() {
    var Du_lieu = []

    File.readdirSync(Duong_dan_Thu_muc_Du_lieu_Tivi).forEach(file => {
      var Chuoi_XML = File.readFileSync(Duong_dan_Thu_muc_Du_lieu_Tivi + file, "UTF-8");
      Du_lieu.push(new DOMParser().parseFromString(Chuoi_XML, "text/xml"))
    })

    return Du_lieu;
  }

  Doc_Du_lieu_Tivi(Ma_so_Tivi) {
    var Chuoi_XML = File.readFileSync(Duong_dan_Thu_muc_Du_lieu_Tivi + Ma_so_Tivi + ".xml", "UTF-8");
    var Du_lieu = new DOMParser().parseFromString(Chuoi_XML, "text/xml");
    return Du_lieu;
  }

  Luu_Du_lieu(Du_lieu, Ma_so_Tivi) {
    var formattedXml = format.xml(new XMLSerializer().serializeToString(Du_lieu));
    File.writeFileSync(Duong_dan_Thu_muc_Du_lieu_Tivi + Ma_so_Tivi + ".xml", formattedXml);
  }

  Luu_Du_lieu_Nhan_vien(Du_lieu) {
    var formattedXml = format.xml(new XMLSerializer().serializeToString(Du_lieu));
    File.writeFileSync(Duong_dan_Thu_muc_Du_lieu_Cuahang + Ten_Tap_tin_Nhanvien, formattedXml);
  }
}
//=============================
var Xu_ly = new XL_LUU_TRU();
module.exports = Xu_ly;