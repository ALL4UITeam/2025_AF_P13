import "@/scss/main.scss";
import "@/scss/pages/portal/_portal.scss";

console.log("Portal main page JS loaded");

// ========================================
// Portal 네임스페이스 정의
// ========================================
const portal = {
  initialized: false,

  // ========================================
  // 코드 복사 기능
  // ========================================
  copy: {
    init() {
      document.querySelectorAll("[data-copy]").forEach((btn) => {
        btn.addEventListener("click", this.handleCopy);
      });
    },

    handleCopy(e) {
      const btn = e.currentTarget;
      const id = btn.getAttribute("data-copy");
      const block = document.getElementById(id);
      if (!block) return;

      navigator.clipboard
        .writeText(block.innerText)
        .then(() => {
          const originalText = btn.textContent;
          btn.textContent = "복사됨";
          setTimeout(() => {
            btn.textContent = originalText;
          }, 1200);
        })
        .catch((err) => {
          console.error("복사 실패:", err);
        });
    },
  },

  // ========================================
  // 모달 기능
  // ========================================
  modal: {
    activeModal: null,

    init() {
      // 이벤트 위임 사용
      document.addEventListener("click", this.handleClick.bind(this));
      document.addEventListener("keydown", this.handleKeydown.bind(this));
    },

    handleClick(e) {
      const openBtn = e.target.closest("[data-open]");
      if (openBtn) {
        const id = openBtn.getAttribute("data-open");
        this.open(id);
        return;
      }

      const closeBtn = e.target.closest("[data-close]");
      if (closeBtn) {
        const id = closeBtn.getAttribute("data-close");
        this.close(id);
      }
    },

    handleKeydown(e) {
      if (e.key === "Escape" && this.activeModal) {
        this.close(this.activeModal.id);
      }
    },

    open(id, callback) {
      const el = document.getElementById(id);
      if (!el) return;

      el.classList.add("is-active");
      el.setAttribute("aria-hidden", "false");
      this.activeModal = el;

      // 첫 번째 포커스 가능한 요소에 포커스
      const focusable = el.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) focusable.focus();

      if (typeof callback === "function") callback(el);
    },

    close(id, callback) {
      const el = document.getElementById(id);
      if (!el) return;

      el.classList.remove("is-active");
      el.setAttribute("aria-hidden", "true");
      this.activeModal = null;

      if (typeof callback === "function") callback(el);
    },
  },

  // ========================================
  // 탭 기능
  // ========================================
  tab: {
    init() {
      const tabs = document.querySelectorAll(".tab");
      tabs.forEach((tab) => {
        tab.addEventListener("click", this.handleTabClick.bind(this));
      });
    },

    handleTabClick(e) {
      const clickedTab = e.currentTarget;
      const tabs = document.querySelectorAll(".tab");
      const panels = document.querySelectorAll(".tab-panel");

      tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
      panels.forEach((p) => (p.dataset.active = "false"));

      clickedTab.setAttribute("aria-selected", "true");
      const panelId = clickedTab.getAttribute("aria-controls");
      const panel = document.getElementById(panelId);
      if (panel) panel.dataset.active = "true";
    },
  },

  // ========================================
  // Popover 기능 (이벤트 위임으로 개선)
  // ========================================
  popover: {
    currentOpen: null,

    init() {
      document.addEventListener("click", this.handleClick.bind(this));
    },

    handleClick(e) {
      const trigger = e.target.closest(".popover-trigger");

      if (trigger) {
        const popover = trigger.closest(".popover");
        const content = popover?.querySelector(".popover-content");
        if (!content) return;

        const isOpen = content.getAttribute("data-show") === "true";

        // 다른 모든 popover 닫기
        this.closeAll();

        // 토글
        if (!isOpen) {
          content.setAttribute("data-show", "true");
          this.currentOpen = content;
        }
      } else {
        // popover 외부 클릭시 닫기
        const clickedPopover = e.target.closest(".popover");
        if (!clickedPopover) {
          this.closeAll();
        }
      }
    },

    closeAll() {
      document.querySelectorAll(".popover-content").forEach((content) => {
        content.setAttribute("data-show", "false");
      });
      this.currentOpen = null;
    },
  },

  // ========================================
  // Dropdown 기능
  // ========================================
  dropdown: {
    btn: null,
    menu: null,

    init() {
      this.btn = document.getElementById("ddBtn");
      this.menu = document.querySelector(".dropdown-menu");
      if (!this.btn || !this.menu) return;

      this.btn.addEventListener("click", this.toggle.bind(this));
      document.addEventListener("click", this.handleOutsideClick.bind(this));
    },

    toggle() {
      const isExpanded = this.btn.getAttribute("aria-expanded") === "true";
      this.btn.setAttribute("aria-expanded", String(!isExpanded));
      this.menu.setAttribute("data-open", String(!isExpanded));
    },

    handleOutsideClick(e) {
      if (!this.btn.contains(e.target) && !this.menu.contains(e.target)) {
        this.btn.setAttribute("aria-expanded", "false");
        this.menu.setAttribute("data-open", "false");
      }
    },
  },

  // ========================================
  // 스크롤 기능
  // ========================================
  scroll: {
    init() {
      document.querySelectorAll("[data-scroll]").forEach((btn) => {
        btn.addEventListener("click", this.handleScroll);
      });
    },

    handleScroll(e) {
      const btn = e.currentTarget;
      const selector = btn.getAttribute("data-scroll");
      const target = selector ? document.querySelector(selector) : null;
      (target || document.body).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
  },
  // ========================================
  // 검색 폼 기능
  // ========================================
  searchForm: {
    forms: [],

    init() {
      const forms = document.querySelectorAll(".form-search");
      forms.forEach((form) => {
        this.initForm(form);
      });
    },

    initForm(form) {
      const dateStart = form.querySelector(".date-start");
      const dateEnd = form.querySelector(".date-end");
      const searchInput = form.querySelector(
        "#search-keyword, .search-keyword"
      );

      // 날짜 입력 필드를 date 타입으로 변경
      if (dateStart) dateStart.type = "date";
      if (dateEnd) dateEnd.type = "date";

      // 시작일 변경 시 종료일 최소값 설정
      if (dateStart) {
        dateStart.addEventListener("change", () => {
          if (dateEnd && dateStart.value) {
            dateEnd.min = dateStart.value;

            // 종료일이 시작일보다 이전이면 자동 조정
            if (dateEnd.value && dateEnd.value < dateStart.value) {
              dateEnd.value = dateStart.value;
            }
          }
        });
      }

      // 종료일 변경 시 시작일 최대값 설정
      if (dateEnd) {
        dateEnd.addEventListener("change", () => {
          if (dateStart && dateEnd.value) {
            dateStart.max = dateEnd.value;

            // 시작일이 종료일보다 이후면 자동 조정
            if (dateStart.value && dateStart.value > dateEnd.value) {
              dateStart.value = dateEnd.value;
            }
          }
        });
      }

      // 폼 제출 이벤트
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit(form, dateStart, dateEnd, searchInput);
      });

      this.forms.push({ form, dateStart, dateEnd, searchInput });
    },

    handleSubmit(form, dateStart, dateEnd, searchInput) {
      const searchData = {
        startDate: dateStart?.value || "",
        endDate: dateEnd?.value || "",
        keyword: searchInput?.value || "",
      };

      // 커스텀 이벤트 발생
      const event = new CustomEvent("search:submit", {
        detail: searchData,
        bubbles: true,
      });
      form.dispatchEvent(event);

      console.log("검색 조건:", searchData);
    },

    // 폼 데이터 가져오기 (외부에서 호출 가능)
    getData(formElement) {
      const formData = this.forms.find((f) => f.form === formElement);
      if (!formData) return null;

      return {
        startDate: formData.dateStart?.value || "",
        endDate: formData.dateEnd?.value || "",
        keyword: formData.searchInput?.value || "",
      };
    },

    // 폼 초기화
    reset(formElement) {
      const formData = this.forms.find((f) => f.form === formElement);
      if (!formData) return;

      if (formData.dateStart) {
        formData.dateStart.value = "";
        formData.dateStart.removeAttribute("max");
      }
      if (formData.dateEnd) {
        formData.dateEnd.value = "";
        formData.dateEnd.removeAttribute("min");
      }
      if (formData.searchInput) {
        formData.searchInput.value = "";
      }
    },
  },
  // ========================================
  // 줌 컨트롤 기능
  // ========================================
  zoom: {
    zoomLevel: 100,
    minZoom: 50,
    maxZoom: 200,
    zoomStep: 10,
    buttons: {},

    init() {
      this.cacheElements();
      this.bindEvents();
      this.updateZoomDisplay();
    },

    cacheElements() {
      this.buttons.zoomOut = document.querySelector(
        '.zoom-btn[aria-label="줌 아웃"]'
      );
      this.buttons.zoomIn = document.querySelector(
        '.zoom-btn[aria-label="줌 인"]'
      );
      this.display = document.querySelector(".zoom-percentage");
    },

    bindEvents() {
      if (this.buttons.zoomOut) {
        this.buttons.zoomOut.addEventListener("click", () => this.zoomOut());
      }
      if (this.buttons.zoomIn) {
        this.buttons.zoomIn.addEventListener("click", () => this.zoomIn());
      }

      // 단축키 (한 번만 등록)
      document.addEventListener("keydown", this.handleKeydown.bind(this));
    },

    handleKeydown(e) {
      if (!e.ctrlKey) return;

      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        this.zoomIn();
      } else if (e.key === "-") {
        e.preventDefault();
        this.zoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        this.resetZoom();
      }
    },

    zoomIn() {
      if (this.zoomLevel < this.maxZoom) {
        this.zoomLevel = Math.min(this.zoomLevel + this.zoomStep, this.maxZoom);
        this.applyZoom();
      }
    },

    zoomOut() {
      if (this.zoomLevel > this.minZoom) {
        this.zoomLevel = Math.max(this.zoomLevel - this.zoomStep, this.minZoom);
        this.applyZoom();
      }
    },

    resetZoom() {
      this.zoomLevel = 100;
      this.applyZoom();
    },

    applyZoom() {
      document.body.style.zoom = this.zoomLevel + "%";
      this.updateButtonStates();
      this.updateZoomDisplay();
    },

    updateButtonStates() {
      if (this.buttons.zoomOut) {
        const disabled = this.zoomLevel <= this.minZoom;
        this.buttons.zoomOut.disabled = disabled;
        this.buttons.zoomOut.style.opacity = disabled ? "0.5" : "1";
      }
      if (this.buttons.zoomIn) {
        const disabled = this.zoomLevel >= this.maxZoom;
        this.buttons.zoomIn.disabled = disabled;
        this.buttons.zoomIn.style.opacity = disabled ? "0.5" : "1";
      }
    },

    updateZoomDisplay() {
      if (this.display) {
        this.display.textContent = this.zoomLevel + "%";
      }
    },
  },
  // ========================================
  // 검색 오버레이 기능 (portal 네임스페이스에 추가)
  // ========================================
  searchOverlay: {
    modal: null,
    overlay: null,
    closeBtn: null,
    input: null,
    searchBtn: null,
    previousFocus: null,

    init() {
      this.cacheElements();
      if (!this.modal) return;

      this.bindEvents();
    },

    cacheElements() {
      this.modal = document.getElementById("searchModal");
      if (!this.modal) return;

      this.overlay = this.modal.querySelector(".search-modal__overlay");
      this.closeBtn = this.modal.querySelector(".search-modal__close-btn");
      this.input = this.modal.querySelector(".search-modal__input");
      this.searchBtn = this.modal.querySelector(".search-modal__search-btn");
    },

    bindEvents() {
      // 닫기 버튼
      if (this.closeBtn) {
        this.closeBtn.addEventListener("click", () => this.close());
      }

      // 오버레이 클릭
      if (this.overlay) {
        this.overlay.addEventListener("click", () => this.close());
      }

      // ESC 키
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen()) {
          this.close();
        }
      });

      // 검색 버튼
      if (this.searchBtn) {
        this.searchBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleSearch();
        });
      }

      // 엔터키로 검색
      if (this.input) {
        this.input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            this.handleSearch();
          }
        });
      }

      // 키워드 버튼들
      this.modal.addEventListener("click", (e) => {
        const keywordBtn = e.target.closest(".search-modal__keyword-btn");
        if (keywordBtn) {
          this.handleKeywordClick(keywordBtn);
        }
      });
    },

    open() {
      if (!this.modal) return;

      this.modal.classList.add("is-active");
      this.modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // 이전 포커스 저장
      this.previousFocus = document.activeElement;

      // 포커스 이동
      setTimeout(() => {
        if (this.input) this.input.focus();
      }, 100);
    },

    close() {
      if (!this.modal) return;

      this.modal.classList.remove("is-active");
      this.modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      // 포커스 복원
      if (this.previousFocus) {
        this.previousFocus.focus();
      }
    },

    isOpen() {
      return this.modal?.classList.contains("is-active") || false;
    },

    handleSearch() {
      const keyword = this.input?.value.trim();
      if (!keyword) return;

      // 커스텀 이벤트 발생
      const event = new CustomEvent("search:overlay", {
        detail: { keyword },
        bubbles: true,
      });
      this.modal.dispatchEvent(event);

      console.log("통합 검색:", keyword);

      // 실제 검색 로직 구현 필요
      // 예: window.location.href = `/search?q=${encodeURIComponent(keyword)}`;
    },

    handleKeywordClick(btn) {
      const keyword = btn.textContent.trim();
      if (this.input) {
        this.input.value = keyword;
      }
      this.handleSearch();
    },
  },

  // ========================================
  // 스크롤 탭 컴포넌트 (다중 인스턴스 대응)
  // ========================================
  scrollTab: {
    init() {
      const containers = document.querySelectorAll(".scroll-tab-container");
      if (!containers.length) return;

      containers.forEach((container) => this.mount(container));
    },

    mount(container) {
      const list = container.querySelector(".scroll-tab-list");
      if (!list) return;

      const prevBtn = container.querySelector(".scroll-tab-nav-btn.prev");
      const nextBtn = container.querySelector(".scroll-tab-nav-btn.next");
      const items = container.querySelectorAll(".scroll-tab-item");

      // 탭 활성 토글 (컨테이너 범위)
      items.forEach((item) => {
        item.addEventListener("click", () => {
          items.forEach((i) => i.classList.remove("active"));
          item.classList.add("active");
        });
      });

      // 스크롤 네비
      const scrollBy = (direction) => {
        const amount = 250;
        list.scrollLeft += direction * amount;
      };

      prevBtn && prevBtn.addEventListener("click", () => scrollBy(-1));
      nextBtn && nextBtn.addEventListener("click", () => scrollBy(1));

      // 버튼 상태 업데이트 (모바일에서만)
      const updateButtons = () => {
        if (!prevBtn || !nextBtn) return;
        if (window.innerWidth <= 1024) {
          const maxScroll = list.scrollWidth - list.clientWidth;
          prevBtn.disabled = list.scrollLeft <= 0;
          nextBtn.disabled = list.scrollLeft >= maxScroll - 5;
        } else {
          prevBtn.disabled = true;
          nextBtn.disabled = true;
        }
      };

      list.addEventListener("scroll", updateButtons);
      window.addEventListener("resize", updateButtons);
      updateButtons();
    },
  },

  // portal 객체에 추가할 filterSort 모듈
  // ========================================
  // Filter & Sort 기능
  // ========================================
  filterSort: {
    init() {
      const containers = document.querySelectorAll("[data-filter-sort-bar]");
      if (!containers.length) return;

      containers.forEach((container) => this.mount(container));
    },

    mount(container) {
      // PC 정렬 버튼 클릭
      const sortButtons = container.querySelectorAll(".sort-btn");
      sortButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          sortButtons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          console.log("정렬 변경:", btn.getAttribute("data-sort"));
        });
      });

      // 목록 개수 변경
      const itemCountSelect = container.querySelector(".filter-select");
      if (itemCountSelect) {
        itemCountSelect.addEventListener("change", (e) => {
          console.log("표시 개수:", e.target.value);
        });
      }

      // 모바일 정렬 셀렉트
      const sortSelectMobile = container.querySelector(".sort-select-mobile");
      if (sortSelectMobile) {
        sortSelectMobile.addEventListener("change", (e) => {
          console.log("정렬 변경 (모바일):", e.target.value);
        });
      }
    },
  },
  // ========================================
  // 초기화
  // ========================================
  init() {
    if (this.initialized) return;

    this.copy.init();
    this.modal.init();
    this.tab.init();
    this.popover.init();
    this.dropdown.init();
    this.scroll.init();
    this.zoom.init();
    this.searchForm.init();
    this.searchOverlay.init();
    this.scrollTab.init();
    this.filterSort.init();
    this.initialized = true;
    console.log("Portal initialized");
  },
};

// ========================================
// 자동 초기화
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  portal.init();

  const searchButton = document.querySelector(".search-button");
  searchButton.addEventListener("click", function () {
    portal.searchOverlay.open();
  });
});

// 전역으로 export (필요시)
window.portal = portal;
