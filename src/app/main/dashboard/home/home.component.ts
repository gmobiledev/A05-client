import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { ObjectLocalStorage } from 'app/utils/constants';
import { environment } from 'environments/environment';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { AdminService } from 'app/auth/service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'app/auth/service/task.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { CoreConfigService } from '@core/services/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {


  public contentHeader: any;
  public list: any;
  sums: any;
  total: any;

  public isViewFile: boolean = false;
  public urlFile: any;
  // Private
  private $primary = '#7367F0';
  private $warning = '#FF9F43';
  private $info = '#00cfe8';
  private $info_light = '#1edec5';
  private $strok_color = '#b9c3cd';
  private $label_color = '#e7eef7';
  private $white = '#fff';
  private $textHeadingColor = '#5e5873';

  public avgsessionChartoptions;
  public supportChartoptions;
  public salesChartoptions;
  public isMenuToggled = true;

  public permissionTelecom;



  getSubscribe() {
    console.log(Notification.permission);
    let isSub = localStorage.getItem(ObjectLocalStorage.FCM_SUBSCRIBE) ? true : false;
    if (!isSub) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(() => {
          this.setSubcribe();
        }).catch((error) => {
          console.log(error);
        });
      }
      else if (Notification.permission === 'denied') {
        console.log('denined');
      } else {
        this.setSubcribe();
      }
    }
  }

  async setSubcribe() {
    const firebaseConfig = environment.firebaseConfig;
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    getToken(messaging, { vapidKey: environment.FCM_VAPID_PUBLIC_KEY }).then((currentToken) => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
        console.log("Notification Subscription: ", currentToken);
        this.authenService.saveRegId({ reg_id: currentToken }).subscribe(res => {
          localStorage.setItem(ObjectLocalStorage.FCM_SUBSCRIBE, currentToken);
        })
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
  }


  public data: any = {
    subscribers_gained: {
      series: [
        {
          name: 'Subscribers',
          data: [28, 40, 36, 52, 38, 60, 55]
        }
      ],
      analyticsData: {
        subscribers: '92.6k'
      }
    },
    ordersRecevied: {
      series: [
        {
          name: 'Orders',
          data: [10, 15, 8, 15, 7, 12, 8]
        }
      ],
      analyticsData: {
        orders: '38.4k'
      }
    },
    avgSessions: {
      series: [
        {
          name: 'Sessions',
          data: [75, 125, 225, 175, 125, 75, 25]
        }
      ],
      analyticsData: {
        avgSessions: '2.7k',
        vsLastSevenDays: '+5.2%',
        goal: '$100000',
        goalProgressbar: 50,
        retention: '90%',
        retentionProgressbar: 60,
        users: '100k',
        usersProgressbar: 70,
        duration: '1yr',
        durationProgressbar: 90
      }
    },
    supportTracker: {
      series: [83],
      analyticsData: {
        tickets: 163,
        newTickets: 29,
        openTickets: 63,
        responseTime: '1d'
      }
    },
    salesLastSixMonths: {
      series: [
        {
          name: 'Sales',
          data: [90, 50, 86, 40, 100, 20]
        },
        {
          name: 'Visit',
          data: [70, 75, 70, 76, 20, 85]
        }
      ]
    },
    statistics: {
      analyticsData: {
        sales: '230k',
        customers: '8.549k',
        products: '1.423k',
        revenue: '$9745'
      }
    },
    ordersChart: {
      series: [
        {
          name: '2020',
          data: [45, 85, 65, 45, 65]
        }
      ],
      analyticsData: {
        orders: '2,76k'
      }
    },
    profitChart: {
      series: [
        {
          data: [0, 20, 5, 30, 15, 45]
        }
      ],
      analyticsData: {
        profit: '6,24k'
      }
    },
    revenueReport: {
      earningExpenseChart: {
        series: [
          {
            name: 'Earning',
            data: [95, 177, 284, 256, 105, 63, 168, 218, 72]
          },
          {
            name: 'Expense',
            data: [-145, -80, -60, -180, -100, -60, -85, -75, -100]
          }
        ]
      },
      budgetChart: {
        series: [
          {
            data: [61, 48, 69, 52, 60, 40, 79, 60, 59, 43, 62]
          },
          {
            data: [20, 10, 30, 15, 23, 0, 25, 15, 20, 5, 27]
          }
        ]
      },
      analyticsData: {
        currentBudget: '$25,852',
        totalBudget: '56,800'
      }
    },
    goalOverview: {
      series: [83],
      analyticsData: {
        completed: '786,617',
        inProgress: '13,561'
      }
    }
  };

  public loading = false;

  public gainedChartoptions = {
    chart: {
      height: 100,
      type: 'area',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      width: 2.5
    },
    colors: [this.$primary],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2.5
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.9,
        opacityFrom: 0.7,
        opacityTo: 0.5,
        stops: [0, 80, 100]
      }
    },
    tooltip: {
      x: { show: false }
    }
  };

  public orderChartoptions = {
    chart: {
      height: 100,
      type: 'area',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      width: 2.5
    },
    colors: [this.$warning],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2.5
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.9,
        opacityFrom: 0.7,
        opacityTo: 0.5,
        stops: [0, 80, 100]
      }
    },
    series: [
      {
        name: 'Orders',
        data: [10, 15, 8, 15, 7, 12, 8]
      }
    ],
    tooltip: {
      x: { show: false }
    }
  };

  constructor(
    private adminService: AdminService,
    private authenService: AuthenticationService

  ) {
    this.getData();
  }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER) || null);
    this.permissionTelecom = currentUser && currentUser.agents.length > 0 && currentUser.agents.includes('TELECOM');
    this.getSubscribe();
    this.contentHeader = {
      headerTitle: 'Tổng quan',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Tổng quan',
            isLink: false
          }
        ]
      }
    };
  }

  getData() {
    this.adminService.getReports().subscribe(res => {
      this.list = res.data;
    })
  }

}

