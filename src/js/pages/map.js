import '@/scss/main.scss';
import '@/scss/pages/map/_map.scss';
console.log("Map main page JS loaded");

document.addEventListener(`DOMContentLoaded`, () => {
    _FN.els(`[data-samplescript]`).forEach(_target => {
        _target.addEventListener(`click`, () => {
            _FN.sample[_target.getAttribute(`data-samplescript`)]();
        });
    })
    _FN.els(`[data-pressed]`).forEach(_target => {
        _target.addEventListener(`click`, () => {
            _target.setAttribute(`data-pressed`, _target.getAttribute(`data-pressed`) == `true` ? `false` : `true`);
            
            // data-group 중에서 하나만 선택 가능
            if (_target.getAttribute(`data-group`)) {
                _target.parentElement.closest(`[data-groupWrap`).querySelectorAll(`[data-group="${_target.getAttribute('data-group')}"]`).forEach(_groupItem => {
                    if (_groupItem != _target) _groupItem.setAttribute(`data-pressed`, `false`);
                });
            }
        });
    });

    // radio tab
    _FN.els(`input[type=radio][data-target]`).forEach(_tab => {
        _tab.addEventListener(`click`, () => {
            _FN.els(`[data-group='${_tab.getAttribute('name')}'] input[name='${_tab.getAttribute('name')}']`).forEach(_siblings => {
                _FN.el(`[data-title='${_siblings.getAttribute('data-target')}']`).setAttribute('data-show', 'false');
            });
            _FN.el(`[data-title='${_tab.getAttribute('data-target')}']`).setAttribute('data-show', 'true');
        });
    })

    // result 펴고 접기
    _FN.el(`section.list button.folding.show`).addEventListener(`click`, () => _FN.result.show());

    _FN.el(`section.list button.folding.hide`).addEventListener(`click`, () => {
        _FN.result.hide();
        _FN.el(`nav.filter button[data-pressed='true']`).click();
    });

    // result filter 펴고 접기
    _FN.els(`section.list nav.filter button`).forEach(_button => {
        _button.addEventListener('click', () => {
            if (_button.getAttribute('data-pressed') == 'true') {
                _FN.el(`.filterWrap`).setAttribute('data-show', 'true');
                _FN.els(`.filterWrap .set`).forEach(_set => _set.setAttribute(`data-show`, false));
                _FN.el(`.filterWrap .set[data-title="${_button.getAttribute('data-target')}"]`).setAttribute(`data-show`, _button.getAttribute(`data-pressed`));
                if (_button.getAttribute(`data-pressed`) == 'true') _FN.result.show();
            } else {
                _FN.el(`.filterWrap`).setAttribute('data-show', 'false');
            }
        });
    });

    // result 선택
    _FN.els(`[data-selected]`).forEach(_target => {
        _target.addEventListener(`click`, () => {
            _FN.els(`[data-selectWrap] [data-selected]`).forEach(_siblings => {
                if (_siblings != _target) _siblings.setAttribute(`data-selected`, `false`);
            });
            _target.setAttribute(`data-selected`, _target.getAttribute(`data-selected`) == `true` ? `false` : `true`);
        });
    });

    // sidebar
        // 레이어팝업 켜고 끄기
    _FN.els(`aside.sidebar button[aria-haspopup="true"]`).forEach(_button => {
        _button.addEventListener(`click`, () => {
            _FN.els(`aside.sidebar .popup`).forEach(_popup => _popup.setAttribute(`data-show`, false));
            _FN.el(`aside.sidebar .popup[data-title="${_button.getAttribute('data-target')}"]`).setAttribute(`data-show`, _button.getAttribute(`data-pressed`));
        });
    });
});

const _FN = {
    el : function (selector) { return document.querySelector(selector); },
    els : function (selector)  { return document.querySelectorAll(selector); },
    result : {
        show : function () { _FN.el(`section.list .result`).setAttribute(`data-folded`, `false`); },
        hide : function () { _FN.el(`section.list .result`).setAttribute(`data-folded`, `true`); },
    },
    sample : {
        filterApply : function () {
            _FN.el(`.list`).setAttribute(`data-state`, `filterApplyed`);
            _FN.els(`nav.filter button`).forEach(_button => _button.disabled = true);
            _FN.el(`nav.filter button[data-pressed='true']`).classList.add('applyed');
            _FN.el(`nav.filter button[data-pressed='true'] span`).textContent = '선택사항';
        },
        filterReset :function () {
            _FN.el(`nav.filter button[data-pressed='true']`).classList.remove('applyed');
            _FN.el(`.list`).setAttribute(`data-state`, null);
        }
    },
}