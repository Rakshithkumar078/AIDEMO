import React, { useEffect } from 'react';
import { useResolvedPath, useMatch, useLocation, matchPath, Link, NavLink, NavLinkProps } from 'react-router-dom';
import { slideUp } from './../../composables/slideUp';
import { slideToggle } from './../../composables/slideToggle';

interface MenuItem {
  path: string;
  icon?: string;
  img?: string;
  label?: string;
  badge?: string;
  highlight?: boolean;
  title?: string;
  children?: MenuItem[];
}

interface NavItemProps extends Omit<NavLinkProps, 'to'> {  // Remove 'to' from NavLinkProps
  menu: MenuItem;
}

const NavItem: React.FC<NavItemProps> = ({ menu, ...props }) => {
  const resolved = useResolvedPath(menu.path || '/');
  const match = useMatch({ path: resolved.pathname, end: false });

  const location = useLocation();
  const match2 = menu.path ? matchPath(menu.path, location.pathname) : null;

  return (
    <div className={`menu-item${match || match2 ? ' active' : ''}${menu.children ? ' has-sub' : ''}`}>
     <NavLink className="menu-link" to={menu.path || '/'} {...props}>
        {menu.img && <div className="menu-icon-img"><img src={menu.img} alt="" /></div>}
        {menu.icon && <div className="menu-icon"><i className={menu.icon}></i></div>}
        {menu.title && (
          <div className="menu-text">
            {menu.title} {menu.label && <span className="menu-label ms-5px">{menu.label}</span>}
            {menu.highlight && <i className="fa fa-paper-plane text-theme"></i>}
          </div>
        )}
        {menu.children && !menu.badge && <div className="menu-caret"></div>}
        {menu.badge && <div className="menu-badge">{menu.badge}</div>}
      </NavLink>
      
      {menu.children && (
        <div className="menu-submenu">
          {menu.children.map((submenu, i) => (
            <NavItem key={i} menu={submenu} />
          ))}
        </div>
      )}
    </div>
  );
}

const TopMenuNav: React.FC = () => {
  useEffect(() => {
    handlePageLoadMenuFocus();
    handleTopMenuSubMenu();
  }, []);

  function handlePageLoadMenuFocus(): void {
    const targetMenu = document.querySelector('.app-top-menu .menu') as HTMLElement | null;
    if (!targetMenu) return;

    const viewWidth = (document.querySelector('.app-top-menu') as HTMLElement).clientWidth - 128;
    let prevWidth = 0, fullWidth = 0;
    const elms = Array.from(document.querySelectorAll('.app-top-menu .menu > .menu-item')) as HTMLElement[];

    let found = false;
    elms.forEach((elm) => {
      if (!elm.classList.contains('menu-control')) {
        fullWidth += elm.clientWidth;
        if (!found) prevWidth += elm.clientWidth;
        if (elm.classList.contains('active')) found = true;
      }
    });

    if (prevWidth >= viewWidth) {
      const finalScrollWidth = prevWidth - viewWidth + 128;
      targetMenu.style.marginLeft = `-${finalScrollWidth}px`;
    }

    const elmEnd = targetMenu.querySelector('.menu-control.menu-control-end') as HTMLElement | null;
    const elmStart = targetMenu.querySelector('.menu-control.menu-control-start') as HTMLElement | null;
    elmEnd?.classList.toggle('show', prevWidth !== fullWidth && fullWidth >= viewWidth);
    elmStart?.classList.toggle('show', prevWidth >= viewWidth && fullWidth >= viewWidth);
  }

  function handleMenuButtonAction(event: React.MouseEvent<HTMLAnchorElement>, direction: string): void {
    event.preventDefault();
    const obj = (event.currentTarget.closest('.menu') as HTMLElement) ?? null;
    if (!obj) return;

    const objStyle = window.getComputedStyle(obj);
    const marginLeft = parseInt(objStyle.getPropertyValue('margin-left'));
    const containerWidth = (document.querySelector('.app-top-menu') as HTMLElement).clientWidth - 80;
    const totalWidth = Array.from(obj.querySelectorAll('.menu-item:not(.menu-control)'))
      .reduce((sum, item) => sum + (item as HTMLElement).clientWidth, 0);
    
    let finalScrollWidth = 0;
    if (direction === 'next') {
      finalScrollWidth = Math.min(containerWidth - marginLeft - 88, totalWidth + marginLeft - containerWidth);
    } else {
      finalScrollWidth = Math.max(0, marginLeft + containerWidth - 88);
    }

    obj.style.transition = 'margin 300ms';
    obj.style.marginLeft = `-${finalScrollWidth}px`;
    setTimeout(() => {
      obj.style.transition = '';
    }, 300);
  }

  function handleTopMenuToggle(menus: HTMLElement[], forMobile=false): void {
    menus.forEach(menu => {
      menu.onclick = (e: MouseEvent) => {
        e.preventDefault();
        if (!forMobile || (forMobile && window.innerWidth < 768)) {
          const target = menu.nextElementSibling as HTMLElement;
          menus.forEach(m => {
            const otherTarget = m.nextElementSibling as HTMLElement;
            if (otherTarget !== target) {
              slideUp(otherTarget);
              otherTarget.closest('.menu-item')?.classList.remove('expand');
            }
          });
          slideToggle(target);
        }
      };
    });
  }

  function handleTopMenuSubMenu(): void {
    const menus = Array.from(document.querySelectorAll('.app-top-menu .menu > .menu-item.has-sub > .menu-link')) as HTMLElement[];
    handleTopMenuToggle(menus, true);
  }

  return (
    <div id="app-top-menu" className="menu">
      {/* {menus.map((menu: MenuItem, i: number) => (
        <NavItem key={i} menu={menu} />
      ))} */}
      <div className="menu-item menu-control menu-control-start">
        <Link className="menu-link" to="/" onClick={(e) => handleMenuButtonAction(e, 'prev')}>
          <i className="fa fa-angle-left"></i>
        </Link>
      </div>
      <div className="menu-item menu-control menu-control-end">
        <Link className="menu-link" to="/" onClick={(e) => handleMenuButtonAction(e, 'next')}>
          <i className="fa fa-angle-right"></i>
        </Link>
      </div>
    </div>
  );
}

export default TopMenuNav;
