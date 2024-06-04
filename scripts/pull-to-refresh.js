angular.module('pullToRefresh', []).directive('pullToRefreshss', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, controllers) {
            const refreshScope = scope.$new(true);

            let touchstartY = 0;
            let refreshPos = 0
            const defaultPos = -50
            const canRefreshPos = 25
            const maxPos = 50

            const $ctrl = { touchstartY, refreshPos }
            refreshScope.$ctrl = $ctrl

            const refreshContainer = $compile(`<div class="pull-to-refresh-container">
                <div class="pull-to-refresh">
                    <bln-badge core 
                        style="--bln-badge-icon-size:30px;--bln-badge-default-color:transparent;--bln-badge-text-color:var(--primary-color, #000);--bln-badge-padding:0%;--bln-badge-margin:0%; width: 34px; display: flex; justify-content: center; align-items: center; padding-top: 4px; padding-top: 1.5px" 
                        icon="({
                            &quot;type&quot;: &quot;font-icon&quot;,
                            &quot;style&quot;: &quot;solid&quot;,
                            &quot;name&quot;: &quot;redo-alt&quot;,
                            &quot;position&quot;: &quot;icon-only&quot;
                        })">
                    </bln-badge>
                    <bln-spinner core style="--bln-spinner-size:30px;--bln-spinner-thickness:8; --bln-spinner-color: var(--primary-color, #000)"></bln-spinner>
                </div>
            </div>`)(refreshScope)

            /** @type {HTMLElement} */
            const refreshEl = refreshContainer[0].querySelector('.pull-to-refresh')
            /** @type {HTMLElement} */
            const spinner = refreshContainer[0].querySelector('bln-spinner')
            /** @type {HTMLElement} */
            const reload = refreshContainer[0].querySelector('bln-badge')

            if (!refreshEl || !spinner || !reload) return

            /** @param state {'default' | 'can-reload' | 'hidden'}  */
            const setReloadIcon = (state) => {
                switch (state) {
                    case 'can-reload':
                        reload.style.opacity = '1'
                        break;

                    case 'default':
                        reload.style.opacity = '.35'
                        break;

                    case 'hidden':
                        reload.style.opacity = '0'
                        break;
                }
            }

            const setSpinner = (isReloading) => {
                if (isReloading) {
                    spinner.style.opacity = '1'
                } else {
                    spinner.style.opacity = '0'
                }
            }

            const setPosition = (pos, deg) => {
                if (!refreshEl) return
                $ctrl.refreshPos = pos
                refreshEl.style.transform = 'translateY(' + pos + 'px)'
                reload.style.transform = 'rotate(' + deg + 'deg)'
            }

            const resetToDefault = () => {
                setPosition(defaultPos, 0)
                setSpinner(false)
                setReloadIcon('default')
            }

   

            resetToDefault()

            element.prepend(refreshContainer)

            element[0].addEventListener('touchstart', e => {
                if (element.scrollTop !== 0) return
                $ctrl.touchstartY = e.touches[0].clientY;

                const canRefresh = $ctrl.refreshPos > canRefreshPos
                setReloadIcon(canRefresh ? 'can-reload' : 'default')
                setSpinner(false)
            });

            element[0].addEventListener('touchmove', e => {
                if (element.scrollTop !== 0) return
                const touchY = e.touches[0].clientY;
                const diff = touchY - $ctrl.touchstartY

                let newPos = defaultPos + diff
                if (newPos > maxPos) newPos = maxPos

                setPosition(newPos, newPos * 3.6)

                const canRefresh = $ctrl.refreshPos > canRefreshPos
                setReloadIcon(canRefresh ? 'can-reload' : 'default')
            });

            element[0].addEventListener('touchend', e => {
                if (element.scrollTop !== 0) return
                const canRefresh = $ctrl.refreshPos > canRefreshPos

                if (canRefresh) {
                    setPosition(10, 0)
                    setSpinner(true)
                    setReloadIcon('hidden')

                    setTimeout(() => {
                        resetToDefault()
                    }, 3000)
                } else {
                    resetToDefault()
                }


            });
        }
    }
})