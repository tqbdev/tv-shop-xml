var NodeJs_Dich_vu = require("http");
var fs = require("fs");
var Luu_tru = require("../3-Doi_tuong_va_Xu_ly/XL_LUU_TRU.js");
var Nghiep_vu = require("../3-Doi_tuong_va_Xu_ly/XL_NGHIEP_VU.js");
var Media = require("..//3-Doi_tuong_va_Xu_ly/XL_ANH.js");
var Port = 1000;
var Xu_ly_Tham_so = require("querystring");
var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;

console.log("Waiting to prepare data...");
var Du_lieu_Cua_hang = Luu_tru.Doc_Du_lieu_Cua_hang();
var Du_lieu_Nhan_vien_Ban_hang = Nghiep_vu.Xu_ly_Du_lieu_Nhan_vien(Luu_tru.Doc_Du_lieu_Nhan_vien());

var Du_lieu_Danh_sach_Tivi = Luu_tru.Doc_Du_lieu_Danh_sach_Tivi();
var Du_lieu = Nghiep_vu.Xu_ly_Danh_sach_Tivi(Du_lieu_Danh_sach_Tivi);
var Du_lieu_Khach_Tham_quan = Du_lieu[0];
var Du_lieu_Nhap_hang = Du_lieu[1];
var Du_lieu_Ban_hang = Du_lieu[2];

console.log("Prepare data complete...");

var Dich_vu = NodeJs_Dich_vu.createServer((Yeu_cau, Dap_ung) => {
  var Chuoi_Nhan = "";
  var Dia_chi_Xu_ly = Yeu_cau.url.replace("/", "");
  var Tham_so = Xu_ly_Tham_so.parse(Dia_chi_Xu_ly.replace("?", ""));
  var Ma_so_Xu_ly = Tham_so.Ma_so_Xu_ly;
  var Chuoi_Kq = "";

  Yeu_cau.on("data", chunk => {
    Chuoi_Nhan += chunk;
  });

  Yeu_cau.on("end", () => {
    var check = true;

    var Tham_so_XML = null;
    if (Chuoi_Nhan != "") {
      Tham_so_XML = new DOMParser().parseFromString(Chuoi_Nhan);
    }

    if (Ma_so_Xu_ly == "Doc_Du_lieu") {
      if (Tham_so.id == "Cua_hang") {
        Chuoi_Kq = new XMLSerializer().serializeToString(Du_lieu_Cua_hang);
      } else if (Tham_so.id == "Khach_Tham_quan") {
        Chuoi_Kq = new XMLSerializer().serializeToString(
          Du_lieu_Khach_Tham_quan
        );
        console.log("Send XML string to client Khach_Tham_quan");
      } else if (Tham_so.id == "Nhan_vien_Nhap_hang") {
        Chuoi_Kq = new XMLSerializer().serializeToString(Du_lieu_Nhap_hang);
        console.log("Send XML string to client Nhan_vien_Nhap_hang");
      } else if (Tham_so.id == "Quan_ly_Nhap_hang") {
        Chuoi_Kq = new XMLSerializer().serializeToString(Du_lieu_Nhap_hang);
        console.log("Send XML string to client Quan_ly_Nhap_hang");
      } else if (Tham_so.id == "Nhan_vien_Ban_hang") {
        Chuoi_Kq = new XMLSerializer().serializeToString(Du_lieu_Ban_hang);
        console.log("Send XML string to client Nhan_vien_Ban_hang");
      } else if (Tham_so.id == "Quan_ly_Ban_hang") {
        Chuoi_Kq = new XMLSerializer().serializeToString(Du_lieu_Ban_hang);
        console.log("Send XML string to client Quan_ly_Ban_hang");
      }
    } else if (Ma_so_Xu_ly == "Du_lieu_Nhan_vien_Ban_hang") {
      Chuoi_Kq = new XMLSerializer().serializeToString(Du_lieu_Nhan_vien_Ban_hang);
      console.log("Send Du_lieu_Nhan_vien_Ban_hang XML string to client Quan_ly_Ban_hang");
    } else if (Ma_so_Xu_ly == "Load_Anh") {
      var img = Media.Doc_Du_Lieu_Anh(Tham_so.Id);
      Dap_ung.writeHead(200, { "Content-Type": "image/png" });
      Dap_ung.end(img, "binary");
      check = false;
    } else if (Ma_so_Xu_ly == "Nhap_hang") {
      console.log("Receive XL_Nhap_hang with:", Chuoi_Nhan);

      var Ma_so = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
        "Ma_so"
      );
      if (Nghiep_vu.Check_Thong_tin(Du_lieu_Nhap_hang, Ma_so) == false) {
        Chuoi_Kq = "<Ket_qua>Mã số TV bạn nhập không tồn tại!</Ket_qua>";
        console.log(
          "XL_Nhap_hang error:",
          "Mã số TV không tồn tại! with:",
          Chuoi_Nhan
        );
      } else {
        var Du_lieu_Tivi = Luu_tru.Doc_Du_lieu_Tivi(Ma_so);
        Nghiep_vu.Nhap_hang(Du_lieu_Tivi, Du_lieu_Nhap_hang, Tham_so_XML);

        Luu_tru.Luu_Du_lieu(Du_lieu_Tivi, Ma_so);

        Chuoi_Kq = "<Ket_qua>Đã nhập thành công!</Ket_qua>";
        console.log("XL_Nhap_hang successful with:", Chuoi_Nhan);
      }
    } else if (Ma_so_Xu_ly == "Cap_nhat_Gia_nhap") {
      console.log("Receive XL_Cap_nhat_Gia_nhap with:", Chuoi_Nhan);

      var Ma_so = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
        "Ma_so"
      );
      if (Nghiep_vu.Check_Thong_tin(Du_lieu_Nhap_hang, Ma_so) == false) {
        Chuoi_Kq = "<Ket_qua>Mã số TV bạn nhập không tồn tại!</Ket_qua>";
        console.log(
          "XL_Cap_nhat_Gia_nhap error:",
          "Mã số TV không tồn tại! with:",
          Chuoi_Nhan
        );
      } else {
        var Du_lieu_Tivi = Luu_tru.Doc_Du_lieu_Tivi(Ma_so);
        Nghiep_vu.Cap_nhat_Gia_nhap(
          Du_lieu_Tivi,
          Du_lieu_Nhap_hang,
          Tham_so_XML
        );

        Luu_tru.Luu_Du_lieu(Du_lieu_Tivi, Ma_so);

        Chuoi_Kq = "<Ket_qua>Đã cập nhật đơn giá nhập thành công!</Ket_qua>";
        console.log("XL_Cap_nhat_Gia_nhap successful with:", Chuoi_Nhan);
      }
    } else if (Ma_so_Xu_ly == "Ban_hang") {
      console.log("Receive XL_Ban_hang with:", Chuoi_Nhan);

      var Ma_so = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
        "Ma_so"
      );
      if (Nghiep_vu.Check_Thong_tin(Du_lieu_Ban_hang, Ma_so) == false) {
        Chuoi_Kq = "<Ket_qua>Mã số TV bạn nhập không tồn tại!</Ket_qua>";
        console.log(
          "XL_Ban_hang error:",
          "Mã số TV không tồn tại! with:",
          Chuoi_Nhan
        );
      } else if (Nghiep_vu.Check_Con_hang(Du_lieu_Ban_hang, Tham_so_XML) == false) {
        Chuoi_Kq = "<Ket_qua>Số lượng tồn không đủ để thực hiện đơn hàng!</Ket_qua>";
        console.log(
          "XL_Ban_hang error:",
          "Số lượng tồn không đủ để thực hiện đơn hàng! with:",
          Chuoi_Nhan
        );
      } else {
        var Du_lieu_Tivi = Luu_tru.Doc_Du_lieu_Tivi(Ma_so);
        var Du_lieu_Nhan_vien = Luu_tru.Doc_Du_lieu_Nhan_vien();

        Nghiep_vu.Ban_hang(Du_lieu_Tivi, Du_lieu_Ban_hang, Du_lieu_Nhan_vien, Tham_so_XML);

        Du_lieu_Nhan_vien_Ban_hang = Nghiep_vu.Xu_ly_Du_lieu_Nhan_vien(Du_lieu_Nhan_vien);
        Luu_tru.Luu_Du_lieu_Nhan_vien(Du_lieu_Nhan_vien);
        Luu_tru.Luu_Du_lieu(Du_lieu_Tivi, Ma_so);

        Chuoi_Kq = "<Ket_qua>Đã bán thành công!</Ket_qua>";
        console.log("XL_Ban_hang successful with:", Chuoi_Nhan);
      }
    } else if (Ma_so_Xu_ly == "Cap_nhat_Gia_ban") {
      console.log("Receive XL_Cap_nhat_Gia_ban with:", Chuoi_Nhan);

      var Ma_so = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
        "Ma_so"
      );
      if (Nghiep_vu.Check_Thong_tin(Du_lieu_Ban_hang, Ma_so) == false) {
        Chuoi_Kq = "<Ket_qua>Mã số TV bạn nhập không tồn tại!</Ket_qua>";
        console.log(
          "XL_Cap_nhat_Gia_ban error:",
          "Mã số TV không tồn tại! with:",
          Chuoi_Nhan
        );
      } else {
        var Du_lieu_Tivi = Luu_tru.Doc_Du_lieu_Tivi(Ma_so);
        Nghiep_vu.Cap_nhat_Gia_ban(Du_lieu_Tivi, Du_lieu_Ban_hang, Tham_so_XML);

        Luu_tru.Luu_Du_lieu(Du_lieu_Tivi, Ma_so);

        Chuoi_Kq = "<Ket_qua>Đã cập nhật đơn giá bán thành công!</Ket_qua>";
        console.log("XL_Cap_nhat_Gia_ban successful with:", Chuoi_Nhan);
      }
    } else if (Ma_so_Xu_ly == "Doanh_thu_Ca_nhan") {
      console.log("Receive XL_Doanh_thu_Ca_nhan with:", Chuoi_Nhan);

      var Ho_ten = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
        "Ho_ten"
      );

      var result = Nghiep_vu.Lay_Doanh_thu_Nhan_vien(Du_lieu_Nhan_vien_Ban_hang, Ho_ten);
      if (result == null) {
        Chuoi_Kq = `<Ket_qua>Họ tên "${Ho_ten}" không tồn tại.</Ket_qua>`;
      } else {
        Chuoi_Kq = `<Ket_qua>Doanh thu của ${Ho_ten} là: ${result}</Ket_qua>`;
      }
    } else {
      Chuoi_Kq =
        "<Ket_qua>Không có Mã số Xử lý " + Ma_so_Xu_ly + " này</Ket_qua>";
    }

    if (check == true) {
      Dap_ung.setHeader("Access-Control-Allow-Origin", "*");
      Dap_ung.end(Chuoi_Kq);
    }
  });
});

Dich_vu.listen(Port);
