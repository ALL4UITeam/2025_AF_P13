import "../main.js";
console.log("Map main page JS loaded");
document.addEventListener(`DOMContentLoaded`, () => {
  _0.els(`[data-samplescript]`).forEach((_target) => {
    _target.addEventListener(`click`, () => {
      _0.sample[_target.getAttribute(`data-samplescript`)]();
    });
  });
  _0.els(`[data-pressed]`).forEach((_target) => {
    _target.addEventListener(`click`, () => {
      if (_target.closest(`[data-groupWrap].slideTab`)) {
        _target.setAttribute(`data-pressed`, true);
      } else {
        _target.setAttribute(`data-pressed`, _target.getAttribute(`data-pressed`) == `true` ? `false` : `true`);
      }
      if (_target.getAttribute(`data-group`)) {
        _target.parentElement.closest(`[data-groupWrap`).querySelectorAll(`[data-group="${_target.getAttribute(`data-group`)}"]`).forEach((_groupItem) => {
          if (_groupItem != _target) _groupItem.setAttribute(`data-pressed`, `false`);
        });
      }
    });
  });
  _0.els(`input[type=radio][data-target]`).forEach((_tab) => {
    _tab.addEventListener(`click`, () => {
      _0.els(`[data-group='${_tab.getAttribute(`name`)}'] input[name='${_tab.getAttribute(`name`)}']`).forEach((_siblings) => {
        _0.el(`[data-title='${_siblings.getAttribute(`data-target`)}']`).setAttribute(`data-show`, `false`);
      });
      _0.el(`[data-title='${_tab.getAttribute(`data-target`)}']`).setAttribute(`data-show`, `true`);
    });
  });
  _0.el(`section.list button.folding.show`).addEventListener(`click`, () => _0.result.show());
  _0.el(`section.list button.folding.hide`).addEventListener(`click`, () => {
    _0.result.hide();
    _0.el(`nav.filter button[data-pressed='true']`).click();
  });
  _0.els(`section.list nav.filter button`).forEach((_button) => {
    _button.addEventListener(`click`, () => {
      if (_button.getAttribute(`data-pressed`) == `true`) {
        _0.el(`.filterWrap`).setAttribute(`data-folded`, `false`);
        _0.els(`.filterWrap .set`).forEach((_set) => _set.setAttribute(`data-show`, `false`));
        _0.el(`.filterWrap .set[data-title="${_button.getAttribute(`data-target`)}"]`).setAttribute(`data-show`, _button.getAttribute(`data-pressed`));
        _0.result.show();
      } else {
        _0.el(`.filterWrap`).setAttribute(`data-folded`, `true`);
      }
    });
  });
  _0.els(`[data-selected]`).forEach((_target) => {
    _target.addEventListener(`click`, () => {
      _0.els(`[data-selectWrap] [data-selected]`).forEach((_siblings) => {
        if (_siblings != _target) _siblings.setAttribute(`data-selected`, `false`);
      });
      _target.setAttribute(`data-selected`, _target.getAttribute(`data-selected`) == `true` ? `false` : `true`);
      _target.getAttribute(`data-selected`) == `true` ? _0.detail.show() : _0.detail.hide();
    });
  });
  _0.el(`.detail header button.close`).addEventListener(`click`, () => {
    _0.detail.hide();
  });
  _0.els(`aside.sidebar button[aria-haspopup="true"]`).forEach((_button) => {
    _button.addEventListener(`click`, () => {
      _0.els(`aside.sidebar .popup`).forEach((_popup) => _popup.setAttribute(`data-show`, false));
      _0.el(`aside.sidebar .popup[data-title="${_button.getAttribute(`data-target`)}"]`).setAttribute(`data-show`, _button.getAttribute(`data-pressed`));
    });
  });
  _0.els(`aside.sidebar .popup button.close`).forEach((_button) => {
    _button.addEventListener(`click`, () => _0.el(`aside.sidebar button.menu[data-target='${_button.closest(`.popup`).getAttribute(`data-title`)}']`).click());
  });
  _0.els(`.modal header button.close`).forEach((_button) => {
    _button.addEventListener(`click`, () => _button.closest(`.modal`).setAttribute(`data-show`, `false`));
  });
});
const _0 = {
  el: function(selector) {
    return document.querySelector(selector);
  },
  els: function(selector) {
    return document.querySelectorAll(selector);
  },
  result: {
    show: function() {
      _0.el(`section.list .result`).setAttribute(`data-folded`, `false`);
    },
    hide: function() {
      _0.el(`section.list .result`).setAttribute(`data-folded`, `true`);
    }
  },
  detail: {
    show: function() {
      _0.el(`section.detail`).setAttribute(`data-show`, `true`);
    },
    hide: function() {
      _0.el(`section.detail`).setAttribute(`data-show`, `false`);
    }
  },
  filter: {
    reset: function() {
      _0.els(`nav.filter button`).forEach((_button) => _button.disabled = false);
      _0.el(`nav.filter button[data-pressed='true']`).classList.remove(`applyed`);
      _0.el(`nav.filter button[data-pressed='true']`).setAttribute(`data-pressed`, `false`);
      _0.el(`.filterWrap`).setAttribute(`data-folded`, `true`);
      _0.el(`.list`).setAttribute(`data-state`, null);
    }
  },
  sample: {
    filterApply: function() {
      _0.el(`.list`).setAttribute(`data-state`, `filterApplyed`);
      _0.els(`nav.filter button`).forEach((_button) => _button.disabled = true);
      _0.el(`nav.filter button[data-pressed='true']`).classList.add(`applyed`);
      _0.el(`nav.filter button[data-pressed='true'] span`).textContent = `선택사항`;
    },
    filterReset: function() {
      _0.filter.reset();
    },
    modalpopup: function() {
      _0.el(`.modal`).setAttribute(`data-show`, `true`);
    }
  }
};
