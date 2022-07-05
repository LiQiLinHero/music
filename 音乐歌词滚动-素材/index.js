(async function () {
  /**
   * 从网络获取歌词数据
   * @returns Promise
   */
  async function getLrc() {
    return await fetch("https://study.duyiedu.com/api/lyrics")
      .then((resp) => resp.json())
      .then((resp) => resp.data);
  }

  //初始化
  const doms = {
    ul: document.querySelector(".lrc"),
    audio: document.querySelector("audio"),
  };
  const size = {
    liHeight: 30,
    containerHeight: 420,
  };
  let lrcData;
  async function init() {
    const lrc = await getLrc();
    //将lrc ->[{time: , words:}]
    lrcData = lrc
      .split("\n")
      .filter((s) => s)
      .map((s) => {
        const parts = s.split("]");
        const time = parts[0].replace("[", "").split(":");
        return { time: +time[0] * 60 + +time[1], words: parts[1] };
      });
    //将li加入到ul中
    const ulText = lrcData.map((lrc) => `<li>${lrc.words}</li>`).join("");
    doms.ul.innerHTML = ulText;
  }
  await init();

  //交互事件
  //audio元素的播放进度

  doms.audio.addEventListener("timeupdate", function () {
    setStatus(this.currentTime);
  });

  /**
   * 根据播放时间，设置歌词的状态
   * @param {*} time
   */
  function setStatus(time) {
    time -= 2.5;
    const beforeActive = document.querySelector(".active");
    beforeActive && beforeActive.classList.remove("active");
    const index = lrcData.findIndex((lrc) => lrc.time > time);
    if (index < 0) {
      return;
    }
    doms.ul.children[index].classList.add("active");

    let top =
      size.liHeight * index + size.liHeight / 2 - size.containerHeight / 2;
    top = -top;
    if (top > 0) {
      top = 0;
    }
    doms.ul.style.transform = `translateY(${top}px)`;
  }
})();
