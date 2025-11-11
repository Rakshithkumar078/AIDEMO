import React, { useEffect } from 'react';
import TopMenuNav from './top-menu-nav';
import { slideToggle } from './../../composables/slideToggle';
import { slideUp } from './../../composables/slideUp';

function handleUnlimitedTopMenuRender(): void {

	// handle page load active menu focus
	function handlePageLoadMenuFocus(): void {
		const targetMenu: Element | null = document.querySelector('.app-top-menu .menu');
		if (!targetMenu) {
			return;
		}
		const bodyStyle: CSSStyleDeclaration = window.getComputedStyle(document.body);
		const viewWidth: number = (document.querySelector('.app-top-menu') as HTMLElement).clientWidth;
		let prevWidth= 0;
		let fullWidth= 0;
		const controlPrevObj: Element | null = targetMenu.querySelector('.menu-control-start');
		const controlNextObj: Element | null = targetMenu.querySelector('.menu-control-end');
		const controlNextWidth: number = (controlPrevObj && controlNextObj) ? (controlNextObj as HTMLElement).clientWidth : 0;
		let controlWidth= 0;

		const elms: HTMLElement[] = Array.prototype.slice.call(document.querySelectorAll('.app-top-menu .menu > .menu-item'));
		if (elms) {
			let found = false;
			elms.map(function(elm: HTMLElement): boolean {
				if (!elm.classList.contains('menu-control')) {
					fullWidth += elm.clientWidth;
					if (!found) {
						prevWidth += elm.clientWidth;
					}
					if (elm.classList.contains('active')) {
						found = true;
					}
				}
				return true;
			});
		}
		
		const elm: Element | null = targetMenu.querySelector('.menu-control.menu-control-end');
		if (prevWidth !== fullWidth && fullWidth >= viewWidth) {
			elm && elm.classList.add('show');
			controlWidth += controlNextWidth;
		} else {
			elm && elm.classList.remove('show');
		}
		
		const elm2: Element | null = targetMenu.querySelector('.menu-control.menu-control-start');
		if (prevWidth >= viewWidth && fullWidth >= viewWidth) {
			elm2 && elm2.classList.add('show');
		} else {
			elm2 && elm2.classList.remove('show');
		}
		
		if (prevWidth >= viewWidth) {
			const finalScrollWidth: number = prevWidth - viewWidth + controlWidth;
			if (bodyStyle.getPropertyValue('direction') !== 'rtl') {
				(targetMenu as HTMLElement).style.marginLeft = '-' + finalScrollWidth + 'px';
			} else {
				(targetMenu as HTMLElement).style.marginRight = '-' + finalScrollWidth + 'px';
			}
		}
	}
	
	function enableFluidContainerDrag(containerClassName: string): void {
		const container: Element | null = document.querySelector(containerClassName);
		if (!container) {
			return;
		}
		const menu: Element | null = container.querySelector('.menu');
		if (!menu) {
			return;
		}
		const menuItem: NodeListOf<Element> = menu.querySelectorAll('.menu-item:not(.menu-control)');

		let startX: number, scrollLeft: number, mouseDown: boolean;
		let menuWidth= 0;
		let maxScroll = 0;

		menuItem.forEach((element: Element) => {
			menuWidth += (element as HTMLElement).offsetWidth;
		});

		container.addEventListener('mousedown', (e: any) => {
			mouseDown = true;
			startX = e.pageX;
			scrollLeft = menu instanceof HTMLElement && menu.style.marginLeft ? parseInt(menu.style.marginLeft) : 0;
			maxScroll = (container as HTMLElement).offsetWidth - menuWidth;
		});

		container.addEventListener('touchstart', (e: any) => {
			mouseDown = true;
			const touch: Touch = e.targetTouches[0];
			startX = touch.pageX;
			scrollLeft = menu instanceof HTMLElement && menu.style.marginLeft ? parseInt(menu.style.marginLeft) : 0;
			maxScroll = (container as HTMLElement).offsetWidth - menuWidth;
		});

		container.addEventListener('mouseup', () => {
			mouseDown = false;
		});

		container.addEventListener('touchend', () => {
			mouseDown = false;
		});

		container.addEventListener('mousemove', (e: any) => {
			if (!startX || !mouseDown) return;
			if (window.innerWidth < 768) return;
			e.preventDefault();
			const x: number = e.pageX;
			const walkX: number = (x - startX) * 1;
			let totalMarginLeft: number = scrollLeft + walkX;
			const menuControlEnd = menu.querySelector('.menu-control.menu-control-end');
			if (totalMarginLeft <= maxScroll) {
				totalMarginLeft = maxScroll;
				menuControlEnd && menuControlEnd.classList.remove('show');
			} else {
				menuControlEnd && menuControlEnd.classList.add('show');
			}
			const menuControlStart = menu.querySelector('.menu-control.menu-control-start');
			if (menuWidth < (container as HTMLElement).offsetWidth) {
				menuControlStart && menuControlStart.classList.remove('show');
			}
			if (maxScroll > 0) {
				menuControlEnd && menuControlEnd.classList.remove('show');
			}
			if (totalMarginLeft > 0) {
				totalMarginLeft = 0;
				menuControlStart && menuControlStart.classList.remove('show');
			} else {
				menuControlStart && menuControlStart.classList.add('show');
			}
			(menu as HTMLElement).style.marginLeft = totalMarginLeft + 'px';
		});

		container.addEventListener('touchmove', (e: any) => {
			if (!startX || !mouseDown) return;
			if (window.innerWidth < 768) return;
			e.preventDefault();
			const touch: Touch = e.targetTouches[0];
			const x: number = touch.pageX;
			const walkX: number = (x - startX) * 1;
			let totalMarginLeft: number = scrollLeft + walkX;
			const menuControlEnd = menu.querySelector('.menu-control.menu-control-end');
			if (totalMarginLeft <= maxScroll) {
				totalMarginLeft = maxScroll;
				menuControlEnd && menuControlEnd.classList.remove('show');
			} else {
				menuControlEnd && menuControlEnd.classList.add('show');
			}
			const menuControlStart = menu.querySelector('.menu-control.menu-control-start');
			if (menuWidth < (container as HTMLElement).offsetWidth) {
				menuControlStart && menuControlStart.classList.remove('show');
			}
			if (maxScroll > 0) {
				menuControlEnd && menuControlEnd.classList.remove('show');
			}
			if (totalMarginLeft > 0) {
				totalMarginLeft = 0;
				menuControlStart && menuControlStart.classList.remove('show');
			} else {
				menuControlStart && menuControlStart.classList.add('show');
			}
			(menu as HTMLElement).style.marginLeft = totalMarginLeft + 'px';
		});
	}
	
	window.addEventListener('resize', function() {
		if (window.innerWidth >= 768) {
			const targetElm: Element | null = document.querySelector('.app-top-menu');
			if (targetElm) {
				(targetElm as HTMLElement).removeAttribute('style');
			}
			const targetElm2: Element | null = document.querySelector('.app-top-menu .menu');
			if (targetElm2) {
				(targetElm2 as HTMLElement).removeAttribute('style');
			}
			const targetElm3: NodeListOf<Element> | null = document.querySelectorAll('.app-top-menu .menu-submenu');
			if (targetElm3) {
				targetElm3.forEach((elm3: Element) => {
					(elm3 as HTMLElement).removeAttribute('style');
				});
			}
			handlePageLoadMenuFocus();
		}
		enableFluidContainerDrag('.app-top-menu');
	});
	
	if (window.innerWidth >= 768) {
		handlePageLoadMenuFocus();
		enableFluidContainerDrag('.app-top-menu');
	}
}

function handleTopMenuToggle(menus: HTMLElement[], forMobile = false): void {
	menus.map(function(menu: any): boolean {
		menu.onclick = function(e: any): void {
			e.preventDefault();
			
			if (!forMobile || (forMobile && document.body.clientWidth < 768)) {
				const target: Element | null = this.nextElementSibling;
				menus.map(function(m: HTMLElement): boolean {
					const otherTarget: Element | null = m.nextElementSibling;
					if (otherTarget !== target) {
						slideUp(otherTarget);
						otherTarget && otherTarget.closest('.menu-item')?.classList.remove('expand');
						otherTarget && otherTarget.closest('.menu-item')?.classList.add('closed');
					}
					return true;
				});
			
				slideToggle(target);
			}
		};
		return true;
	});
}

function handleTopMenuSubMenu(): void {
	const menuBaseSelector= '.app-top-menu .menu > .menu-item.has-sub';
	const submenuBaseSelector = ' > .menu-submenu > .menu-item.has-sub';
	
	// 14.1 Menu - Toggle / Collapse
	const menuLinkSelector=  menuBaseSelector + ' > .menu-link';
	const menus: HTMLElement[] = Array.prototype.slice.call(document.querySelectorAll(menuLinkSelector));
	handleTopMenuToggle(menus, true);
	
	// 14.2 Menu - Submenu lvl 1
	const submenuLvl1Selector = menuBaseSelector + submenuBaseSelector;
	const submenusLvl1: HTMLElement[] = Array.prototype.slice.call(document.querySelectorAll(submenuLvl1Selector + ' > .menu-link'));
	handleTopMenuToggle(submenusLvl1);
	
	// 14.3 submenu lvl 2
	const submenuLvl2Selector= menuBaseSelector + submenuBaseSelector + submenuBaseSelector;
	const submenusLvl2: HTMLElement[] = Array.prototype.slice.call(document.querySelectorAll(submenuLvl2Selector + ' > .menu-link'));
	handleTopMenuToggle(submenusLvl2);
}

function TopMenu() {
	useEffect(() => {
		handleUnlimitedTopMenuRender();
		handleTopMenuSubMenu();
	});
		
	return (
		<React.Fragment>
			<div id="top-nav" className="app-top-menu" data-bs-theme="dark">
				<TopMenuNav />
			</div>
		</React.Fragment>
	);
}

export default TopMenu;
