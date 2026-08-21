(function () {
  var VERSION = "V16 Universal";
  var checklistKey = "okinawa-v15-checklist";
  var noteKey = "okinawa-v15-note";

  var days = [
    {
      tab: "D1",
      title: "那霸入境",
      subtitle: "抵達、取車、瀨長島、國際通",
      image: "beach",
      bg: "okinawa-beach.png",
      note: "第一天把節奏放慢，先適應右駕和那霸市區。",
      stops: [
        ["13:05", "那霸機場", "入境、領行李、拿 SIM/eSIM。", "Naha Airport International Terminal", "60-80 分", "抵達"],
        ["15:20", "OTS 租車", "確認 ETC、保險、車況拍照。", "OTS Rent a Car Naha Airport", "60 分", "取車"],
        ["16:40", "瀨長島 Umikaji Terrace", "海景咖啡、夕陽、第一天輕鬆拍照。", "Umikaji Terrace Okinawa", "90 分", "海景"],
        ["19:00", "國際通", "晚餐、藥妝、便利商店補貨。", "Kokusai Dori Okinawa", "120 分", "晚餐"]
      ]
    },
    {
      tab: "D2",
      title: "南部文化線",
      subtitle: "首里城、沖繩世界、南城海景咖啡",
      image: "drive",
      bg: "okinawa-drive.png",
      note: "南部景點集中處理，下午再往恩納移動。",
      stops: [
        ["09:00", "首里城公園", "早上先走，避開中午高溫。", "Shurijo Castle Park", "90 分", "文化"],
        ["11:20", "沖繩世界", "玉泉洞、王國村、表演，適合半日。", "Okinawa World", "150 分", "室內"],
        ["14:40", "南城海景咖啡", "補一段休息時間，不要一路趕。", "Hama Cafe Okinawa", "70 分", "咖啡"],
        ["17:30", "恩納村飯店", "入住海景飯店，晚餐就近。", "Onna Village Okinawa hotel", "入住", "住宿"]
      ]
    },
    {
      tab: "D3",
      title: "北部海岸",
      subtitle: "萬座毛、古宇利大橋、美麗海水族館",
      image: "aquarium",
      bg: "okinawa-aquarium.png",
      note: "北部距離較長，早出發會比較舒服。",
      stops: [
        ["09:00", "萬座毛", "象鼻岩海岸斷崖，早上光線舒服。", "Cape Manzamo", "45 分", "拍照"],
        ["11:00", "古宇利大橋", "自駕海景代表路線。", "Kouri Bridge Okinawa", "90 分", "海景"],
        ["13:40", "美麗海水族館", "鯨鯊主水槽，建議 2-3 小時。", "Okinawa Churaumi Aquarium", "180 分", "必去"],
        ["17:20", "備瀨福木林道", "水族館附近散步點，傍晚舒服。", "Bise Fukugi Tree Road", "60 分", "散步"]
      ]
    },
    {
      tab: "D4",
      title: "北谷購物夜",
      subtitle: "Rycom、美國村、夕陽海岸、DMM 水族館",
      image: "village",
      bg: "okinawa-american-village.png",
      note: "下午到晚上留給美國村，節奏比較好。",
      stops: [
        ["10:30", "Aeon Mall Okinawa Rycom", "吃飯、購物、雨天備案。", "AEON MALL Okinawa Rycom", "150 分", "購物"],
        ["14:20", "北谷美國村", "彩色街景、咖啡、選物店。", "American Village Okinawa", "180 分", "逛街"],
        ["17:40", "Sunset Beach", "夕陽時間拍照。", "Sunset Beach Chatan", "60 分", "夕陽"],
        ["19:30", "DMM Kariyushi Aquarium", "晚上可排的水族館或改晚餐。", "DMM Kariyushi Aquarium", "90 分", "備案"]
      ]
    },
    {
      tab: "D5",
      title: "返程採買",
      subtitle: "波上宮、Outlet、還車、機場",
      image: "beach",
      bg: "okinawa-beach.png",
      note: "最後一天不要跑太遠，重點是補買與還車。",
      stops: [
        ["09:00", "波上宮", "那霸市區經典小景點。", "Naminoue Shrine", "45 分", "市區"],
        ["10:20", "ASHIBINAA Outlet", "補買衣物、鞋、伴手禮。", "Okinawa Outlet Mall Ashibinaa", "150 分", "採買"],
        ["13:20", "加油 / 還車", "確認油量、車況、個人物品。", "OTS Rent a Car Naha Airport", "60 分", "還車"],
        ["14:30", "那霸機場", "報到、托運、買最後伴手禮。", "Naha Airport International Terminal", "120 分", "返程"]
      ]
    }
  ];

  var checklist = ["護照", "駕照譯本", "電子機票", "住宿確認", "租車預約", "行動電源", "eSIM / 網卡", "防曬用品", "常備藥", "日幣 / 信用卡"];
  var state = { view: "home", day: 0 };
  var views = [
    ["home", "首頁"],
    ["itinerary", "行程"],
    ["flight", "航班"],
    ["map", "地圖"],
    ["tools", "工具"],
    ["journal", "旅遊誌"]
  ];

  var screen;
  var tabbar;
  var viewTitle;
  var prevView;
  var nextView;
  var installBtn;
  var startX = 0;
  var deferredPrompt = null;

  function maps(query) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function directions(stops) {
    var names = stops.map(function (stop) { return stop[3]; });
    var origin = names[0];
    var destination = names[names.length - 1];
    var waypoints = names.slice(1, -1).join("|");
    return "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(origin) + "&destination=" + encodeURIComponent(destination) + "&waypoints=" + encodeURIComponent(waypoints) + "&travelmode=driving";
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char];
    });
  }

  function currentDay() {
    return days[state.day];
  }

  function getViewIndex() {
    for (var i = 0; i < views.length; i += 1) {
      if (views[i][0] === state.view) return i;
    }
    return 0;
  }

  function setBackground(image) {
    var app = document.getElementById("app");
    if (app) {
      app.style.backgroundImage = "linear-gradient(120deg, rgba(255,247,225,.58), rgba(203,248,255,.28)), url('" + image + "')";
    }
  }

  function renderHome() {
    var day = currentDay();
    setBackground(day.bg);
    return '<div class="view">' +
      '<section class="hero"><p class="kicker">OKINAWA ' + VERSION + '</p><h1>Trip<br>Control</h1><p class="lead">打開就知道今天去哪、下一站怎麼導航、還有什麼東西沒確認。桌機和手機同一套操作。</p><div class="action-row"><a class="action primary" target="_blank" href="' + directions(day.stops) + '">今日路線導航</a><button class="action" data-view="itinerary">看今日行程</button></div></section>' +
      '<section class="grid dash-grid">' +
      '<button class="card primary" data-view="itinerary"><b>TODAY</b><strong>' + esc(day.title) + '</strong><p>' + esc(day.subtitle) + '</p></button>' +
      '<button class="card" data-view="map"><b>MAP HUB</b><strong>快捷導航</strong><p>機場、飯店、景點、購物點一鍵開 Google Maps。</p></button>' +
      '<button class="card" data-view="tools"><b>CHECKLIST</b><strong>出發確認</strong><p>可以勾選，會存在目前這台裝置。</p></button>' +
      '<button class="card" data-view="journal"><b>JOURNAL</b><strong>旅行備忘</strong><p>臨時想買、想吃、想改的內容先記這裡。</p></button>' +
      '<div class="media-card ' + day.image + '"></div>' +
      '</section></div>';
  }

  function renderItinerary() {
    var day = currentDay();
    setBackground(day.bg);
    var dayButtons = days.map(function (item, index) {
      return '<button class="day-pill ' + (index === state.day ? "active" : "") + '" data-day="' + index + '">' + item.tab + '<br>' + item.title + '</button>';
    }).join("");
    var stops = day.stops.map(function (stop) {
      return '<article class="stop"><b>' + esc(stop[0]) + '</b><strong>' + esc(stop[1]) + '</strong><p>' + esc(stop[2]) + '</p><div class="meta"><span>' + esc(stop[4]) + '</span><span>' + esc(stop[5]) + '</span></div><a class="action" target="_blank" rel="noreferrer" href="' + maps(stop[3]) + '">導航</a></article>';
    }).join("");
    return '<div class="view">' +
      '<section class="hero"><p class="kicker">DAILY ROUTE</p><h2>' + esc(day.title) + '</h2><p class="lead">' + esc(day.note) + '</p><div class="action-row"><a class="action primary" target="_blank" href="' + directions(day.stops) + '">今日路線導航</a><button class="action" data-next-day>下一天</button></div><div class="media-card ' + day.image + '"></div></section>' +
      '<section class="panel"><div class="day-strip">' + dayButtons + '</div><div class="timeline">' + stops + '</div></section></div>';
  }

  function renderFlight() {
    setBackground("okinawa-drive.png");
    return '<div class="view">' +
      '<section class="hero"><p class="kicker">FLIGHT & STAY</p><h2>航班<br>住宿租車</h2><p class="lead">把旅行第一天最容易手忙腳亂的資訊集中在這裡。</p></section>' +
      '<section class="grid dash-grid">' +
      '<article class="ticket"><b>OUTBOUND</b><strong>TPE</strong><div class="plane-line">10:25<i></i>13:05</div><p>MM923 / 桃園 T1 到那霸國際線</p><div class="action-row"><a class="action primary" target="_blank" href="' + maps("Naha Airport International Terminal") + '">那霸機場</a></div></article>' +
      '<article class="ticket"><b>RETURN</b><strong>OKA</strong><div class="plane-line">16:20<i></i>17:05</div><p>MM922 / 先還車，再進機場報到</p><div class="action-row"><a class="action primary" target="_blank" href="' + maps("OTS Rent a Car Naha Airport") + '">還車點</a></div></article>' +
      '<article class="card"><b>NAHA</b><strong>Naha Makishi Stay</strong><p>10.21 / 國際通附近</p><div class="action-row"><a class="action" target="_blank" href="' + maps("Kokusai Dori Okinawa") + '">導航</a></div></article>' +
      '<article class="card"><b>ONNA / CHATAN</b><strong>Ocean + Sunset</strong><p>10.22 恩納，10.23-24 北谷</p><div class="action-row"><a class="action" target="_blank" href="' + maps("American Village Okinawa") + '">北谷</a></div></article>' +
      '</section></div>';
  }

  function renderMap() {
    setBackground("okinawa-american-village.png");
    var places = [
      ["那霸機場", "Naha Airport International Terminal"],
      ["OTS 租車", "OTS Rent a Car Naha Airport"],
      ["國際通", "Kokusai Dori Okinawa"],
      ["首里城", "Shurijo Castle Park"],
      ["古宇利大橋", "Kouri Bridge Okinawa"],
      ["美麗海水族館", "Okinawa Churaumi Aquarium"],
      ["美國村", "American Village Okinawa"],
      ["ASHIBINAA Outlet", "Okinawa Outlet Mall Ashibinaa"]
    ];
    var cards = places.map(function (place, index) {
      return '<a class="card" target="_blank" href="' + maps(place[1]) + '"><b>MAP ' + String(index + 1).padStart(2, "0") + '</b><strong>' + esc(place[0]) + '</strong><p>點一下直接開 Google Maps。</p></a>';
    }).join("");
    return '<div class="view"><section class="hero"><p class="kicker">MAP SHORTCUTS</p><h2>導航<br>快捷入口</h2><p class="lead">旅行時最常用的功能獨立一頁，不用翻半天找地址。</p></section><section class="grid map-grid">' + cards + '</section></div>';
  }

  function getChecklist() {
    try { return JSON.parse(localStorage.getItem(checklistKey)) || {}; } catch (e) { return {}; }
  }

  function renderTools() {
    setBackground("okinawa-aquarium.png");
    var saved = getChecklist();
    var tools = checklist.map(function (item, index) {
      return '<button class="tool ' + (saved[index] ? "done" : "") + '" data-check="' + index + '" type="button"><b>' + String(index + 1).padStart(2, "0") + '</b><h3>' + esc(item) + '</h3><p>' + (saved[index] ? "已確認" : "點一下勾選") + '</p></button>';
    }).join("");
    return '<div class="view"><section class="hero"><p class="kicker">TRAVEL TOOLS</p><h2>工具箱</h2><p class="lead">Checklist、緊急電話、常用確認事項集中在這裡。</p><div class="action-row"><a class="action primary" href="tel:119">日本 119</a><a class="action" href="tel:110">日本 110</a></div></section><section class="grid tool-grid">' + tools + '</section></div>';
  }

  function renderJournal() {
    setBackground("okinawa-beach.png");
    var note = localStorage.getItem(noteKey) || "";
    return '<div class="view"><section class="hero"><p class="kicker">TRAVEL JOURNAL</p><h2>旅遊誌<br>備忘</h2><p class="lead">臨時想吃、想買、想改的行程先記這裡。內容會存在這台裝置。</p><div class="media-card beach"></div></section><section class="panel"><textarea class="note-box" id="noteBox" placeholder="例如：Day 4 改去 Parco City、伴手禮買紅芋塔、晚餐想吃燒肉...">' + esc(note) + '</textarea><div class="action-row"><button class="action primary" id="saveNote">儲存備忘</button><button class="action" id="clearNote">清空</button></div></section></div>';
  }

  function render() {
    if (!screen) return;
    if (state.view === "home") screen.innerHTML = renderHome();
    if (state.view === "itinerary") screen.innerHTML = renderItinerary();
    if (state.view === "flight") screen.innerHTML = renderFlight();
    if (state.view === "map") screen.innerHTML = renderMap();
    if (state.view === "tools") screen.innerHTML = renderTools();
    if (state.view === "journal") screen.innerHTML = renderJournal();

    viewTitle.textContent = views[getViewIndex()][1];
    prevView.disabled = getViewIndex() === 0;
    nextView.disabled = getViewIndex() === views.length - 1;
    renderTabs();
    bindInside();
  }

  function renderTabs() {
    tabbar.innerHTML = views.map(function (view) {
      return '<button class="' + (state.view === view[0] ? "active" : "") + '" data-view="' + view[0] + '" type="button">' + view[1] + '</button>';
    }).join("");
    var buttons = tabbar.querySelectorAll("[data-view]");
    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener("click", function () {
        state.view = button.getAttribute("data-view");
        render();
      });
    });
  }

  function bindInside() {
    var viewButtons = document.querySelectorAll("[data-view]");
    Array.prototype.forEach.call(viewButtons, function (button) {
      if (button.parentNode === tabbar) return;
      button.addEventListener("click", function () {
        state.view = button.getAttribute("data-view");
        render();
      });
    });

    var dayButtons = document.querySelectorAll("[data-day]");
    Array.prototype.forEach.call(dayButtons, function (button) {
      button.addEventListener("click", function () {
        state.day = Number(button.getAttribute("data-day"));
        render();
      });
    });

    var nextDay = document.querySelector("[data-next-day]");
    if (nextDay) {
      nextDay.addEventListener("click", function () {
        state.day = (state.day + 1) % days.length;
        render();
      });
    }

    var checkButtons = document.querySelectorAll("[data-check]");
    Array.prototype.forEach.call(checkButtons, function (button) {
      button.addEventListener("click", function () {
        var saved = getChecklist();
        var key = button.getAttribute("data-check");
        saved[key] = !saved[key];
        localStorage.setItem(checklistKey, JSON.stringify(saved));
        render();
      });
    });

    var saveNote = document.getElementById("saveNote");
    var clearNote = document.getElementById("clearNote");
    var noteBox = document.getElementById("noteBox");
    if (saveNote && noteBox) {
      saveNote.addEventListener("click", function () {
        localStorage.setItem(noteKey, noteBox.value);
        saveNote.textContent = "已儲存";
        window.setTimeout(function () { saveNote.textContent = "儲存備忘"; }, 900);
      });
    }
    if (clearNote && noteBox) {
      clearNote.addEventListener("click", function () {
        noteBox.value = "";
        localStorage.removeItem(noteKey);
      });
    }
  }

  function moveView(direction) {
    var next = getViewIndex() + direction;
    if (next < 0 || next >= views.length) return;
    state.view = views[next][0];
    render();
  }

  function init() {
    screen = document.getElementById("screen");
    tabbar = document.getElementById("tabbar");
    viewTitle = document.getElementById("viewTitle");
    prevView = document.getElementById("prevView");
    nextView = document.getElementById("nextView");
    installBtn = document.getElementById("installBtn");

    if (!screen || !tabbar || !viewTitle || !prevView || !nextView) return;

    prevView.addEventListener("click", function () { moveView(-1); });
    nextView.addEventListener("click", function () { moveView(1); });

    screen.addEventListener("touchstart", function (event) {
      startX = event.touches[0].clientX;
    }, { passive: true });

    screen.addEventListener("touchend", function (event) {
      var diff = event.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 54) moveView(diff < 0 ? 1 : -1);
    }, { passive: true });

    window.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") moveView(-1);
      if (event.key === "ArrowRight") moveView(1);
    });

    window.addEventListener("beforeinstallprompt", function (event) {
      event.preventDefault();
      deferredPrompt = event;
      if (installBtn) installBtn.hidden = false;
    });

    if (installBtn) {
      installBtn.addEventListener("click", function () {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () {
          deferredPrompt = null;
          installBtn.hidden = true;
        });
      });
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw-v16.js");
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
