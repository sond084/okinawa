(function () {
  var storageKey = "okinawa-passport-atlas-data";
  var activeIndex = 0;
  var activeDay = 0;
  var startX = 0;
  var deferredPrompt = null;
  var editMode = null;

  var defaultData = {
    trip: {
      title: "Okinawa Passport Atlas",
      dates: "10.21 - 10.25",
      route: ["TPE", "OKA", "NAHA", "ONNA", "CHATAN"]
    },
    flights: {
      outboundAirline: "Peach MM923",
      outboundDate: "10.21",
      outboundFrom: "TPE",
      outboundTo: "OKA",
      outboundTime: "10:25 - 13:05",
      returnAirline: "Peach MM922",
      returnDate: "10.25",
      returnFrom: "OKA",
      returnTo: "TPE",
      returnTime: "16:20 - 17:05"
    },
    lodging: [
      { date: "10.21", name: "Naha Makishi Stay", area: "那霸 / 國際通", query: "Kokusai Dori Okinawa" },
      { date: "10.22 - 10.24", name: "Onna Ocean Front", area: "恩納 / 海景飯店", query: "Onna Village Okinawa hotel" },
      { date: "10.24", name: "Chatan Sunset Room", area: "北谷 / 美國村", query: "American Village Okinawa" }
    ],
    rental: {
      company: "OTS Rent a Car",
      pickup: "10.21 15:20",
      returnAt: "10.25 13:20",
      query: "OTS Rent a Car Naha Airport"
    },
    checklist: [
      { label: "護照", done: false },
      { label: "駕照譯本", done: false },
      { label: "電子機票", done: false },
      { label: "住宿確認", done: false },
      { label: "租車預約", done: false },
      { label: "eSIM / 網卡", done: false },
      { label: "行動電源", done: false },
      { label: "防曬用品", done: false },
      { label: "藥妝清單", done: false }
    ],
    journal: "想記錄的餐廳、購物、拍照點都可以寫在這裡。資料會存在目前這台裝置。",
    days: [
      {
        title: "那霸初日",
        subtitle: "抵達、取車、海邊夕陽與國際通",
        area: "NAHA",
        bg: "okinawa-beach.png",
        photoLabel: "Day 01",
        note: "第一天不要排太滿，把重點放在順利入境、取車與熟悉沖繩節奏。",
        stops: [
          { time: "13:05", name: "那霸機場", desc: "入境、領行李、確認 SIM/eSIM。", query: "Naha Airport International Terminal", tag: "Arrival" },
          { time: "15:20", name: "OTS 取車", desc: "確認 ETC、保險、車況拍照。", query: "OTS Rent a Car Naha Airport", tag: "Drive" },
          { time: "16:40", name: "瀨長島 Umikaji Terrace", desc: "海景咖啡、夕陽與第一組沖繩照片。", query: "Umikaji Terrace Okinawa", tag: "Sunset" },
          { time: "19:00", name: "國際通", desc: "晚餐、藥妝、伴手禮初逛。", query: "Kokusai Dori Okinawa", tag: "Night" }
        ]
      },
      {
        title: "南部文化線",
        subtitle: "首里城、玉泉洞、海景咖啡",
        area: "SOUTH",
        bg: "okinawa-drive.png",
        photoLabel: "Day 02",
        note: "南部景點距離不會太誇張，中間安排咖啡時間，避免整天都在趕路。",
        stops: [
          { time: "09:00", name: "首里城公園", desc: "早上光線漂亮，適合慢慢走城牆與展館。", query: "Shurijo Castle Park", tag: "Culture" },
          { time: "11:20", name: "沖繩世界", desc: "玉泉洞、王國村與傳統表演。", query: "Okinawa World", tag: "Cave" },
          { time: "14:40", name: "浜邊茶屋", desc: "海邊座位放空，補一段真正的度假感。", query: "Hama Cafe Okinawa", tag: "Cafe" },
          { time: "17:30", name: "恩納住宿 Check-in", desc: "回飯店休息，晚上保留彈性。", query: "Onna Village Okinawa hotel", tag: "Stay" }
        ]
      },
      {
        title: "北部海線",
        subtitle: "萬座毛、古宇利橋、美麗海水族館",
        area: "NORTH",
        bg: "okinawa-aquarium.png",
        photoLabel: "Day 03",
        note: "這天移動距離較長，建議早點出門，水族館至少保留三小時。",
        stops: [
          { time: "09:00", name: "萬座毛", desc: "經典海崖景色，停留不用太久但很值得拍。", query: "Cape Manzamo", tag: "Cliff" },
          { time: "11:00", name: "古宇利大橋", desc: "開車跨海，沿路找觀景點停一下。", query: "Kouri Bridge Okinawa", tag: "Bridge" },
          { time: "13:40", name: "美麗海水族館", desc: "黑潮之海、鯨鯊與海豚劇場。", query: "Okinawa Churaumi Aquarium", tag: "Aquarium" },
          { time: "17:20", name: "備瀨福木林道", desc: "黃昏散步，像走進沖繩老照片。", query: "Bise Fukugi Tree Road", tag: "Walk" }
        ]
      },
      {
        title: "北谷購物夜",
        subtitle: "Rycom、美國村、夕陽海灘",
        area: "CHATAN",
        bg: "okinawa-american-village.png",
        photoLabel: "Day 04",
        note: "這天安排得比較輕鬆，白天購物，傍晚把時間留給美國村夜景。",
        stops: [
          { time: "10:30", name: "AEON Mall Rycom", desc: "購物、午餐、補伴手禮。", query: "AEON MALL Okinawa Rycom", tag: "Shop" },
          { time: "14:20", name: "美國村", desc: "彩色街景、咖啡、選物店與摩天輪周邊。", query: "American Village Okinawa", tag: "Photo" },
          { time: "17:40", name: "Sunset Beach", desc: "看夕陽，適合拍剪影與海邊散步。", query: "Sunset Beach Chatan", tag: "Sunset" },
          { time: "19:30", name: "DMM Kariyushi Aquarium", desc: "雨天或晚上都適合的室內行程。", query: "DMM Kariyushi Aquarium", tag: "Night" }
        ]
      },
      {
        title: "回程慢收尾",
        subtitle: "波上宮、Outlet、還車與機場",
        area: "NAHA",
        bg: "okinawa-beach.png",
        photoLabel: "Day 05",
        note: "最後一天以不誤機為最高原則，購物和午餐都排在機場附近。",
        stops: [
          { time: "09:00", name: "波上宮", desc: "沖繩海邊神社，回程前簡單走走。", query: "Naminoue Shrine", tag: "Shrine" },
          { time: "10:20", name: "ASHIBINAA Outlet", desc: "最後採買、吃午餐、整理行李。", query: "Okinawa Outlet Mall Ashibinaa", tag: "Outlet" },
          { time: "13:20", name: "OTS 還車", desc: "加油、還車、搭接駁回機場。", query: "OTS Rent a Car Naha Airport", tag: "Return" },
          { time: "14:30", name: "那霸機場", desc: "Check-in、托運、最後伴手禮。", query: "Naha Airport International Terminal", tag: "Airport" }
        ]
      }
    ]
  };

  var pages = [
    { key: "cover", label: "封面", title: "Passport Atlas" },
    { key: "flight", label: "航班", title: "Flight Pass" },
    { key: "day", day: 0, label: "D1", title: "那霸初日" },
    { key: "day", day: 1, label: "D2", title: "南部文化線" },
    { key: "day", day: 2, label: "D3", title: "北部海線" },
    { key: "day", day: 3, label: "D4", title: "北谷購物夜" },
    { key: "day", day: 4, label: "D5", title: "回程慢收尾" },
    { key: "map", label: "導航", title: "Map Hub" },
    { key: "check", label: "清單", title: "Checklist" },
    { key: "journal", label: "旅誌", title: "Journal" }
  ];

  var data = loadData();
  var app = document.getElementById("app");
  var stage = document.getElementById("stage");
  var dock = document.getElementById("dock");
  var pageName = document.getElementById("pageName");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var editor = document.getElementById("editor");
  var editorTitle = document.getElementById("editorTitle");
  var editorBody = document.getElementById("editorBody");

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadData() {
    try {
      return Object.assign(clone(defaultData), JSON.parse(localStorage.getItem(storageKey) || "{}"));
    } catch (error) {
      return clone(defaultData);
    }
  }

  function saveData() {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char];
    });
  }

  function maps(query) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function directions(stops) {
    var names = stops.map(function (stop) { return stop.query; });
    return "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(names[0]) + "&destination=" + encodeURIComponent(names[names.length - 1]) + "&waypoints=" + encodeURIComponent(names.slice(1, -1).join("|")) + "&travelmode=driving";
  }

  function setBackground(image) {
    app.style.backgroundImage = "linear-gradient(120deg, rgba(255, 245, 220, .54), rgba(189, 246, 255, .32)), url('" + image + "')";
  }

  function renderDock() {
    dock.innerHTML = pages.map(function (page, index) {
      return '<button class="' + (index === activeIndex ? "active" : "") + '" data-page="' + index + '">' + esc(page.label) + '</button>';
    }).join("");
  }

  function routeMarkup() {
    return data.trip.route.map(function (item) {
      return '<span>' + esc(item) + '</span>';
    }).join("");
  }

  function renderCover() {
    setBackground("okinawa-beach.png");
    return '<article class="page cover-page active">' +
      '<section class="cover-copy">' +
        '<p class="eyebrow">SUMMER PASSPORT / DRIVE & DISCOVER</p>' +
        '<h1>Okinawa<br>Atlas</h1>' +
        '<p class="lead">把航班、住宿、租車、每日路線、導航、清單與旅遊備忘整理成一份手機裡真的會用的旅行手冊。</p>' +
        '<div class="actions"><button class="btn" data-jump="2">開始看行程</button><button class="btn soft" data-edit="trip">修改資料</button><button class="btn soft" data-install>加入主畫面</button></div>' +
      '</section>' +
      '<aside class="paper">' +
        '<div class="stamp">OKA<br>ENTRY</div>' +
        '<p class="kicker">' + esc(data.trip.dates) + '</p>' +
        '<h3>' + esc(data.trip.title) + '</h3>' +
        '<div class="route-ribbon">' + routeMarkup() + '</div>' +
        '<p>像護照、雜誌、登機證混在一起的沖繩行程 App。左右滑動翻頁，按景點可直接開 Google Maps。</p>' +
      '</aside>' +
      '<div class="photo-stack" aria-hidden="true"><div class="polaroid one"></div><div class="polaroid two"></div><div class="polaroid three"></div></div>' +
    '</article>';
  }

  function renderFlight() {
    setBackground("okinawa-drive.png");
    var lodging = data.lodging.map(function (stay) {
      return '<article class="paper"><p class="kicker">' + esc(stay.date) + '</p><h3>' + esc(stay.name) + '</h3><p>' + esc(stay.area) + '</p><a class="link-btn soft" target="_blank" rel="noreferrer" href="' + maps(stay.query) + '">開地圖</a></article>';
    }).join("");

    return '<article class="page magazine-page active">' +
      '<section class="feature-photo" style="background-image:url(okinawa-drive.png)" data-label="Flight"></section>' +
      '<section class="content-scroll">' +
        '<div class="paper"><p class="eyebrow">FLIGHT INFORMATION</p><h2>登機資訊<br>與住宿租車</h2><div class="tickets">' +
          flightTicket("去程", data.flights.outboundAirline, data.flights.outboundDate, data.flights.outboundFrom, data.flights.outboundTo, data.flights.outboundTime) +
          flightTicket("回程", data.flights.returnAirline, data.flights.returnDate, data.flights.returnFrom, data.flights.returnTo, data.flights.returnTime) +
        '</div><div class="actions"><button class="btn" data-edit="flight">修改機票</button><a class="link-btn soft" target="_blank" rel="noreferrer" href="' + maps(data.rental.query) + '">租車導航</a></div></div>' +
        '<div class="two-col">' + lodging + '<article class="paper"><p class="kicker">RENTAL CAR</p><h3>' + esc(data.rental.company) + '</h3><p>取車：' + esc(data.rental.pickup) + '<br>還車：' + esc(data.rental.returnAt) + '</p></article></div>' +
      '</section>' +
    '</article>';
  }

  function flightTicket(label, airline, date, from, to, time) {
    return '<article class="ticket"><p class="kicker">' + esc(label) + ' / ' + esc(date) + '</p><strong>' + esc(airline) + '</strong><div class="airport-row"><span>' + esc(from) + '</span><i></i><span>' + esc(to) + '</span></div><p>' + esc(time) + '</p></article>';
  }

  function renderDay(dayIndex) {
    activeDay = dayIndex;
    var day = data.days[dayIndex];
    setBackground(day.bg);
    var stops = day.stops.map(function (stop) {
      return '<article class="stop"><div class="time">' + esc(stop.time) + '</div><div><strong>' + esc(stop.name) + '</strong><p>' + esc(stop.desc) + '</p><span class="chip">' + esc(stop.tag) + '</span></div><a class="link-btn" target="_blank" rel="noreferrer" href="' + maps(stop.query) + '">導航</a></article>';
    }).join("");
    var dayTabs = data.days.map(function (item, index) {
      return '<button class="' + (index === dayIndex ? "active" : "") + '" data-day="' + index + '">' + esc(item.area) + '</button>';
    }).join("");

    return '<article class="page magazine-page active">' +
      '<section class="feature-photo" style="background-image:url(' + day.bg + ')" data-label="' + esc(day.photoLabel) + '"></section>' +
      '<section class="content-scroll">' +
        '<div class="paper"><p class="eyebrow">DAILY ROUTE / ' + esc(day.area) + '</p><h2>' + esc(day.title) + '</h2><p>' + esc(day.subtitle) + '</p><p>' + esc(day.note) + '</p><div class="mini-map">' + dayTabs + '</div><div class="actions"><a class="link-btn" target="_blank" rel="noreferrer" href="' + directions(day.stops) + '">整天路線導航</a><button class="btn soft" data-edit="day">修改本日行程</button></div></div>' +
        '<div class="timeline">' + stops + '</div>' +
      '</section>' +
    '</article>';
  }

  function renderMap() {
    setBackground("okinawa-american-village.png");
    var cards = data.days.map(function (day, index) {
      return '<article class="paper"><p class="kicker">DAY ' + (index + 1) + ' / ' + esc(day.area) + '</p><h3>' + esc(day.title) + '</h3><p>' + esc(day.subtitle) + '</p><div class="actions"><a class="link-btn" target="_blank" rel="noreferrer" href="' + directions(day.stops) + '">整日導航</a><button class="btn soft" data-jump="' + (index + 2) + '">看行程</button></div></article>';
    }).join("");
    return '<article class="page active"><section class="paper"><p class="eyebrow">MAP HUB</p><h2>一鍵導航<br>不迷路</h2><p>每一天都有整日路線，也可以在行程頁點單一景點直接開 Google Maps。</p></section><section class="two-col content-scroll">' + cards + '</section></article>';
  }

  function renderChecklist() {
    setBackground("okinawa-aquarium.png");
    var items = data.checklist.map(function (item, index) {
      return '<label class="check"><input type="checkbox" data-check="' + index + '" ' + (item.done ? "checked" : "") + '><strong>' + esc(item.label) + '</strong></label>';
    }).join("");
    return '<article class="page active"><section class="paper"><p class="eyebrow">PACKING & TRAVEL TIPS</p><h2>出發前<br>確認清單</h2><p>勾選狀態會存在目前裝置，手機打開也可以接著用。</p><div class="actions"><button class="btn soft" data-edit="checklist">修改清單</button></div></section><section class="tool-grid content-scroll">' + items + '</section></article>';
  }

  function renderJournal() {
    setBackground("okinawa-beach.png");
    return '<article class="page active"><section class="paper"><p class="eyebrow">TRAVEL JOURNAL</p><h2>旅行備忘<br>與靈感收集</h2><p>這裡適合放餐廳、購物、想拍的角度、朋友交代的伴手禮。內容存在目前裝置。</p></section><section class="paper"><textarea id="journalText" class="journal-area">' + esc(data.journal) + '</textarea><div class="actions"><button class="btn" data-save-journal>儲存備忘</button><button class="btn soft" data-jump="0">回封面</button></div></section></article>';
  }

  function render() {
    var page = pages[activeIndex];
    pageName.textContent = page.title;
    renderDock();
    if (page.key === "cover") stage.innerHTML = renderCover();
    if (page.key === "flight") stage.innerHTML = renderFlight();
    if (page.key === "day") stage.innerHTML = renderDay(page.day);
    if (page.key === "map") stage.innerHTML = renderMap();
    if (page.key === "check") stage.innerHTML = renderChecklist();
    if (page.key === "journal") stage.innerHTML = renderJournal();
  }

  function go(index) {
    activeIndex = (index + pages.length) % pages.length;
    render();
  }

  function openEditor(mode) {
    editMode = mode;
    if (mode === "trip") {
      editorTitle.textContent = "修改旅行基本資料";
      editorBody.innerHTML =
        field("tripTitle", "手冊名稱", data.trip.title) +
        field("tripDates", "日期", data.trip.dates) +
        field("tripRoute", "路線，用逗號分隔", data.trip.route.join(", "));
    }
    if (mode === "flight") {
      editorTitle.textContent = "修改機票與租車";
      editorBody.innerHTML =
        field("outboundAirline", "去程航空 / 航班", data.flights.outboundAirline) +
        field("outboundTime", "去程時間", data.flights.outboundTime) +
        field("returnAirline", "回程航空 / 航班", data.flights.returnAirline) +
        field("returnTime", "回程時間", data.flights.returnTime) +
        field("rentalCompany", "租車公司", data.rental.company) +
        field("rentalPickup", "取車時間", data.rental.pickup) +
        field("rentalReturn", "還車時間", data.rental.returnAt);
    }
    if (mode === "day") {
      var day = data.days[activeDay];
      editorTitle.textContent = "修改 " + day.title;
      editorBody.innerHTML =
        field("dayTitle", "標題", day.title) +
        field("daySubtitle", "副標", day.subtitle) +
        textarea("dayNote", "提醒文字", day.note) +
        textarea("dayStops", "行程，每行格式：時間 | 地點 | 說明 | Google 地圖關鍵字 | 標籤", day.stops.map(function (stop) {
          return [stop.time, stop.name, stop.desc, stop.query, stop.tag].join(" | ");
        }).join("\n"));
    }
    if (mode === "checklist") {
      editorTitle.textContent = "修改清單";
      editorBody.innerHTML = textarea("checklistItems", "每行一個項目", data.checklist.map(function (item) { return item.label; }).join("\n"));
    }
    editor.showModal();
  }

  function field(id, label, value) {
    return '<label class="field">' + esc(label) + '<input id="' + id + '" value="' + esc(value) + '"></label>';
  }

  function textarea(id, label, value) {
    return '<label class="field">' + esc(label) + '<textarea id="' + id + '" rows="7">' + esc(value) + '</textarea></label>';
  }

  function val(id) {
    return document.getElementById(id).value.trim();
  }

  function saveEditor() {
    if (editMode === "trip") {
      data.trip.title = val("tripTitle") || data.trip.title;
      data.trip.dates = val("tripDates") || data.trip.dates;
      data.trip.route = val("tripRoute").split(",").map(function (item) { return item.trim(); }).filter(Boolean);
    }
    if (editMode === "flight") {
      data.flights.outboundAirline = val("outboundAirline");
      data.flights.outboundTime = val("outboundTime");
      data.flights.returnAirline = val("returnAirline");
      data.flights.returnTime = val("returnTime");
      data.rental.company = val("rentalCompany");
      data.rental.pickup = val("rentalPickup");
      data.rental.returnAt = val("rentalReturn");
    }
    if (editMode === "day") {
      var day = data.days[activeDay];
      day.title = val("dayTitle") || day.title;
      day.subtitle = val("daySubtitle") || day.subtitle;
      day.note = val("dayNote") || day.note;
      day.stops = val("dayStops").split("\n").map(function (line) {
        var parts = line.split("|").map(function (part) { return part.trim(); });
        return { time: parts[0] || "", name: parts[1] || "", desc: parts[2] || "", query: parts[3] || parts[1] || "", tag: parts[4] || "Stop" };
      }).filter(function (stop) { return stop.time && stop.name; });
    }
    if (editMode === "checklist") {
      data.checklist = val("checklistItems").split("\n").map(function (line) {
        return { label: line.trim(), done: false };
      }).filter(function (item) { return item.label; });
    }
    saveData();
    render();
  }

  function bindEvents() {
    prevBtn.addEventListener("click", function () { go(activeIndex - 1); });
    nextBtn.addEventListener("click", function () { go(activeIndex + 1); });

    dock.addEventListener("click", function (event) {
      var button = event.target.closest("[data-page]");
      if (button) go(Number(button.dataset.page));
    });

    stage.addEventListener("click", function (event) {
      var jump = event.target.closest("[data-jump]");
      var day = event.target.closest("[data-day]");
      var edit = event.target.closest("[data-edit]");
      var check = event.target.closest("[data-check]");

      if (jump) go(Number(jump.dataset.jump));
      if (day) go(Number(day.dataset.day) + 2);
      if (edit) openEditor(edit.dataset.edit);
      if (check) {
        data.checklist[Number(check.dataset.check)].done = check.checked;
        saveData();
      }
      if (event.target.closest("[data-save-journal]")) {
        data.journal = document.getElementById("journalText").value;
        saveData();
        event.target.textContent = "已儲存";
      }
      if (event.target.closest("[data-install]") && deferredPrompt) {
        deferredPrompt.prompt();
      }
    });

    stage.addEventListener("touchstart", function (event) {
      startX = event.changedTouches[0].clientX;
    }, { passive: true });

    stage.addEventListener("touchend", function (event) {
      var diff = event.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 55) go(activeIndex + (diff < 0 ? 1 : -1));
    }, { passive: true });

    window.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") go(activeIndex + 1);
      if (event.key === "ArrowLeft") go(activeIndex - 1);
    });

    window.addEventListener("beforeinstallprompt", function (event) {
      event.preventDefault();
      deferredPrompt = event;
    });

    document.getElementById("cancelEdit").addEventListener("click", function () {
      editor.close();
    });

    document.getElementById("closeEdit").addEventListener("click", function () {
      editor.close();
    });

    document.getElementById("resetEdit").addEventListener("click", function () {
      localStorage.removeItem(storageKey);
      data = loadData();
      editor.close();
      render();
    });

    editor.querySelector("form").addEventListener("submit", function (event) {
      event.preventDefault();
      saveEditor();
      editor.close();
    });
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js");
    });
  }

  bindEvents();
  render();
}());
