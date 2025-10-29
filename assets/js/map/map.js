
const map = {
  initialized: false,
  // ========================================
  // 초기화
  // ========================================
  init() {
    if (this.initialized) return;
    this.bindEvents();
    this.zoom.init();
    this.initialized = true;
    console.log("Map initialized");
  },
  // ========================================
  // 이벤트 바인딩
  // ========================================
  bindEvents() {
    var _a, _b, _c;
    document.querySelectorAll("[data-samplescript]").forEach((target) => {
      target.addEventListener("click", () => {
        const fn = target.getAttribute("data-samplescript");
        if (this.sample[fn]) this.sample[fn]();
      });
    });
    document.querySelectorAll("[data-pressed]").forEach((target) => {
      target.addEventListener("click", () => {
        if (target.closest("[data-groupWrap].slideTab")) {
          target.setAttribute("data-pressed", true);
        } else {
          const current = target.getAttribute("data-pressed") === "true";
          target.setAttribute("data-pressed", !current);
        }
        const group = target.getAttribute("data-group");
        if (group) {
          const groupWrap = target.closest("[data-groupWrap]");
          if (groupWrap) {
            groupWrap.querySelectorAll(`[data-group="${group}"]`).forEach((el) => {
              if (el !== target) el.setAttribute("data-pressed", "false");
            });
          }
        }
      });
    });
    document.querySelectorAll("input[type=radio][data-target]").forEach((tab) => {
      tab.addEventListener("click", () => {
        var _a2;
        const wrap = tab.closest("[data-groupwrap]");
        if (wrap) {
          wrap.querySelectorAll(`input[name='${tab.name}']`).forEach((sib) => {
            var _a3;
            const targetTitle = sib.getAttribute("data-target");
            (_a3 = document.querySelector(`[data-title='${targetTitle}']`)) == null ? void 0 : _a3.setAttribute("data-show", "false");
          });
        }
        const activeTitle = tab.getAttribute("data-target");
        (_a2 = document.querySelector(`[data-title='${activeTitle}']`)) == null ? void 0 : _a2.setAttribute("data-show", "true");
      });
    });
    (_a = document.querySelector("section.list button.folding.show")) == null ? void 0 : _a.addEventListener("click", () => {
      this.result.show();
    });
    (_b = document.querySelector("section.list button.folding.hide")) == null ? void 0 : _b.addEventListener("click", () => {
      var _a2;
      this.result.hide();
      (_a2 = document.querySelector("nav.filter button[data-pressed='true']")) == null ? void 0 : _a2.click();
    });
    document.querySelectorAll("section.list nav.filter button").forEach((btn) => {
      btn.addEventListener("click", () => {
        var _a2;
        const pressed = btn.getAttribute("data-pressed") === "true";
        const wrap = document.querySelector(".filterWrap");
        if (pressed) {
          wrap == null ? void 0 : wrap.setAttribute("data-folded", "false");
          document.querySelectorAll(".filterWrap .set").forEach((set) => set.setAttribute("data-show", "false"));
          const target = btn.getAttribute("data-target");
          (_a2 = document.querySelector(`.filterWrap .set[data-title='${target}']`)) == null ? void 0 : _a2.setAttribute("data-show", "true");
          this.result.show();
        } else {
          wrap == null ? void 0 : wrap.setAttribute("data-folded", "true");
        }
      });
    });
    document.querySelectorAll("[data-selected]").forEach((target) => {
      target.addEventListener("click", () => {
        document.querySelectorAll("[data-selectWrap] [data-selected]").forEach((sib) => {
          if (sib !== target) sib.setAttribute("data-selected", "false");
        });
        const selected = target.getAttribute("data-selected") === "true";
        target.setAttribute("data-selected", !selected);
        !selected ? this.detail.show() : this.detail.hide();
      });
    });
    (_c = document.querySelector(".detail header button.close")) == null ? void 0 : _c.addEventListener("click", () => {
      var _a2;
      (_a2 = document.querySelector("section.list .result dl[data-selected='true']")) == null ? void 0 : _a2.click();
    });
    document.querySelectorAll("aside.sidebar button[aria-haspopup='true']").forEach((btn) => {
      btn.addEventListener("click", () => {
        var _a2;
        document.querySelectorAll("aside.sidebar .popup").forEach(
          (p) => p.setAttribute("data-show", false)
        );
        const target = btn.getAttribute("data-target");
        (_a2 = document.querySelector(`aside.sidebar .popup[data-title='${target}']`)) == null ? void 0 : _a2.setAttribute("data-show", btn.getAttribute("data-pressed"));
      });
    });
    document.querySelectorAll("aside.sidebar .popup button.close").forEach((btn) => {
      btn.addEventListener("click", () => {
        var _a2, _b2;
        const title = (_a2 = btn.closest(".popup")) == null ? void 0 : _a2.getAttribute("data-title");
        (_b2 = document.querySelector(`aside.sidebar button.menu[data-target='${title}']`)) == null ? void 0 : _b2.click();
      });
    });
    document.querySelectorAll(".modal header button.close").forEach((btn) => {
      btn.addEventListener("click", () => {
        var _a2;
        (_a2 = btn.closest(".modal")) == null ? void 0 : _a2.setAttribute("data-show", "false");
      });
    });
  },
  // ========================================
  // 세부 기능
  // ========================================
  result: {
    show() {
      var _a;
      (_a = document.querySelector("section.list .result")) == null ? void 0 : _a.setAttribute("data-folded", "false");
    },
    hide() {
      var _a;
      (_a = document.querySelector("section.list .result")) == null ? void 0 : _a.setAttribute("data-folded", "true");
    }
  },
  detail: {
    show() {
      var _a;
      (_a = document.querySelector("section.detail")) == null ? void 0 : _a.setAttribute("data-show", "true");
    },
    hide() {
      var _a;
      (_a = document.querySelector("section.detail")) == null ? void 0 : _a.setAttribute("data-show", "false");
    }
  },
  filter: {
    reset() {
      var _a, _b;
      document.querySelectorAll("nav.filter button").forEach((b) => b.disabled = false);
      const active = document.querySelector("nav.filter button[data-pressed='true']");
      if (active) {
        active.classList.remove("applyed");
        active.setAttribute("data-pressed", "false");
      }
      (_a = document.querySelector(".filterWrap")) == null ? void 0 : _a.setAttribute("data-folded", "true");
      (_b = document.querySelector(".list")) == null ? void 0 : _b.setAttribute("data-state", null);
    }
  },
  sample: {
    filterApply() {
      var _a;
      (_a = document.querySelector(".list")) == null ? void 0 : _a.setAttribute("data-state", "filterApplyed");
      document.querySelectorAll("nav.filter button").forEach((b) => b.disabled = true);
      const active = document.querySelector("nav.filter button[data-pressed='true']");
      if (active) {
        active.classList.add("applyed");
        active.querySelector("span").textContent = "선택사항";
      }
    },
    filterReset() {
      map.filter.reset();
    },
    modalpopup() {
      var _a;
      (_a = document.querySelector(".modal")) == null ? void 0 : _a.setAttribute("data-show", "true");
    }
  },
  // ========================================
  // 줌 컨트롤
  // ========================================
  zoom: {
    zoomLevel: 100,
    minZoom: 50,
    maxZoom: 200,
    step: 10,
    buttons: {},
    display: null,
    init() {
      this.buttons.out = document.querySelector('.zoom-btn[aria-label="줌 아웃"]');
      this.buttons.in = document.querySelector('.zoom-btn[aria-label="줌 인"]');
      this.display = document.querySelector(".zoom-percentage");
      this.bind();
      this.update();
    },
    bind() {
      var _a, _b;
      (_a = this.buttons.out) == null ? void 0 : _a.addEventListener("click", () => this.out());
      (_b = this.buttons.in) == null ? void 0 : _b.addEventListener("click", () => this.in());
      document.addEventListener("keydown", (e) => this.key(e));
    },
    key(e) {
      if (!e.ctrlKey) return;
      if (["+", "="].includes(e.key)) {
        e.preventDefault();
        this.in();
      } else if (e.key === "-") {
        e.preventDefault();
        this.out();
      } else if (e.key === "0") {
        e.preventDefault();
        this.reset();
      }
    },
    in() {
      if (this.zoomLevel < this.maxZoom) {
        this.zoomLevel = Math.min(this.zoomLevel + this.step, this.maxZoom);
        this.apply();
      }
    },
    out() {
      if (this.zoomLevel > this.minZoom) {
        this.zoomLevel = Math.max(this.zoomLevel - this.step, this.minZoom);
        this.apply();
      }
    },
    reset() {
      this.zoomLevel = 100;
      this.apply();
    },
    apply() {
      document.body.style.zoom = `${this.zoomLevel}%`;
      this.update();
    },
    update() {
      if (this.display) this.display.textContent = `${this.zoomLevel}%`;
    }
  }
};
document.addEventListener("DOMContentLoaded", () => {
  map.init();
});
window.map = map;
