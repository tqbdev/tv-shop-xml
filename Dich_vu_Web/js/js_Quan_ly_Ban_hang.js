const Dia_chi_Dich_vu = "http://localhost:1000";

// ****** Xử lý Thể hiện ********
function Create_Html_List_Items(List_Items_Data) {
  let Html_List_Items = document.createElement("div");
  Html_List_Items.className = "row";

  for (let i = 0; i < List_Items_Data.length; i++) {
    if (List_Items_Data[i].nodeType != 1) {
      continue;
    }

    let item_Data = List_Items_Data[i];

    var Tham_so = `Ma_so_Xu_ly=Load_Anh&Id=${List_Items_Data[i].getAttribute(
      "Ma_so"
    )}`;
    var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}?${Tham_so}`;
    var Html_Item_Img = document.createElement("img");
    Html_Item_Img.src = Dia_chi_Xu_ly;
    Html_Item_Img.style.cssText = `width:150px;height:150px;`;

    var Html_Item_Info = document.createElement("div");
    Html_Item_Info.className = `btn info-lable`;
    Html_Item_Info.style.cssText = `text-align:left`;
    Html_Item_Info.innerHTML = `${List_Items_Data[i].getAttribute("Ten")}
                  <br />Đơn giá Bán
                   ${List_Items_Data[i].getAttribute("Don_gia_Ban")}
                  <br />Số lượng tồn ${List_Items_Data[i].getAttribute(
                    "So_luong_Ton"
                  )}
                  <br />Mã số ${List_Items_Data[i].getAttribute("Ma_so")}
                  <br />Doanh thu ${List_Items_Data[i].getAttribute(
                    "Doanh_thu"
                  )}`;

    var Html_Item = document.createElement("div");
    Html_Item.className = `col-md-4`;
    Html_Item.style.cssText = `margin-bottom:40px;`;
    Html_Item.appendChild(Html_Item_Img);
    Html_Item.appendChild(Html_Item_Info);

    Html_List_Items.appendChild(Html_Item);
  }

  return Html_List_Items;
}

function Create_Html_Group_Staff_Statistic(data) {
  let Html_Group_Statistic = document.createElement("ol");

  for (let i = 0; i < data.length; i++) {
    if (data[i].nodeType != 1) {
      continue;
    }

    var Html_Item = document.createElement("li");
    Html_Item.innerHTML = `Họ tên: ${data[i].getAttribute("Ho_ten")}. Doanh thu: ${data[i].getAttribute("Doanh_thu")}`;
    Html_Group_Statistic.appendChild(Html_Item);
  }

  return Html_Group_Statistic;
}

function Create_Html_Group_Statistic(group_Staff_Statistic) {
  let Html_Group_Statistic = document.createElement("ol");

  var keyAmount = "Amount";
  var keyRevenue = "Revenue";

  for (key in group_TV_Statistic[keyAmount]) {
    var Html_Item = document.createElement("li");
    Html_Item.innerHTML = `${key}: tồn ${
      group_TV_Statistic[keyAmount][key]
    } (cái). Doanh thu: ${group_TV_Statistic[keyRevenue][key]}`;
    Html_Group_Statistic.appendChild(Html_Item);
  }

  return Html_Group_Statistic;
}

//************** Xử lý Nghiệp vụ ***********
function Query_Items_by_String(Query_String, List_Items_Data) {
  Query_String = Query_String.toUpperCase();

  var xmlString = "<Danh_sach_Tivi></Danh_sach_Tivi>";
  var parser = new DOMParser();
  var Result_List_Items = parser.parseFromString(xmlString, "text/xml");

  for (let i = 0; i < List_Items_Data.length; i++) {
    if (List_Items_Data[i].nodeType != 1) {
      continue;
    }

    let Item_Name = List_Items_Data[i].getAttribute("Ten").toUpperCase();
    if (Item_Name.indexOf(Query_String) >= 0) {
      var newNode = Result_List_Items.importNode(List_Items_Data[i], true);
      Result_List_Items.getElementsByTagName("Danh_sach_Tivi")[0].appendChild(
        newNode
      );
    }
  }

  return Result_List_Items.getElementsByTagName("Tivi");
}

function Func_Update_Sale_Price() {
  var Ma_so = document.getElementById("Html_TV_Serinumber").value;

  var Don_gia = parseInt(document.getElementById("Html_Unit_Price").value);
  if (isNaN(Don_gia)) {
    alert("Đơn giá bạn nhập không phù hợp");
    return;
  }

  var Tham_so = `Ma_so_Xu_ly=Cap_nhat_Gia_ban`;
  var Tham_so_XML = `<Tham_so Ma_so="${Ma_so}" Don_gia="${Don_gia}"></Tham_so>`;

  var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}?${Tham_so}`;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", Dia_chi_Xu_ly, false);
  xhr.send(Tham_so_XML);
  let responseXML = xhr.responseText.trim();

  let parser = new DOMParser();
  if (responseXML != "") {
    let xmlDoc = parser.parseFromString(responseXML, "text/xml");
    alert(xmlDoc.getElementsByTagName("Ket_qua")[0].childNodes[0].nodeValue);
  }

  //global_XML_Doc_Data = GET_XML_ITEMS_INFO();
  location.reload();
}

function Func_Group_TV_Amount_Revenue(List_Items_Data) {
  var resultAmount = {};
  var resultRevenue = {};

  for (let i = 0; i < List_Items_Data.length; i++) {
    if (List_Items_Data[i].nodeType != 1) {
      continue;
    }

    var So_luong_Ton = parseInt(
      List_Items_Data[i].getAttribute("So_luong_Ton")
    );
    var Doanh_thu = parseInt(List_Items_Data[i].getAttribute("Doanh_thu"));

    var Nhom_TV_Element = List_Items_Data[i].getElementsByTagName(
      "Nhom_Tivi"
    )[0];
    var Ten_nhom = Nhom_TV_Element.getAttribute("Ten");

    var curr_So_luong = resultAmount[Ten_nhom];
    if (isNaN(curr_So_luong)) {
      curr_So_luong = 0;
    }

    var curr_Doanh_thu = resultRevenue[Ten_nhom];
    if (isNaN(curr_Doanh_thu)) {
      curr_Doanh_thu = 0;
    }

    resultAmount[Ten_nhom] = parseInt(curr_So_luong) + parseInt(So_luong_Ton);
    resultRevenue[Ten_nhom] = parseInt(curr_Doanh_thu) + parseInt(Doanh_thu);
  }

  var finalResult = {};
  finalResult["Amount"] = resultAmount;
  finalResult["Revenue"] = resultRevenue;
  return finalResult;
}
//************** Xử lý Lưu trữ ***********
function GET_XML_ITEMS_INFO() {
  var Tham_so = "Ma_so_Xu_ly=Doc_Du_lieu&id=Quan_ly_Ban_hang";
  var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}?${Tham_so}`;

  let xmlDoc = null;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", Dia_chi_Xu_ly, false);
  xhr.send("");
  let XML_String = xhr.responseText.trim();

  let parser = new DOMParser();
  if (XML_String != "") {
    xmlDoc = parser.parseFromString(XML_String, "text/xml");
  }

  return xmlDoc;
}

function GET_XML_REVENUE_STAFF() {
  var Tham_so = "Ma_so_Xu_ly=Du_lieu_Nhan_vien_Ban_hang";
  var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}?${Tham_so}`;

  let xmlDoc = null;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", Dia_chi_Xu_ly, false);
  xhr.send("");
  let XML_String = xhr.responseText.trim();

  let parser = new DOMParser();
  if (XML_String != "") {
    xmlDoc = parser.parseFromString(XML_String, "text/xml");
  }

  return xmlDoc;
}

function GET_XML_SHOP_INFO() {
  var Tham_so = "Ma_so_Xu_ly=Doc_Du_lieu&id=Cua_hang";
  var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}?${Tham_so}`;

  let xmlDoc = null;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", Dia_chi_Xu_ly, false);
  xhr.send("");
  let XML_String = xhr.responseText.trim();

  let parser = new DOMParser();
  if (XML_String != "") {
    xmlDoc = parser.parseFromString(XML_String, "text/xml");
  }

  return xmlDoc;
}
