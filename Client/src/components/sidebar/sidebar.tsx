import * as React from 'react';
import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { AppSettings } from '../../config/app-settings';
import { slideToggle } from '../../composables/slideToggle';
import SidebarMinifyBtn from './sidebar-minify-btn';
import SidebarNav from './sidebar-nav';
// import SidebarProfile from './sidebar-profile';

function Sidebar() {
	const context = useContext(AppSettings);

	useEffect(() => {
		const handleSidebarMenuToggle = function (menus: any, expandTime: number) {
			menus.map(function (menu: any) {
				menu.onclick = function (e: any) {
					e.preventDefault();
					const target = this.nextElementSibling;

					// menus.map(function(m: any) {
					// 	const otherTarget = m.nextElementSibling;
					// 	if (otherTarget !== target) {
					// 		slideUp(otherTarget, expandTime);
					// 		otherTarget.closest('.menu-item').classList.remove('expand');
					// 		otherTarget.closest('.menu-item').classList.add('closed');
					// 	}
					// 	return true;
					// });

					const targetItemElm = target.closest('.menu-item');

					if (targetItemElm.classList.contains('expand') || (targetItemElm.classList.contains('active') && !target.style.display)) {
						targetItemElm.classList.remove('expand');
						targetItemElm.classList.add('closed');
						slideToggle(target, expandTime);
					} else {
						targetItemElm.classList.add('expand');
						targetItemElm.classList.remove('closed');
						slideToggle(target, expandTime);
					}
				}
				return true;
			});
		};

		const targetSidebar = document.querySelector('.app-sidebar:not(.app-sidebar-end)');
		const expandTime = (targetSidebar && targetSidebar.getAttribute('data-disable-slide-animation')) ? 0 : 300;
		const menuBaseSelector = '.app-sidebar .menu > .menu-item.has-sub';
		const submenuBaseSelector = ' > .menu-submenu > .menu-item.has-sub';

		// menu
		const menuLinkSelector = menuBaseSelector + ' > .menu-link';
		const menus = [].slice.call(document.querySelectorAll(menuLinkSelector));
		handleSidebarMenuToggle(menus, expandTime);

		// submenu lvl 1
		const submenuLvl1Selector = menuBaseSelector + submenuBaseSelector;
		const submenusLvl1 = [].slice.call(document.querySelectorAll(submenuLvl1Selector + ' > .menu-link'));
		handleSidebarMenuToggle(submenusLvl1, expandTime);

		// submenu lvl 2
		const submenuLvl2Selector = menuBaseSelector + submenuBaseSelector + submenuBaseSelector;
		const submenusLvl2 = [].slice.call(document.querySelectorAll(submenuLvl2Selector + ' > .menu-link'));
		handleSidebarMenuToggle(submenusLvl2, expandTime);

		let appSidebarFloatSubmenuTimeout = {};
		let appSidebarFloatSubmenuDom = '';

		function handleGetHiddenMenuHeight(elm: any) {
			elm.setAttribute('style', 'position: absolute; visibility: hidden; display: block !important');
			const targetHeight = elm.clientHeight;
			elm.removeAttribute('style');
			return targetHeight;
		}

		function handleSidebarMinifyFloatMenuClick() {
			const elms = Array.from(document.querySelectorAll('#app-sidebar-float-submenu .menu-item.has-sub > .menu-link')) as HTMLElement[];
			if (elms) {
				elms.forEach(elm => {
					elm.onclick = function (e: any) {
						e.preventDefault();
						const targetItem = (this as HTMLElement).closest('.menu-item');
						const target = targetItem?.querySelector('.menu-submenu') as HTMLElement | null;
						if (!target) return;

						const targetStyle = getComputedStyle(target);
						const close = (targetStyle.getPropertyValue('display') !== 'block');
						const expand = (targetStyle.getPropertyValue('display') === 'block');

						slideToggle(target);

						const loopHeight = setInterval(() => {
							const targetMenu = document.querySelector('#app-sidebar-float-submenu') as HTMLElement | null;
							const targetMenuArrow = document.querySelector('#app-sidebar-float-submenu-arrow') as HTMLElement | null;
							const targetMenuLine = document.querySelector('#app-sidebar-float-submenu-line') as HTMLElement | null;
							if (!targetMenu || !targetMenuArrow || !targetMenuLine) return;

							const targetHeight = targetMenu.clientHeight;
							const targetOffset = targetMenu.getBoundingClientRect();
							const targetOriTop = parseInt(targetMenu.getAttribute('data-offset-top') || '0', 10);
							const targetMenuTop = parseInt(targetMenu.getAttribute('data-menu-offset-top') || '0', 10);
							const targetTop = targetOffset.top;
							const windowHeight = document.body.clientHeight;

							if (close) {
								if (targetTop > targetOriTop) {
									targetMenu.style.top = `${targetOriTop}px`;
									targetMenu.style.bottom = 'auto';
									targetMenuArrow.style.top = '20px';
									targetMenuArrow.style.bottom = 'auto';
									targetMenuLine.style.top = '20px';
									targetMenuLine.style.bottom = 'auto';
								}
							}

							if (expand) {
								if ((windowHeight - targetTop) < targetHeight) {
									const arrowBottom = (windowHeight - targetMenuTop) - 22;
									targetMenu.style.top = 'auto';
									targetMenu.style.bottom = '0';
									targetMenuArrow.style.top = 'auto';
									targetMenuArrow.style.bottom = `${arrowBottom}px`;
									targetMenuLine.style.top = '20px';
									targetMenuLine.style.bottom = `${arrowBottom}px`;
								}

								const floatSubmenuElm = document.querySelector('#app-sidebar-float-submenu .app-sidebar-float-submenu') as HTMLElement | null;
								if (targetHeight > windowHeight && floatSubmenuElm) {
									const splitClass = ('overflow-scroll mh-100vh').split(' ');
									for (let i = 0; i < splitClass.length; i++) {
										floatSubmenuElm.classList.add(splitClass[i]);
									}
								}
							}
						}, 1);
						setTimeout(() => {
							clearInterval(loopHeight);
						}, 250);
					};
				});
			}
		}

		function handleSidebarMinifyFloatMenu() {
			const elms = Array.from(document.querySelectorAll('.app-sidebar .menu > .menu-item.has-sub > .menu-link'));
			if (elms) {
				elms.forEach((elm: any) => {
					elm.onmouseenter = function () {
						const appElm = document.querySelector('.app');
						if (appElm && appElm.classList.contains('app-sidebar-minified')) {
							clearTimeout(appSidebarFloatSubmenuTimeout as number);
							const menuItem = this.closest('.menu-item');
							const targetMenu = menuItem?.querySelector('.menu-submenu') as HTMLElement;
							if (appSidebarFloatSubmenuDom === this && document.querySelector('#app-sidebar-float-submenu')) {
								return;
							} else {
								//appSidebarFloatSubmenuDom = this;
							}
							const targetMenuHtml = targetMenu?.innerHTML;
							if (targetMenuHtml) {
								const bodyStyle = getComputedStyle(document.body);
								const sidebar = document.querySelector('#sidebar') as HTMLElement | null;
								const sidebarOffset = sidebar?.getBoundingClientRect();
								const sidebarWidth = parseInt(sidebar?.clientWidth.toString() || "0");
								const sidebarX = (!appElm.classList.contains('app-sidebar-end') && bodyStyle.getPropertyValue('direction') !== 'rtl') ? (sidebarOffset!.left + sidebarWidth) : (document.body.clientWidth - sidebarOffset!.left);
								const targetHeight = handleGetHiddenMenuHeight(targetMenu);
								const targetOffset = this.getBoundingClientRect();
								const targetTop = targetOffset.top;
								const targetLeft = (!appElm.classList.contains('app-sidebar-end') && bodyStyle.getPropertyValue('direction') !== 'rtl') ? `${sidebarX}px` : 'auto';
								const targetRight = (!appElm.classList.contains('app-sidebar-end') && bodyStyle.getPropertyValue('direction') !== 'rtl') ? 'auto' : `${sidebarX}px`;
								const darkMode = (sidebar?.getAttribute('data-bs-theme') === 'dark');
								const windowHeight = document.body.clientHeight;

								if (!document.querySelector('#app-sidebar-float-submenu')) {
									let overflowClass = '';
									if (targetHeight > windowHeight) {
										overflowClass = 'overflow-scroll mh-100vh';
									}
									const html = document.createElement('div');
									if (darkMode) {
										html.setAttribute('data-bs-theme', 'dark');
									}
									html.setAttribute('id', 'app-sidebar-float-submenu');
									html.setAttribute('class', 'app-sidebar-float-submenu-container');
									html.setAttribute('data-offset-top', `${targetTop}`);
									html.setAttribute('data-menu-offset-top', `${targetTop}`);
									html.innerHTML = `
										<div class="app-sidebar-float-submenu-arrow" id="app-sidebar-float-submenu-arrow"></div>
										<div class="app-sidebar-float-submenu-line" id="app-sidebar-float-submenu-line"></div>
										<div class="app-sidebar-float-submenu ${overflowClass}">${targetMenuHtml}</div>`;
									appElm.appendChild(html);

									const elm = document.getElementById('app-sidebar-float-submenu');
									elm!.onmouseover = function () {
										clearTimeout(appSidebarFloatSubmenuTimeout as number);
									};
									elm!.onmouseout = function () {
										appSidebarFloatSubmenuTimeout = setTimeout(() => {
											document.querySelector('#app-sidebar-float-submenu')?.remove();
										}, 250);
									};
								} else {
									const floatSubmenu = document.querySelector('#app-sidebar-float-submenu') as HTMLElement;
									const floatSubmenuInnerElm = document.querySelector('#app-sidebar-float-submenu .app-sidebar-float-submenu') as HTMLElement;

									if (targetHeight > windowHeight) {
										if (floatSubmenuInnerElm) {
											const splitClass = ('overflow-scroll mh-100vh').split(' ');
											for (let i = 0; i < splitClass.length; i++) {
												floatSubmenuInnerElm.classList.add(splitClass[i]);
											}
										}
									}
									floatSubmenu?.setAttribute('data-offset-top', `${targetTop}`);
									floatSubmenu?.setAttribute('data-menu-offset-top', `${targetTop}`);
									floatSubmenuInnerElm.innerHTML = targetMenuHtml;
								}

								const targetSubmenuHeight = document.querySelector('#app-sidebar-float-submenu')?.clientHeight || 0;
								const floatSubmenuElm = document.querySelector('#app-sidebar-float-submenu') as HTMLElement;
								const floatSubmenuArrowElm = document.querySelector('#app-sidebar-float-submenu-arrow') as HTMLElement;
								const floatSubmenuLineElm = document.querySelector('#app-sidebar-float-submenu-line') as HTMLElement;
								if ((windowHeight - targetTop) > targetSubmenuHeight) {
									if (floatSubmenuElm) {
										floatSubmenuElm.style.top = `${targetTop}px`;
										floatSubmenuElm.style.left = targetLeft;
										floatSubmenuElm.style.bottom = 'auto';
										floatSubmenuElm.style.right = targetRight;
									}
									if (floatSubmenuArrowElm) {
										floatSubmenuArrowElm.style.top = '20px';
										floatSubmenuArrowElm.style.bottom = 'auto';
									}
									if (floatSubmenuLineElm) {
										floatSubmenuLineElm.style.top = '20px';
										floatSubmenuLineElm.style.bottom = 'auto';
									}
								} else {
									const arrowBottom = (windowHeight - targetTop) - 21;
									floatSubmenuElm.style.top = 'auto';
									floatSubmenuElm.style.left = targetLeft;
									floatSubmenuElm.style.bottom = '0';
									floatSubmenuElm.style.right = targetRight;
									floatSubmenuArrowElm.style.top = 'auto';
									floatSubmenuArrowElm.style.bottom = `${arrowBottom}px`;
									floatSubmenuLineElm.style.top = '20px';
									floatSubmenuLineElm.style.bottom = `${arrowBottom}px`;
								}
								handleSidebarMinifyFloatMenuClick();
							} else {
								document.querySelector('#app-sidebar-float-submenu-line')?.remove();
								appSidebarFloatSubmenuDom = '';
							}
						}
					};
					elm.onmouseleave = function () {
						const appElm = document.querySelector('.app');
						if (appElm && appElm.classList.contains('app-sidebar-minified')) {
							appSidebarFloatSubmenuTimeout = setTimeout(() => {
								document.querySelector('#app-sidebar-float-submenu-line')?.remove();
								appSidebarFloatSubmenuDom = '';
							}, 250);
						}
					};
				});
			}
		}


		handleSidebarMinifyFloatMenu();
	},[]);

	return (
		<AppSettings.Consumer>
			{({ toggleAppSidebarMobile, appSidebarTransparent, appSidebarGrid, appSidebarLight }) => (
				<React.Fragment>
					<div id="sidebar" className={'app-sidebar ' + (appSidebarTransparent ? 'app-sidebar-transparent' : '') + (appSidebarGrid ? 'app-sidebar-grid' : '')} data-bs-theme={appSidebarLight ? '' : 'dark'}>
						<PerfectScrollbar className="app-sidebar-content" options={{ suppressScrollX: true }}>
						{/* {!context.appSidebarSearch && ( <SidebarProfile /> )} */}
							<SidebarNav />
							<SidebarMinifyBtn />
						</PerfectScrollbar>
					</div>
					<div className="app-sidebar-bg" data-bs-theme={appSidebarLight ? '' : 'dark'}></div>
					<div className="app-sidebar-mobile-backdrop"><Link to="/" onClick={toggleAppSidebarMobile} className="stretched-link"></Link></div>
				</React.Fragment>
			)}
		</AppSettings.Consumer>
	)
}

export default Sidebar;