angular.module('pullToRefresh', []).directive('pullToRefresh', function ($compile, $progress) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, controllers) {
            const id = scope.id
            const refreshScope = scope.$new(true);

            let touchstartY = 0;
            let refreshPos = 0
            const defaultPos = -50
            const maxPos = 50

            const $ctrl = { touchstartY, refreshPos }
            refreshScope.$ctrl = $ctrl

            const refreshContainer = $compile(`<div class="pull-to-refresh-container">
                <div class="pull-to-refresh">
                    <bln-spinner core style="--bln-spinner-size:30px;--bln-spinner-thickness:8"></bln-spinner>
                    <bln-progress core 
                        style="--bln-progress-circular-size: 30px; --bln-progress-circular-thickness: 8; --bln-progress-percent: 0;"
                        shape="&quot;circular&quot;" 
                        step="$ctrl.step" 
                        binding-step="$ctrl.step"
                        data-type="step" 
                        data-shape="circular">
                    </bln-spinner>
                </div>
            </div>`)(refreshScope)

            const refreshEl = refreshContainer[0].querySelector('.pull-to-refresh')

            const setPosition = (pos) => {
                if (!refreshEl) return
                $ctrl.refreshPos = pos
                refreshEl.style.transform = 'translateY(' + pos + 'px)'

            }

            setPosition(defaultPos)

            element.prepend(refreshContainer)

            element[0].addEventListener('touchstart', e => {
                $ctrl.touchstartY = e.touches[0].clientY;
            });

            element[0].addEventListener('touchmove', e => {
                const touchY = e.touches[0].clientY;
                const diff = touchY - $ctrl.touchstartY

                let newPos = defaultPos + diff
                if (newPos > maxPos) newPos = maxPos

                setPosition(newPos)
            });

            element[0].addEventListener('touchend', e => {
                setPosition(10)

                setTimeout(() => {

                    setPosition(defaultPos)
                }, 3000)
            });
        }
    }
})