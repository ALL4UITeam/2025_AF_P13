import '@/scss/main.scss';
import '@/scss/pages/map/_map.scss';
console.log("Map main page JS loaded");

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-pressed]').forEach(_target => {
        _target.addEventListener('click', () => {
            _target.setAttribute('data-pressed', _target.getAttribute('data-pressed') == 'true' ? 'false' : 'true');
            
            // tab일 경우 하나만 선택 가능
            if (_target.parentElement.getAttribute('role') == 'tab') {
                Array.from(_target.parentElement.children).forEach(_child => {
                    if (_child != _target) _child.setAttribute('data-pressed', 'false');
                });
            }
        });
    });

    document.querySelector('section.list button.folding.show').addEventListener('click', () => {
        document.querySelector('section.list .result').setAttribute('data-folded', 'false');
    });

    document.querySelector('section.list button.folding.hide').addEventListener('click', () => {
        document.querySelector('section.list .result').setAttribute('data-folded', 'true');
    });
});