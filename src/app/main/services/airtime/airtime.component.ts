import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UserService } from 'app/auth/service';

@Component({
  selector: 'app-airtime',
  templateUrl: './airtime.component.html',
  styleUrls: ['./airtime.component.scss']
})

export class AirtimeComponent implements OnInit {
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public contentHeader: any;
  public list: any;
  public page: any;
  public total: any;
  public pageSize: any;
  public searchForm = {
    user: '',
    title: '',
    status: '',
    daterange: '',
    is_customer_sign: '',
    is_guarantee_sign: '',
    is_bank_sign: '',
    page: 1,
  }

  public isViewFile: boolean = false;
  public urlFile: any;
  private $primary = '#7367F0';
  private $warning = '#FF9F43';
  public avgsessionChartoptions;
  public supportChartoptions;
  public salesChartoptions;
  public isMenuToggled = true;
  public showBalance: boolean = false;
  public balance : number

  toggleBalanceTextType() {
    this.userService.showBanalace("AIRTIME_TOPUP").subscribe(res => {
      this.balance = res.data.Balance
      this.showBalance = !this.showBalance;

    }, error => {
      console.log("ERRRR");
      console.log(error);
    })

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


  constructor(private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'AirTime',
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
            name: 'AirTime',
            isLink: false
          }
        ]
      }
    };
    
  }


}
