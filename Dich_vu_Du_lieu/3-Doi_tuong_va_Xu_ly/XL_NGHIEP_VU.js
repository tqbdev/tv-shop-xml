var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;
var xpathSelect = require("xpath.js");

class XL_NGHIEP_VU {
  Xu_ly_Danh_sach_Tivi(Du_lieu) {
    var Du_lieu_Khach_Tham_quan = new DOMParser().parseFromString(
      "<Danh_sach_Tivi></Danh_sach_Tivi>"
    );
    var Du_lieu_Nhap_hang = new DOMParser().parseFromString(
      "<Danh_sach_Tivi></Danh_sach_Tivi>"
    );
    var Du_lieu_Ban_hang = new DOMParser().parseFromString(
      "<Danh_sach_Tivi></Danh_sach_Tivi>"
    );

    Du_lieu.forEach(Tivi_XML => {
      var Tivi = Tivi_XML.getElementsByTagName("Tivi")[0];

      var Ma_so = Tivi.getAttribute("Ma_so");
      var Ten = Tivi.getAttribute("Ten");
      var Don_gia_Ban = Tivi.getAttribute("Don_gia_Ban");
      var Don_gia_Nhap = Tivi.getAttribute("Don_gia_Nhap");

      var DS_Ban_hang = Tivi.getElementsByTagName("Ban_hang");
      var DS_Nhap_hang = Tivi.getElementsByTagName("Nhap_hang");

      var SL_Ban_hang = 0;
      var Doanh_thu_Ban_hang = 0;
      var SL_Nhap_hang = 0;

      for (let i = 0; i < DS_Ban_hang.length; i++) {
        if (DS_Ban_hang[i].nodeType != 1) {
          continue;
        }

        SL_Ban_hang += parseInt(DS_Ban_hang[i].getAttribute("So_luong"));
        Doanh_thu_Ban_hang += parseInt(DS_Ban_hang[i].getAttribute("Tien"));
      }

      for (let i = 0; i < DS_Nhap_hang.length; i++) {
        if (DS_Nhap_hang[i].nodeType != 1) {
          continue;
        }

        SL_Nhap_hang += parseInt(DS_Nhap_hang[i].getAttribute("So_luong"));
      }

      var So_luong_Ton = SL_Nhap_hang - SL_Ban_hang;

      var newTV = Du_lieu_Khach_Tham_quan.createElement("Tivi");
      newTV.setAttribute("Ma_so", Ma_so);
      newTV.setAttribute("Ten", Ten);
      newTV.setAttribute("Don_gia_Ban", Don_gia_Ban);
      Du_lieu_Khach_Tham_quan.getElementsByTagName(
        "Danh_sach_Tivi"
      )[0].appendChild(newTV);

      if (So_luong_Ton > 0) {
        newTV.setAttribute("Trang_thai_Con_hang", "true");
      } else {
        newTV.setAttribute("Trang_thai_Con_hang", "false");
      }

      newTV = Du_lieu_Nhap_hang.createElement("Tivi");
      newTV.setAttribute("Ma_so", Ma_so);
      newTV.setAttribute("Ten", Ten);
      newTV.setAttribute("Don_gia_Nhap", Don_gia_Nhap);
      newTV.setAttribute("So_luong_Ton", So_luong_Ton);

      var Nhom = Tivi.getElementsByTagName("Nhom_Tivi")[0];

      var Nhom_TV = Du_lieu_Nhap_hang.createElement("Nhom_Tivi");
      Nhom_TV.setAttribute("Ten", Nhom.getAttribute("Ten"));
      Nhom_TV.setAttribute("Ma_so", Nhom.getAttribute("Ma_so"));
      newTV.appendChild(Nhom_TV);

      Du_lieu_Nhap_hang.getElementsByTagName("Danh_sach_Tivi")[0].appendChild(
        newTV
      );

      newTV = Du_lieu_Ban_hang.createElement("Tivi");
      newTV.setAttribute("Ma_so", Ma_so);
      newTV.setAttribute("Ten", Ten);
      newTV.setAttribute("Don_gia_Ban", Don_gia_Ban);
      newTV.setAttribute("So_luong_Ton", So_luong_Ton);
      newTV.setAttribute("Doanh_thu", Doanh_thu_Ban_hang);

      Nhom_TV = Du_lieu_Ban_hang.createElement("Nhom_Tivi");
      Nhom_TV.setAttribute("Ten", Nhom.getAttribute("Ten"));
      Nhom_TV.setAttribute("Ma_so", Nhom.getAttribute("Ma_so"));
      newTV.appendChild(Nhom_TV);
      newTV.appendChild(Nhom_TV);

      Du_lieu_Ban_hang.getElementsByTagName("Danh_sach_Tivi")[0].appendChild(
        newTV
      );
    });

    return [Du_lieu_Khach_Tham_quan, Du_lieu_Nhap_hang, Du_lieu_Ban_hang];
  }

  Xu_ly_Du_lieu_Nhan_vien(Du_lieu) {
    var Du_lieu_Nhan_vien_Ban_hang = new DOMParser().parseFromString(
      "<Danh_sach_Nhan_vien></Danh_sach_Nhan_vien>"
    );
    var Danh_sach_Nhan_vien = Du_lieu_Nhan_vien_Ban_hang.getElementsByTagName("Danh_sach_Nhan_vien")[0];

    var DS_Nhan_vien_Ban_hang = xpathSelect(
      Du_lieu,
      "/Danh_sach_Nhan_vien/Danh_sach_Nhan_vien_Ban_hang/Nhan_vien"
    );

    for (let i = 0; i < DS_Nhan_vien_Ban_hang.length; i++) {
      if (DS_Nhan_vien_Ban_hang[i].nodeType != 1) {
        continue;
      }

      var Ho_ten = DS_Nhan_vien_Ban_hang[i].getAttribute("Ho_ten");

      var DS_Ban_hang_Nhan_vien = xpathSelect(
        Du_lieu,
        "/Danh_sach_Nhan_vien/Danh_sach_Nhan_vien_Ban_hang/Nhan_vien[@Ho_ten='" +
          Ho_ten +
          "']/Danh_sach_Ban_hang/Ban_hang"
      );

      var Doanh_thu = 0;
      
      for (let j = 0; j < DS_Ban_hang_Nhan_vien.length; j++) {
        if (DS_Ban_hang_Nhan_vien[j].nodeType != 1) {
          continue;
        }

        Doanh_thu += parseInt(DS_Ban_hang_Nhan_vien[j].getAttribute("Tien"));
      }

      var Nhan_vien = Du_lieu_Nhan_vien_Ban_hang.createElement("Nhan_vien");
      Nhan_vien.setAttribute("Ho_ten", Ho_ten);
      Nhan_vien.setAttribute("Doanh_thu", Doanh_thu);
      Danh_sach_Nhan_vien.appendChild(Nhan_vien);
    }

    return Du_lieu_Nhan_vien_Ban_hang;
  }

  Nhap_hang(Du_lieu_File, Du_lieu_Bien, Tham_so_XML) {
    var Ma_so = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Ma_so"
    );
    var Don_gia = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Don_gia"
    );
    var Ngay = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Ngay"
    );
    var So_luong = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "So_luong"
    );
    var Tien = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Tien"
    );

    var itemListImport = Du_lieu_File.getElementsByTagName(
      "Danh_sach_Nhap_hang"
    )[0];

    var newImport = Du_lieu_File.createElement("Nhap_hang");
    newImport.setAttribute("Ngay", Ngay);
    newImport.setAttribute("Don_gia", Don_gia);
    newImport.setAttribute("So_luong", So_luong);
    newImport.setAttribute("Tien", Tien);

    itemListImport.appendChild(newImport);

    var Tivi = xpathSelect(
      Du_lieu_Bien,
      "/Danh_sach_Tivi/Tivi[@Ma_so='" + Ma_so + "']"
    )[0];

    var So_luong_Ton_Moi =
      parseInt(Tivi.getAttribute("So_luong_Ton")) + parseInt(So_luong);

    Tivi.setAttribute("So_luong_Ton", So_luong_Ton_Moi);
    Du_lieu_File.getElementsByTagName("Tivi")[0].setAttribute(
      "So_luong_Ton",
      So_luong_Ton_Moi
    );

    if (So_luong_Ton_Moi > 0) {
      Du_lieu_File.getElementsByTagName("Tivi")[0].setAttribute(
        "Trang_thai_Con_hang",
        "true"
      );
    } else {
      Du_lieu_File.getElementsByTagName("Tivi")[0].setAttribute(
        "Trang_thai_Con_hang",
        "false"
      );
    }
  }

  Check_Con_hang(Du_lieu, Tham_so_XML) {
    var Ma_so = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Ma_so"
    );

    var So_luong = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "So_luong"
    );

    var item = xpathSelect(
      Du_lieu,
      "/Danh_sach_Tivi/Tivi[@Ma_so='" + Ma_so + "']"
    )[0];

    if (item == null) {
      return false;
    }

    var So_luong_Ton = parseInt(item.getAttribute("So_luong_Ton"));

    if (So_luong_Ton < So_luong) {
      return false;
    }

    return true;
  }

  Check_Thong_tin(Du_lieu, Ma_so) {
    var item = xpathSelect(
      Du_lieu,
      "/Danh_sach_Tivi/Tivi[@Ma_so='" + Ma_so + "']"
    )[0];

    if (item == null) {
      return false;
    }

    return true;
  }

  Cap_nhat_Gia_nhap(Du_lieu_File, Du_lieu_Bien, Tham_so_XML) {
    var Ma_so = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Ma_so"
    );
    var Don_gia = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Don_gia"
    );

    var Tivi = xpathSelect(
      Du_lieu_Bien,
      "/Danh_sach_Tivi/Tivi[@Ma_so='" + Ma_so + "']"
    )[0];

    Tivi.setAttribute("Don_gia_Nhap", Don_gia);
    Du_lieu_File.getElementsByTagName("Tivi")[0].setAttribute(
      "Don_gia_Nhap",
      Don_gia
    );
  }

  Ban_hang(Du_lieu_File, Du_lieu_Bien, Du_lieu_Nhan_vien, Tham_so_XML) {
    var Ho_ten = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Ho_ten"
    );
    var Ma_so = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Ma_so"
    );
    var Don_gia = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Don_gia"
    );
    var Ngay = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Ngay"
    );
    var So_luong = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "So_luong"
    );
    var Tien = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Tien"
    );

    var itemListSale = Du_lieu_File.getElementsByTagName(
      "Danh_sach_Ban_hang"
    )[0];

    var newSale = Du_lieu_File.createElement("Ban_hang");
    newSale.setAttribute("Ngay", Ngay);
    newSale.setAttribute("Don_gia", Don_gia);
    newSale.setAttribute("So_luong", So_luong);
    newSale.setAttribute("Tien", Tien);

    itemListSale.appendChild(newSale);

    // Them vao nhan vien
    var root = Du_lieu_Nhan_vien.getElementsByTagName("Danh_sach_Nhan_vien")[0];
    var checkDS = Du_lieu_Nhan_vien.getElementsByTagName(
      "Danh_sach_Nhan_vien_Ban_hang"
    )[0];
    if (checkDS == null) {
      root.appendChild(
        Du_lieu_Nhan_vien.createElement("Danh_sach_Nhan_vien_Ban_hang")
      );
    }

    var NhanVien = xpathSelect(
      Du_lieu_Nhan_vien,
      "/Danh_sach_Nhan_vien/Danh_sach_Nhan_vien_Ban_hang/Nhan_vien[@Ho_ten='" +
        Ho_ten +
        "']"
    )[0];

    if (NhanVien == null) {
      var Danh_sach_Nhan_vien_Ban_hang = Du_lieu_Nhan_vien.getElementsByTagName(
        "Danh_sach_Nhan_vien_Ban_hang"
      )[0];

      NhanVien = Du_lieu_Nhan_vien.createElement("Nhan_vien");
      NhanVien.setAttribute("Ho_ten", Ho_ten);

      var DS_Ban_hang_Nhan_vien = Du_lieu_Nhan_vien.createElement(
        "Danh_sach_Ban_hang"
      );

      newSale = Du_lieu_Nhan_vien.createElement("Ban_hang");
      newSale.setAttribute("Ma_so_Tivi", Ma_so);
      newSale.setAttribute("Ngay", Ngay);
      newSale.setAttribute("Don_gia", Don_gia);
      newSale.setAttribute("So_luong", So_luong);
      newSale.setAttribute("Tien", Tien);

      DS_Ban_hang_Nhan_vien.appendChild(newSale);
      NhanVien.appendChild(DS_Ban_hang_Nhan_vien);
      Danh_sach_Nhan_vien_Ban_hang.appendChild(NhanVien);
    } else {
      var DS_Ban_hang_Nhan_vien = xpathSelect(
        Du_lieu_Nhan_vien,
        "/Danh_sach_Nhan_vien/Danh_sach_Nhan_vien_Ban_hang/Nhan_vien[@Ho_ten='" +
          Ho_ten +
          "']/Danh_sach_Ban_hang"
      )[0];

      newSale = Du_lieu_Nhan_vien.createElement("Ban_hang");
      newSale.setAttribute("Ma_so_Tivi", Ma_so);
      newSale.setAttribute("Ngay", Ngay);
      newSale.setAttribute("Don_gia", Don_gia);
      newSale.setAttribute("So_luong", So_luong);
      newSale.setAttribute("Tien", Tien);

      DS_Ban_hang_Nhan_vien.appendChild(newSale);
    }
    //

    var Tivi = xpathSelect(
      Du_lieu_Bien,
      "/Danh_sach_Tivi/Tivi[@Ma_so='" + Ma_so + "']"
    )[0];

    var So_luong_Ton_Moi =
      parseInt(Tivi.getAttribute("So_luong_Ton")) - parseInt(So_luong);

    Tivi.setAttribute("So_luong_Ton", So_luong_Ton_Moi);
    Du_lieu_File.getElementsByTagName("Tivi")[0].setAttribute(
      "So_luong_Ton",
      So_luong_Ton_Moi
    );

    if (So_luong_Ton_Moi > 0) {
      Du_lieu_File.getElementsByTagName("Tivi")[0].setAttribute(
        "Trang_thai_Con_hang",
        "true"
      );
    } else {
      Du_lieu_File.getElementsByTagName("Tivi")[0].setAttribute(
        "Trang_thai_Con_hang",
        "false"
      );
    }
  }

  Cap_nhat_Gia_ban(Du_lieu_File, Du_lieu_Bien, Tham_so_XML) {
    var Ma_so = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Ma_so"
    );
    var Don_gia = Tham_so_XML.getElementsByTagName("Tham_so")[0].getAttribute(
      "Don_gia"
    );

    var Tivi = xpathSelect(
      Du_lieu_Bien,
      "/Danh_sach_Tivi/Tivi[@Ma_so='" + Ma_so + "']"
    )[0];

    Tivi.setAttribute("Don_gia_Ban", Don_gia);
    Du_lieu_File.getElementsByTagName("Tivi")[0].setAttribute(
      "Don_gia_Ban",
      Don_gia
    );
  }

  Lay_Doanh_thu_Nhan_vien(Du_lieu, Ho_ten) {
    var Nhan_vien = xpathSelect(
      Du_lieu,
      "/Danh_sach_Nhan_vien/Nhan_vien[@Ho_ten='" + Ho_ten + "']"
    )[0];

    if (Nhan_vien != null) {
      return Nhan_vien.getAttribute("Doanh_thu");
    }

    return null;
  }
}

var Xu_ly = new XL_NGHIEP_VU();
module.exports = Xu_ly;
