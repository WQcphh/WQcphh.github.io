(function () {
  var storageKey = "dailyBriefState.v1";
  var playButton = document.querySelector("[data-speak='play']");
  var pauseButton = document.querySelector("[data-speak='pause']");
  var resumeButton = document.querySelector("[data-speak='resume']");
  var stopButton = document.querySelector("[data-speak='stop']");
  var status = document.querySelector("[data-speak-status]");
  var textSource = document.querySelector("[data-speak-source]");
  var utterance = null;

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || { favorites: {}, completed: {} };
    } catch (error) {
      return { favorites: {}, completed: {} };
    }
  }

  function writeState(state) {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function findCard(button) {
    return button.closest("[data-item-id]");
  }

  function renderFavorites() {
    var list = document.querySelector("[data-favorites-list]");
    if (!list) return;
    var state = readState();
    var favorites = Object.keys(state.favorites).map(function (key) {
      return state.favorites[key];
    });

    if (!favorites.length) {
      list.innerHTML = '<li class="empty-state">还没有收藏内容。</li>';
      return;
    }

    list.innerHTML = favorites
      .sort(function (a, b) {
        return b.savedAt.localeCompare(a.savedAt);
      })
      .map(function (item) {
        return '<li class="favorite-entry"><span>' + escapeHtml(item.title) + '</span><button class="state-button" data-remove-favorite="' + escapeHtml(item.id) + '">移除</button></li>';
      })
      .join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function applyState() {
    var state = readState();
    document.querySelectorAll("[data-item-id]").forEach(function (card) {
      var id = card.getAttribute("data-item-id");
      card.classList.toggle("is-completed", Boolean(state.completed[id]));
      card.querySelectorAll("[data-action='favorite']").forEach(function (button) {
        button.classList.toggle("is-active", Boolean(state.favorites[id]));
        button.textContent = state.favorites[id] ? "已收藏" : "收藏";
      });
      card.querySelectorAll("[data-action='complete']").forEach(function (button) {
        button.classList.toggle("is-active", Boolean(state.completed[id]));
        button.textContent = state.completed[id] ? "已完成" : "完成";
      });
    });
    renderFavorites();
  }

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function applyAudioRetention() {
    var audioPanel = document.querySelector("[data-audio-date]");
    var mp3Player = document.querySelector("[data-mp3-player]");
    if (!audioPanel || !mp3Player) return;

    var audioDate = audioPanel.getAttribute("data-audio-date");
    var dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(audioDate || "");
    if (!dateMatch) return;

    var publishedAt = new Date(Number(dateMatch[1]), Number(dateMatch[2]) - 1, Number(dateMatch[3]));
    var today = new Date();
    var todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var ageDays = Math.floor((todayStart.getTime() - publishedAt.getTime()) / 86400000);

    if (ageDays > 7) {
      mp3Player.hidden = true;
      setStatus("这期音频已超过 7 天，MP3 不再保留；可以使用浏览器朗读。");
    }
  }

  function getReadableText() {
    if (!textSource) return "";
    return textSource.innerText
      .replace(/\s+/g, " ")
      .replace(/信息来源：/g, "。信息来源：")
      .replace(/今日趋势点评：/g, "。今日趋势点评：")
      .trim();
  }

  document.addEventListener("click", function (event) {
    var stateButton = event.target.closest(".state-button");
    if (!stateButton) return;

    var copyTarget = stateButton.getAttribute("data-copy-target");
    if (copyTarget) {
      var copyNode = document.getElementById(copyTarget);
      if (!copyNode) return;
      navigator.clipboard.writeText(copyNode.innerText).then(function () {
        var oldText = stateButton.textContent;
        stateButton.textContent = "已复制";
        setTimeout(function () {
          stateButton.textContent = oldText;
        }, 1400);
      });
      return;
    }

    var removeId = stateButton.getAttribute("data-remove-favorite");
    if (removeId) {
      var removeState = readState();
      delete removeState.favorites[removeId];
      writeState(removeState);
      applyState();
      return;
    }

    var action = stateButton.getAttribute("data-action");
    if (!action) return;
    var card = findCard(stateButton);
    if (!card) return;
    var id = card.getAttribute("data-item-id");
    var title = stateButton.getAttribute("data-title") || card.querySelector("h3")?.innerText || id;
    var state = readState();

    if (action === "favorite") {
      if (state.favorites[id]) {
        delete state.favorites[id];
      } else {
        state.favorites[id] = { id: id, title: title, savedAt: new Date().toISOString() };
      }
    }

    if (action === "complete") {
      if (state.completed[id]) {
        delete state.completed[id];
      } else {
        state.completed[id] = { id: id, title: title, completedAt: new Date().toISOString() };
      }
    }

    writeState(state);
    applyState();
  });

  function supported() {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  function stopSpeaking() {
    if (!supported()) return;
    window.speechSynthesis.cancel();
    utterance = null;
    setStatus("已停止播报。");
  }

  function startSpeaking() {
    if (!supported()) {
      setStatus("当前浏览器不支持网页语音播报，建议用手机 Chrome、Safari 或系统浏览器打开。");
      return;
    }

    stopSpeaking();
    var text = getReadableText();
    if (!text) {
      setStatus("没有找到可朗读内容。");
      return;
    }

    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = function () {
      setStatus("正在播报今日简报。手机浏览器通常需要保持页面打开。");
    };
    utterance.onend = function () {
      utterance = null;
      setStatus("播报完成。");
    };
    utterance.onerror = function () {
      utterance = null;
      setStatus("播报被浏览器中断，可重新点击播放。");
    };

    window.speechSynthesis.speak(utterance);
  }

  if (playButton) {
    playButton.addEventListener("click", startSpeaking);
  }

  if (pauseButton) {
    pauseButton.addEventListener("click", function () {
      if (!supported()) return;
      window.speechSynthesis.pause();
      setStatus("已暂停。");
    });
  }

  if (resumeButton) {
    resumeButton.addEventListener("click", function () {
      if (!supported()) return;
      window.speechSynthesis.resume();
      setStatus("继续播报。");
    });
  }

  if (stopButton) {
    stopButton.addEventListener("click", stopSpeaking);
  }

  window.addEventListener("beforeunload", function () {
    if (supported()) window.speechSynthesis.cancel();
  });

  applyState();
  applyAudioRetention();
})();
