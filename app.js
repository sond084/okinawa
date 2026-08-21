(function () {
  var key = "okinawa-kinetic-journey-data";
  var pageIndex = 0;
  var dayIndex = 0;
  var touchX = 0;
  var editMode = "";
  var deferredPrompt = null;

  var defaults = {
    title: "Okinawa Journey Book",
    dates: "10.21 - 10.25",
    route: ["TPE", "OKA", "NAHA", "ONNA", "CHATAN"],
    flights: {
      goNo: "Peach MM923",
      goDate: "10.21",
      goFrom: "TPE",
      goTo: "OKA",
      goTime: "10:25 - 13:05",
      backNo: "Peach MM922",
      backDate: "10.25",
      backFrom: "OKA",
      backTo: "TPE",
      backTime: "16:20 - 17:05"
    },
    car: {
      company: "OTS Rent a Car",
      pickup: "10.21 15:20",
      returnAt: "10.25 13:20",
      query: "OTS Rent a Car Naha Airport"
    },
    stays: [
      { date: "10.21", name: "Naha Makishi Stay", area: "那霸 / 國際通", query: "Kokusai Dori Okinawa" },
      { date: "10.22 - 10.24", name: "Onna Ocean Front", area: "恩納 / 海景飯店", query: "Onna Village Okinawa hotel" },
      { date: "10.24", name: "Chatan Sunset Room", area: "北谷 / 美國村", query: "American Village Okinawa" }
    ],
    checklist: [
      { label: "護照", done: false },
      { label: "駕照譯本", done: false },
      { label: "電子機票", done: false },
      { label: "住宿確認", done: false },
      { label: "租車預約", done: false },
      { label: "行動電源", done: false },
      { label: "eSIM / 網卡", done: false },
      { label: "防曬用品", done: false },
      { label: "藥妝清單", done: false }
    ],
    journal: "想吃的餐廳、朋友託買、必拍照片、臨時靈感都可以寫在這裡。資料只存在這台手機或電腦。",
    days: [
      {
        title: "那霸初日",
        subtitle: "抵達、取車、海邊夕陽與國際通",
        area: "NAHA",
        mood: "慢慢進入沖繩節奏",
        bg: "okinawa-beach.png",
        stops: [
          { time: "13:05", name: "那霸機場", desc: "入境、領行李、確認 SIM/eSIM。", query: "Naha Airport International Terminal", tag: "抵達" },
          { time: "15:20", name: "OTS 取車", desc: "確認保險、ETC、車況拍照。", query: "OTS Rent a Car Naha Airport", tag: "租車" },
          { time: "16:40", name: "瀨長島 Umikaji Terrace", desc: "海景咖啡、夕陽、第一組沖繩照片。", query: "Umikaji Terrace Okinawa", tag: "夕陽" },
          { time: "19:00", name: "國際通", desc: "晚餐、藥妝、伴手禮初逛。", query: "Kokusai Dori Okinawa", tag: "夜逛" }
        ]
      },
      {
        title: "南部文化線",
        subtitle: "首里城、玉泉洞、海景咖啡",
        area: "SOUTH",
        mood: "文化與海景的輕鬆日",
        bg: "okinawa-drive.png",
        stops: [
          { time: "09:00", name: "首里城公園", desc: "早上光線漂亮，適合慢慢走城牆。", query: "Shurijo Castle Park", tag: "文化" },
          { time: "11:20", name: "沖繩世界", desc: "玉泉洞、王國村、傳統表演。", query: "Okinawa World", tag: "洞穴" },
          { time: "14:40", name: "浜邊茶屋", desc: "海邊座位放空，補一段度假感。", query: "Hama Cafe Okinawa", tag: "咖啡" },
          { time: "17:30", name: "恩納住宿", desc: "Check-in，晚上保留彈性。", query: "Onna Village Okinawa hotel", tag: "住宿" }
        ]
      },
      {
        title: "北部海線",
        subtitle: "萬座毛、古宇利橋、美麗海水族館",
        area: "NORTH",
        mood: "整趟旅行最像公路電影的一天",
        bg: "okinawa-aquarium.png",
        stops: [
          { time: "09:00", name: "萬座毛", desc: "經典海崖景色，停留短但很值得拍。", query: "Cape Manzamo", tag: "海崖" },
          { time: "11:00", name: "古宇利大橋", desc: "跨海開車，沿路找觀景點停一下。", query: "Kouri Bridge Okinawa", tag: "跨海" },
          { time: "13:40", name: "美麗海水族館", desc: "黑潮之海、鯨鯊與海豚劇場。", query: "Okinawa Churaumi Aquarium", tag: "水族館" },
          { time: "17:20", name: "備瀨福木林道", desc: "黃昏散步，像走進沖繩老照片。", query: "Bise Fukugi Tree Road", tag: "散步" }
        ]
      },
      {
        title: "北谷購物夜",
        subtitle: "Rycom、美國村、夕陽海灘",
        area: "CHATAN",
        mood: "購物、彩色街景、夕陽與夜景",
        bg: "okinawa-american-village.png",
        stops: [
          { time: "10:30", name: "AEON Mall Rycom", desc: "購物、午餐、補伴手禮。", query: "AEON MALL Okinawa Rycom", tag: "購物" },
          { time: "14:20", name: "美國村", desc: "彩色街景、咖啡、選物店。", query: "American Village Okinawa", tag: "拍照" },
          { time: "17:40", name: "Sunset Beach", desc: "看夕陽，適合拍剪影。", query: "Sunset Beach Chatan", tag: "夕陽" },
          { time: "19:30", name: "DMM Kariyushi Aquarium", desc: "雨天或晚上都適合的室內行程。", query: "DMM Kariyushi Aquarium", tag: "夜間" }
        ]
      },
      {
        title: "回程慢收尾",
        subtitle: "波上宮、Outlet、還車與機場",
        area: "NAHA",
        mood: "不誤機就是最大勝利",
        bg: "okinawa-beach.png",
        stops: [
          { time: "09:00", name: "波上宮", desc: "海邊神社，回程前簡單走走。", query: "Naminoue Shrine", tag: "神社" },
          { time: "10:20", name: "ASHIBINAA Outlet", desc: "最後採買、午餐、整理行李。", query: "Okinawa Outlet Mall Ashibinaa", tag: "Outlet" },
          { time: "13:20", name: "OTS 還車", desc: "加油、還車、搭接駁回機場。", query: "OTS Rent a Car Naha Airport", tag: "還車" },
          { time: "14:30", name: "那霸機場", desc: "Check-in、托運、最後伴手禮。", query: "Naha Airport International Terminal", tag: "回程" }
        ]
      }
    ]
  };

  var data = load();
  var pages = [
    { key: "home", label: "首頁", title: "Journey Book" },
    { key: "today", label: "今日", title: "Today Route" },
    { key: "days", label: "每日", title: "Daily Book" },
    { key: "map", label: "導航", title: "Map Hub" },
    { key: "wallet", label: "票券", title: "Travel Wallet" },
    { key: "check", label: "清單", title: "Checklist" },
    { key: "journal", label: "旅誌", title: "Journal" }
  ];

  var app = document.getElementById("app");
  var viewport = document.getElementById("viewport");
  var bottomNav = document.getElementById("bottomNav");
  var screenTitle = document.getElementById("screenTitle");
  var dialog = document.getElementById("editDialog");
  var editTitle = document.getElementById("editTitle");
  var editBody = document.getElementById("editBody");

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(key) || "null");
      return saved || clone(defaults);
    } catch (error) {
      return clone(defaults);
    }
  }

  function save() {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char];
    });
  }

  function maps(query) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function route(stops) {
    var names = stops.map(function (stop) { return stop.query; });
    return "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(names[0]) + "&destination=" + encodeURIComponent(names[names.length - 1]) + "&waypoints=" + encodeURIComponent(names.slice(1, -1).join("|")) + "&travelmode=driving";
  }

  function bg(image) {
    app.style.backgroundImage = "radial-gradient(circle at 78% 14%, rgba(255, 200, 103, .55), transparent 16rem), linear-gradient(135deg, rgba(255, 244, 215, .52), rgba(199, 248, 255, .32)), url('" + image + "')";
  }

  function doneCount() {
    return data.checklist.filter(function (item) { return item.done; }).length;
  }

  function progress() {
    return Math.round((doneCount() / data.checklist.length) * 100) || 0;
  }

  function routeStrip() {
    return data.route.map(function (item) {
      return "<span>" + esc(item) + "</span>";
    }).join("");
  }

  function renderNav() {
    bottomNav.innerHTML = pages.map(function (page, index) {
      return '<button class="' + (index === pageIndex ? "active" : "") + '" data-page="' + index + '">' + esc(page.label) + "</button>";
    }).join("");
  }

  function home() {
    var d = data.days[dayIndex];
    bg(d.bg);
    return '<article class="screen hero-screen active">' +
      '<section class="hero-copy">' +
        '<p class="label">SMART TRAVEL BOOK / OKINAWA</p>' +
        '<h1>Trip<br>Board</h1>' +
        '<p class="lead">不是一頁式網站，而是一套可以滑動、可編輯、可導航的行程書。打開就知道今天去哪、下一站怎麼走、還缺什麼東西。</p>' +
        '<div class="toolbar"><button class="btn" data-page="1">看今日安排</button><button class="btn ghost" data-edit="trip">修改旅程</button><button class="btn ghost" data-install>加入主畫面</button></div>' +
        '<div class="quick-grid">' +
          '<button class="tile" data-page="3"><b>MAP</b><strong>一鍵導航</strong><p>每日路線與單點地圖</p></button>' +
          '<button class="tile" data-page="4"><b>WALLET</b><strong>票券資訊</strong><p>航班、住宿、租車</p></button>' +
          '<button class="tile" data-page="5"><b>READY</b><strong>' + progress() + '% 完成</strong><p>出發前確認清單</p></button>' +
        '</div>' +
      '</section>' +
      '<aside class="glass mission-card">' +
        '<div class="passport-stamp">OKA<br>ENTRY</div>' +
        '<p class="label">' + esc(data.dates) + '</p>' +
        '<h3>' + esc(data.title) + '</h3>' +
        '<div class="route-strip">' + routeStrip() + '</div>' +
        '<p>目前選定：' + esc(d.title) + '。下一站是 <b>' + esc(d.stops[0].name) + '</b>，你可以左右滑動翻頁。</p>' +
        '<div class="actions"><a class="map-link" target="_blank" rel="noreferrer" href="' + route(d.stops) + '">今日路線導航</a></div>' +
      '</aside>' +
    '</article>';
  }

  function today() {
    return dayPage(dayIndex, true);
  }

  function days() {
    return dayPage(dayIndex, false);
  }

  function dayTabs() {
    return data.days.map(function (d, index) {
      return '<button class="' + (index === dayIndex ? "active" : "") + '" data-day="' + index + '">D' + (index + 1) + ' ' + esc(d.area) + '</button>';
    }).join("");
  }

  function dayPage(index, compact) {
    var d = data.days[index];
    bg(d.bg);
    var cards = d.stops.map(function (stop, stopIndex) {
      return '<article class="stop-card">' +
        '<div class="time">' + esc(stop.time) + '</div>' +
        '<div><h3>' + esc(stop.name) + '</h3><p>' + esc(stop.desc) + '</p><div class="stop-foot"><span class="pill">' + esc(stop.tag) + '</span><a class="map-link ghost" target="_blank" rel="noreferrer" href="' + maps(stop.query) + '">單點導航</a>' + (stopIndex === 0 ? '<span class="pill">Next Stop</span>' : "") + '</div></div>' +
      '</article>';
    }).join("");
    return '<article class="screen mag-screen active">' +
      '<section class="photo-panel" style="background-image:url(' + d.bg + ')"><strong>D' + (index + 1) + '<br>' + esc(d.area) + '</strong></section>' +
      '<section class="content-board">' +
        '<div class="day-head glass"><div><p class="label">' + (compact ? "TODAY FOCUS" : "DAILY ITINERARY") + '</p><h2>' + esc(d.title) + '</h2><p>' + esc(d.subtitle) + '｜' + esc(d.mood) + '</p><div class="day-tabs">' + dayTabs() + '</div></div><div class="actions"><a class="map-link" target="_blank" rel="noreferrer" href="' + route(d.stops) + '">整天導航</a><button class="btn ghost" data-copy-day>複製行程</button><button class="btn ghost" data-edit="day">修改本日</button></div></div>' +
        '<div class="route-board">' + cards + '</div>' +
      '</section>' +
    '</article>';
  }

  function mapHub() {
    bg("okinawa-american-village.png");
    var cards = data.days.map(function (d, index) {
      return '<article class="glass map-card"><p class="label">DAY ' + (index + 1) + ' / ' + esc(d.area) + '</p><h3>' + esc(d.title) + '</h3><p>' + esc(d.subtitle) + '</p><div class="actions"><a class="map-link" target="_blank" rel="noreferrer" href="' + route(d.stops) + '">整日導航</a><button class="btn ghost" data-day="' + index + '">看行程</button></div></article>';
    }).join("");
    return '<article class="screen scroll active"><section class="glass"><p class="label">GOOGLE MAPS HUB</p><h2>所有導航<br>集中在這裡</h2><p>不用在群組裡翻地址。每天一鍵路線，每個景點也能直接導航。</p></section><section class="map-grid">' + cards + '</section></article>';
  }

  function wallet() {
    bg("okinawa-drive.png");
    var stayCards = data.stays.map(function (stay) {
      return '<article class="glass"><p class="label">' + esc(stay.date) + '</p><h3>' + esc(stay.name) + '</h3><p>' + esc(stay.area) + '</p><a class="map-link ghost" target="_blank" rel="noreferrer" href="' + maps(stay.query) + '">住宿地圖</a></article>';
    }).join("");
    return '<article class="screen scroll active"><section class="glass"><p class="label">TRAVEL WALLET</p><h2>航班、住宿<br>租車票夾</h2><div class="actions"><button class="btn" data-edit="flight">修改票券</button><a class="map-link ghost" target="_blank" rel="noreferrer" href="' + maps(data.car.query) + '">租車導航</a></div></section><section class="tickets">' + ticket("去程", data.flights.goNo, data.flights.goDate, data.flights.goFrom, data.flights.goTo, data.flights.goTime) + ticket("回程", data.flights.backNo, data.flights.backDate, data.flights.backFrom, data.flights.backTo, data.flights.backTime) + '</section><section class="split">' + stayCards + '<article class="glass"><p class="label">RENTAL CAR</p><h3>' + esc(data.car.company) + '</h3><p>取車：' + esc(data.car.pickup) + '<br>還車：' + esc(data.car.returnAt) + '</p></article></section></article>';
  }

  function ticket(label, no, date, from, to, time) {
    return '<article class="ticket"><p class="label">' + esc(label) + ' / ' + esc(date) + '</p><h3>' + esc(no) + '</h3><div class="airport-line"><span>' + esc(from) + '</span><i></i><span>' + esc(to) + '</span></div><p>' + esc(time) + '</p></article>';
  }

  function checklist() {
    bg("okinawa-aquarium.png");
    var items = data.checklist.map(function (item, index) {
      return '<label class="check-item"><input type="checkbox" data-check="' + index + '" ' + (item.done ? "checked" : "") + '><span>' + esc(item.label) + '</span></label>';
    }).join("");
    return '<article class="screen scroll active"><section class="day-head glass"><div><p class="label">PACKING SYSTEM</p><h2>出發前<br>確認清單</h2><p>勾選狀態會存在目前手機或電腦。</p><div class="actions"><button class="btn ghost" data-edit="check">修改清單</button></div></div><div class="progress-ring" style="--progress:' + progress() + '%"><span>' + progress() + '%</span></div></section><section class="check-grid">' + items + '</section></article>';
  }

  function journal() {
    bg("okinawa-beach.png");
    return '<article class="screen scroll active"><section class="glass"><p class="label">PRIVATE NOTES</p><h2>旅遊誌<br>與臨時備忘</h2><p>想吃的餐廳、購物清單、拍照點、朋友託買都放這。資料存在本機。</p></section><section class="glass"><textarea class="journal-text" id="journalText">' + esc(data.journal) + '</textarea><div class="actions"><button class="btn" data-save-journal>儲存備忘</button><button class="btn ghost" data-page="0">回首頁</button></div></section></article>';
  }

  function render() {
    var page = pages[pageIndex];
    screenTitle.textContent = page.title;
    renderNav();
    if (page.key === "home") viewport.innerHTML = home();
    if (page.key === "today") viewport.innerHTML = today();
    if (page.key === "days") viewport.innerHTML = days();
    if (page.key === "map") viewport.innerHTML = mapHub();
    if (page.key === "wallet") viewport.innerHTML = wallet();
    if (page.key === "check") viewport.innerHTML = checklist();
    if (page.key === "journal") viewport.innerHTML = journal();
  }

  function go(index) {
    pageIndex = (index + pages.length) % pages.length;
    render();
  }

  function openEdit(mode) {
    editMode = mode;
    if (mode === "trip") {
      editTitle.textContent = "修改旅行基本資料";
      editBody.innerHTML = input("title", "手冊名稱", data.title) + input("dates", "日期", data.dates) + input("routeText", "路線，用逗號分隔", data.route.join(", "));
    }
    if (mode === "flight") {
      editTitle.textContent = "修改航班與租車";
      editBody.innerHTML = input("goNo", "去程航班", data.flights.goNo) + input("goTime", "去程時間", data.flights.goTime) + input("backNo", "回程航班", data.flights.backNo) + input("backTime", "回程時間", data.flights.backTime) + input("carCompany", "租車公司", data.car.company) + input("pickup", "取車時間", data.car.pickup) + input("returnAt", "還車時間", data.car.returnAt);
    }
    if (mode === "day") {
      var d = data.days[dayIndex];
      editTitle.textContent = "修改 " + d.title;
      editBody.innerHTML = input("dayTitle", "標題", d.title) + input("daySubtitle", "副標", d.subtitle) + area("dayMood", "本日提醒", d.mood) + area("stopsText", "行程，每行格式：時間 | 地點 | 說明 | Google地圖關鍵字 | 標籤", d.stops.map(function (s) { return [s.time, s.name, s.desc, s.query, s.tag].join(" | "); }).join("\n"));
    }
    if (mode === "check") {
      editTitle.textContent = "修改清單";
      editBody.innerHTML = area("checkText", "每行一個項目", data.checklist.map(function (item) { return item.label; }).join("\n"));
    }
    dialog.showModal();
  }

  function input(id, label, value) {
    return '<label class="field">' + esc(label) + '<input id="' + id + '" value="' + esc(value) + '"></label>';
  }

  function area(id, label, value) {
    return '<label class="field">' + esc(label) + '<textarea id="' + id + '" rows="7">' + esc(value) + '</textarea></label>';
  }

  function value(id) {
    return document.getElementById(id).value.trim();
  }

  function saveEdit() {
    if (editMode === "trip") {
      data.title = value("title") || data.title;
      data.dates = value("dates") || data.dates;
      data.route = value("routeText").split(",").map(function (item) { return item.trim(); }).filter(Boolean);
    }
    if (editMode === "flight") {
      data.flights.goNo = value("goNo");
      data.flights.goTime = value("goTime");
      data.flights.backNo = value("backNo");
      data.flights.backTime = value("backTime");
      data.car.company = value("carCompany");
      data.car.pickup = value("pickup");
      data.car.returnAt = value("returnAt");
    }
    if (editMode === "day") {
      var d = data.days[dayIndex];
      d.title = value("dayTitle") || d.title;
      d.subtitle = value("daySubtitle") || d.subtitle;
      d.mood = value("dayMood") || d.mood;
      d.stops = value("stopsText").split("\n").map(function (line) {
        var p = line.split("|").map(function (part) { return part.trim(); });
        return { time: p[0] || "", name: p[1] || "", desc: p[2] || "", query: p[3] || p[1] || "", tag: p[4] || "Stop" };
      }).filter(function (s) { return s.time && s.name; });
    }
    if (editMode === "check") {
      data.checklist = value("checkText").split("\n").map(function (line) {
        return { label: line.trim(), done: false };
      }).filter(function (item) { return item.label; });
    }
    save();
    render();
  }

  function bind() {
    document.getElementById("prevPage").addEventListener("click", function () { go(pageIndex - 1); });
    document.getElementById("nextPage").addEventListener("click", function () { go(pageIndex + 1); });

    bottomNav.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-page]");
      if (btn) go(Number(btn.dataset.page));
    });

    viewport.addEventListener("click", function (event) {
      var page = event.target.closest("[data-page]");
      var day = event.target.closest("[data-day]");
      var edit = event.target.closest("[data-edit]");
      var check = event.target.closest("[data-check]");

      if (page) go(Number(page.dataset.page));
      if (day) {
        dayIndex = Number(day.dataset.day);
        pageIndex = 2;
        render();
      }
      if (edit) openEdit(edit.dataset.edit);
      if (check) {
        data.checklist[Number(check.dataset.check)].done = check.checked;
        save();
        render();
      }
      if (event.target.closest("[data-save-journal]")) {
        data.journal = document.getElementById("journalText").value;
        save();
        event.target.textContent = "已儲存";
      }
      if (event.target.closest("[data-copy-day]")) {
        copyDay(event.target);
      }
      if (event.target.closest("[data-install]") && deferredPrompt) {
        deferredPrompt.prompt();
      }
    });

    viewport.addEventListener("touchstart", function (event) {
      touchX = event.changedTouches[0].clientX;
    }, { passive: true });

    viewport.addEventListener("touchend", function (event) {
      var diff = event.changedTouches[0].clientX - touchX;
      if (Math.abs(diff) > 60) go(pageIndex + (diff < 0 ? 1 : -1));
    }, { passive: true });

    window.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") go(pageIndex - 1);
      if (event.key === "ArrowRight") go(pageIndex + 1);
    });

    window.addEventListener("beforeinstallprompt", function (event) {
      event.preventDefault();
      deferredPrompt = event;
    });

    document.getElementById("closeDialog").addEventListener("click", function () { dialog.close(); });
    document.getElementById("cancelDialog").addEventListener("click", function () { dialog.close(); });
    document.getElementById("restoreDefaults").addEventListener("click", function () {
      localStorage.removeItem(key);
      data = load();
      dialog.close();
      render();
    });
    dialog.querySelector("form").addEventListener("submit", function (event) {
      event.preventDefault();
      saveEdit();
      dialog.close();
    });
  }

  function copyDay(target) {
    var d = data.days[dayIndex];
    var text = "沖繩 D" + (dayIndex + 1) + "｜" + d.title + "\n" + d.subtitle + "\n\n" + d.stops.map(function (s) {
      return s.time + " " + s.name + " - " + s.desc;
    }).join("\n");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        target.textContent = "已複製";
      });
    } else {
      target.textContent = "可手動截圖";
    }
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js");
    });
  }

  bind();
  render();
}());
