/* Ye — 导演 / AIGC */
(() => {
  "use strict";

  window.__yeSiteBooted = true;

  const doc = document.documentElement;
  doc.classList.remove("no-js");
  doc.classList.add("js");

  /* header: one quiet rule after scrolling ------------------------------- */

  const header = document.querySelector("[data-header]");
  if (header) {
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 6);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* mobile menu ---------------------------------------------------------- */

  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const body = document.body;

  const setMenu = (open) => {
    if (!toggle || !menu) return;
    body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    menu.setAttribute("aria-hidden", String(!open));

    if (open) {
      window.setTimeout(() => {
        if (!body.classList.contains("menu-open")) return;
        const first = menu.querySelector("a");
        if (first) first.focus({ preventScroll: true });
      }, 30);
    } else if (menu.contains(document.activeElement)) {
      toggle.focus({ preventScroll: true });
    }
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      setMenu(!body.classList.contains("menu-open"));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && body.classList.contains("menu-open")) {
        setMenu(false);
      }

      if (event.key !== "Tab" || !body.classList.contains("menu-open")) return;
      const focusable = [toggle, ...menu.querySelectorAll("a")].filter(Boolean);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && body.classList.contains("menu-open")) {
        setMenu(false);
      }
    });
  }

  /* stills: image reveal + captions on centred works -------------------- */

  const homeWorks = document.querySelector(".page-home .works");
  const homeWorkStates = [];
  let homeEntranceDone = false;
  let captionUpdateQueued = false;

  if (homeWorks) {
    homeWorks.querySelectorAll(".work").forEach((work) => {
      homeWorkStates.push({
        work,
        image: work.querySelector("img"),
        imageReady: false,
        timer: 0,
        shown: false,
      });
    });
  }

  const updateCaptionTriggers = () => {
    if (!homeWorkStates.length || captionUpdateQueued) return;
    captionUpdateQueued = true;

    window.requestAnimationFrame(() => {
      captionUpdateQueued = false;
      const viewportCenter = window.innerHeight / 2;
      const threshold = Math.max(72, window.innerHeight * 0.15);

      homeWorkStates.forEach((state) => {
        if (state.shown) return;

        const rect = state.work.getBoundingClientRect();
        const workCenter = rect.top + rect.height / 2;
        const isCentred = Math.abs(workCenter - viewportCenter) <= threshold;
        const shouldStart = homeEntranceDone && state.imageReady && isCentred;

        if (shouldStart && !state.timer) {
          state.timer = window.setTimeout(() => {
            state.timer = 0;
            state.shown = true;
            state.work.classList.add("is-caption-visible");
          }, 500);
        } else if (!shouldStart && state.timer) {
          window.clearTimeout(state.timer);
          state.timer = 0;
        }
      });
    });
  };

  const markWorkImageReady = (image) => {
    const state = homeWorkStates.find((item) => item.image === image);
    if (!state || state.imageReady) return;

    window.setTimeout(() => {
      state.imageReady = true;
      updateCaptionTriggers();
    }, 320);
  };

  const revealImage = (image) => {
    image.classList.add("is-visible");
    markWorkImageReady(image);
  };

  document.querySelectorAll("[data-reveal-img]").forEach((image) => {
    if (image.complete && image.naturalWidth > 0) {
      requestAnimationFrame(() => revealImage(image));
      return;
    }
    image.addEventListener("load", () => revealImage(image), { once: true });
    image.addEventListener(
      "error",
      () => {
        image.removeAttribute("data-reveal-img");
        markWorkImageReady(image);
      },
      { once: true }
    );
  });

  if (homeWorks) {
    const onEntranceDone = () => {
      homeEntranceDone = true;
      updateCaptionTriggers();
    };

    if (typeof homeWorks.getAnimations === "function") {
      const entrance = homeWorks
        .getAnimations()
        .find((animation) => animation.animationName === "home-emerge");
      if (entrance) {
        entrance.finished.then(onEntranceDone, onEntranceDone);
      } else {
        onEntranceDone();
      }
    } else {
      onEntranceDone();
    }

    window.addEventListener("scroll", updateCaptionTriggers, { passive: true });
    window.addEventListener("resize", updateCaptionTriggers);
    updateCaptionTriggers();
  }

  /* Shanghai clock ------------------------------------------------------- */

  const clocks = document.querySelectorAll("[data-clock]");
  if (clocks.length) {
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const tick = () => {
      const value = formatter.format(new Date());
      clocks.forEach((clock) => {
        clock.textContent = value;
      });
    };

    tick();
    window.setInterval(tick, 30000);
  }

  /* a minimal player ----------------------------------------------------- */

  const player = document.querySelector("[data-player]");
  if (player) {
    const video = player.querySelector("video");
    const playButton = player.querySelector("[data-playpause]");
    const centerPlay = player.querySelector("[data-center-play]");
    const seek = player.querySelector("[data-seek]");
    const time = player.querySelector("[data-time]");
    const muteButton = player.querySelector("[data-mute]");
    const fullButton = player.querySelector("[data-fullscreen]");

    const format = (seconds) => {
      if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
      const whole = Math.floor(seconds);
      const minutes = Math.floor(whole / 60);
      const rest = whole % 60;
      return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
    };

    const paintTime = () => {
      const duration = video.duration;
      if (seek && Number.isFinite(duration) && duration > 0) {
        seek.value = String(Math.round((video.currentTime / duration) * 1000));
        const progress = `${(video.currentTime / duration) * 100}%`;
        seek.style.background = `linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.9) ${progress}, rgba(255,255,255,0.28) ${progress}, rgba(255,255,255,0.28) 100%)`;
      }
      if (time) {
        time.textContent = `${format(video.currentTime)} / ${format(duration)}`;
      }
    };

    const paintPlayState = () => {
      const playing = !video.paused && !video.ended;
      player.classList.toggle("is-playing", playing);
      if (playButton) {
        playButton.setAttribute("aria-label", playing ? "暂停" : "播放");
      }
    };

    const paintMuteState = () => {
      player.classList.toggle("is-muted", video.muted);
      if (muteButton) {
        muteButton.setAttribute("aria-label", video.muted ? "开启声音" : "静音");
        muteButton.setAttribute("aria-pressed", String(video.muted));
      }
    };

    const attemptPlay = () => {
      const promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => paintPlayState());
      }
    };

    video.addEventListener("play", paintPlayState);
    video.addEventListener("pause", paintPlayState);
    video.addEventListener("ended", paintPlayState);
    video.addEventListener("timeupdate", paintTime);
    video.addEventListener("loadedmetadata", paintTime);
    video.addEventListener("durationchange", paintTime);
    video.addEventListener("volumechange", paintMuteState);

    if (playButton) {
      playButton.addEventListener("click", () => {
        if (video.paused) attemptPlay();
        else video.pause();
      });
    }

    if (centerPlay) {
      centerPlay.addEventListener("click", attemptPlay);
    }

    video.addEventListener("click", () => {
      if (video.paused) attemptPlay();
      else video.pause();
    });

    if (seek) {
      seek.addEventListener("input", () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;
        video.currentTime = (Number(seek.value) / 1000) * video.duration;
        paintTime();
      });
    }

    if (muteButton) {
      muteButton.addEventListener("click", () => {
        video.muted = !video.muted;
        paintMuteState();
      });
    }

    if (fullButton) {
      fullButton.addEventListener("click", () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (player.requestFullscreen) {
          player.requestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      });
    }

    paintMuteState();
    paintPlayState();
    paintTime();
  }
})();
