import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { CoreService } from 'src/app/services/core.service';
import { AppSettings } from 'src/app/app.config';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { AppNavItemComponent } from './vertical/sidebar/nav-item/nav-item.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './vertical/sidebar/sidebar.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HeaderComponent } from './vertical/header/header.component';
import { AppHorizontalHeaderComponent } from './horizontal/header/header.component';
import { AppHorizontalSidebarComponent } from './horizontal/sidebar/sidebar.component';
import { AppBreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { CustomizerComponent } from './shared/customizer/customizer.component';

import { LoginService } from '@app/services/login.service'
import { PrivilegeService } from '@app/services/privilege.service'
import { UserModel } from '@app/models/user'

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';
const BELOWMONITOR = 'screen and (max-width: 1023px)';

type NavItem = { navCap: string } | { displayName: string, iconName: string, route: string };

@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    RouterModule,
    AppNavItemComponent,
    MaterialModule,
    CommonModule,
    SidebarComponent,
    NgScrollbarModule,
    TablerIconsModule,
    HeaderComponent,
    AppHorizontalHeaderComponent,
    AppHorizontalSidebarComponent,
    AppBreadcrumbComponent,
    CustomizerComponent
  ],
  templateUrl: './full.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class FullComponent implements OnInit {
  idrol: any;
  navItems: NavItem[] = [];

  @ViewChild('leftsidenav')
  public sidenav: MatSidenav;
  resView = false;
  @ViewChild('content', { static: true }) content!: MatSidenavContent;
  //get options from service
  options = this.settings.getOptions();
  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  private htmlElement!: HTMLHtmlElement;
  user?: UserModel | null;

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  get isTablet(): boolean {
    return this.resView;
  }

  constructor(
    private settings: CoreService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private loginService: LoginService,
    private privilegeService: PrivilegeService,
  ) {
    this.loginService.user
      .subscribe(x => this.user = x);

    if (this.user && this.user.idrol !== null && this.user.idrol !== undefined) {
      this.createMenu();  //aqui para los grantsbyrol
    }
    this.htmlElement = document.querySelector('html')!;
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW, BELOWMONITOR])
      .subscribe((state) => {
        // SidenavOpened must be reset true when layout changes
        this.options.sidenavOpened = true;
        this.isMobileScreen = state.breakpoints[MOBILE_VIEW];
        if (this.options.sidenavCollapsed == false) {
          this.options.sidenavCollapsed = state.breakpoints[TABLET_VIEW];
        }
        this.isContentWidthFixed = state.breakpoints[MONITOR_VIEW];
        this.resView = state.breakpoints[BELOWMONITOR];
      });

    // Initialize project theme with options
    this.receiveOptions(this.options);

    // This is for scroll to top
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e) => {
        this.content.scrollTo({ top: 0 });
      });


    // menu sin validacion de paginas
    if (this.user && (this.user.idrol === null)) {
      // if (this.user && (this.user.idrol === null || this.user.idrol === 1)) {
      this.navItems.push({ navCap: 'Admin' });
      this.navItems.push({
        displayName: 'Home',
        iconName: 'home',
        route: '/',
      });
      this.navItems.push({
        displayName: 'Roles and Privileges',
        iconName: 'axe',
        route: '/admin/role',
      });
      this.navItems.push({
        displayName: 'Person',
        iconName: 'users',
        route: '/admin/person',
      });
      this.navItems.push({
        displayName: 'Gender',
        iconName: 'gender-bigender',
        route: '/admin/gender',
      });

      this.navItems.push({
        displayName: 'Geography',
        iconName: 'flag-2-filled',
        route: '/admin/geography',
      });

      this.navItems.push({
        displayName: 'Corporations',
        iconName: 'building-skyscraper',
        route: '/admin/corporation',
      });

      this.navItems.push({
        displayName: 'Branch',
        iconName: 'building-community',
        route: '/admin/branch',
      });

      this.navItems.push({
        displayName: 'Department',
        iconName: 'building',
        route: '/admin/department',
      });
      this.navItems.push({ navCap: 'Reporte' });

      this.navItems.push({
        displayName: 'Reporte',
        iconName: 'notes',
        route: '/report/report-list',
      });

      this.navItems.push({
        displayName: 'Historial',
        iconName: 'file-time',
        route: '/report/report-history',
      });
    }
  }

  ngOnInit(): void {


  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.resetCollapsedState();
  }

  resetCollapsedState(timer = 400) {
    setTimeout(() => this.settings.setOptions(this.options), timer);
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
    this.options.sidenavOpened = isOpened;
    this.settings.setOptions(this.options);
  }

  receiveOptions(options: AppSettings): void {
    this.options = options;
    this.toggleDarkTheme(options);
  }

  toggleDarkTheme(options: AppSettings) {
    if (options.theme === 'dark') {
      this.htmlElement.classList.add('dark-theme');
      this.htmlElement.classList.remove('light-theme');
    } else {
      this.htmlElement.classList.remove('dark-theme');
      this.htmlElement.classList.add('light-theme');
    }
  }

  logout() {
    this.loginService.logout();
  }

  createMenu() {
    if (this.user && this.user.idrol !== null && this.user.idrol !== undefined) {
      this.privilegeService.getPrivilegeByIdRole(this.user.idrol)
        .subscribe(response => {
          let dataResponse = response.granted;


          if (this.existMenu(dataResponse, 'profile') || this.existMenu(dataResponse, 'privileges')) {
            this.navItems.push({ navCap: 'Admin' });

            if (this.existMenu(dataResponse, 'profile')) {
              this.navItems.push({
                displayName: 'Home',
                iconName: 'home',
                route: '/',
              });
            };

            if (this.existMenu(dataResponse, 'privileges')) {
              this.navItems.push({
                displayName: 'Roles and Privileges',
                iconName: 'axe',
                route: '/admin/role',
              });
            };
            if (this.existMenu(dataResponse, 'person')) {
              this.navItems.push({
                displayName: 'Person',
                iconName: 'users',
                route: '/admin/person',
              });
            };

            if (this.existMenu(dataResponse, 'gender')) {
              this.navItems.push({
                displayName: 'Gender',
                iconName: 'gender-bigender',
                route: '/admin/gender',
              });
            };
            if (this.existMenu(dataResponse, 'geography')) {
              this.navItems.push({
                displayName: 'Geography',
                iconName: 'flag-2-filled',
                route: '/admin/geography',
              });
            };

            if (this.existMenu(dataResponse, 'corporation')) {
              this.navItems.push({
                displayName: 'Corporations',
                iconName: 'building-skyscraper',
                route: '/admin/corporation',
              });
            };

            if (this.existMenu(dataResponse, 'branch')) {
              this.navItems.push({
                displayName: 'Branch',
                iconName: 'building-community',
                route: '/admin/branch',
              });
            };

            if (this.existMenu(dataResponse, 'department')) {
              this.navItems.push({
                displayName: 'Department',
                iconName: 'building',
                route: '/admin/department',
              });
            };



          };
          if (this.existMenu(dataResponse, 'report')) {
            this.navItems.push({ navCap: 'Reporte' });

            if (this.existMenu(dataResponse, 'report')) {
              this.navItems.push({
                displayName: 'Report',
                iconName: 'notes',
                route: 'report/report-list',
              });
            };
            if (this.existMenu(dataResponse, 'history')) {
              this.navItems.push({
                displayName: 'Historial',
                iconName: 'file-time',
                route: '/report/report-history',
              });
            };
          }
        });
    }
  }

  existMenu(dataPrivilege: any, page: string) {
    for (let data of dataPrivilege) {

      if (data.codigopagina == page) {
        return true;
      }
    }
    return false;
  }
}
