(function () {
  var playButton = document.querySelector("[data-speak='play']");
  var pauseButton = document.querySelector("[data-speak='pause']");
  var resumeButton = document.querySelector("[data-speak='resume']");
  var stopButton = document.querySelector("[data-speak='stop']");
  var status = document.querySelector("[data-speak-status]");
  var textSource = document.querySelector("[data-speak-source]");
  var utterance = null;

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function getReadableText() {
    if (!textSource) return "";
    return textSource.innerText
      .replace(/\s+/g, " ")
      .replace(/信息来源：/g, "。信息来源：")
      .replace(/今日趋势点评：/g, "。今日趋势点评：")
      .trim();
  }

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
})();
