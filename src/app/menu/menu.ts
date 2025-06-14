import { CoreMenu } from '@core/types';
import { ServiceCode } from 'app/utils/constants';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [
  // Dashboard
  // {
  //   id: 'reports',
  //   title: 'Trang chủ',
  //   translate: 'Trang chủ',
  //   type: 'item',
  //   role: ['Admin'], //? To hide collapsible based on user role
  //   icon: 'home',
  //   url: 'dashboard/home',
  // },
  // {
  //   id: 'reports',
  //   title: 'Tra cứu',
  //   translate: 'Tra cứu',
  //   type: 'item',
    // role: ['Admin'], //? To hide collapsible based on user role
  //   icon: 'search',
  //   url: 'pages/tra-cuu',
  // },

  {
    id: 'transaction-management',
    type: 'section',
    title: '',
    translate: '',
    icon: 'package',
    children: [
      {
        id: 'dashboard',
        title: 'Sim Số',
        translate: '',
        type: 'collapsible',
        icon: 'book',
        // role: ['TELECOM'],
        badge: {
          title: '3',
          translate: '',
          classes: 'badge-light-success badge-pill'
        },
        children: [
          {
            id: 'newSim',
            title: 'Đăng ký Cá nhân',
            translate: '',
            type: 'item',
            icon: 'circle',
            url: 'telecom/new-sim'
          },
          // {
          //   id: 'changeSim',
          //   title: 'Thay đổi sim',
          //   translate: '',
          //   type: 'item',
          //   icon: 'circle',
          //   url: 'telecom/change-sim'
          // },
          // {
          //   id: 'changeSim',
          //   title: 'Đơn KITTING',
          //   translate: '',
          //   type: 'item',
          //   role: [ServiceCode.SIM_KITTING],
          //   icon: 'circle',
          //   url: 'task/kitting'
          // },
          {
            id: 'changeSim',
            title: 'Đăng ký doanh nghiệp (theo lô)',
            translate: '',
            type: 'item',
            icon: 'circle',
            // role: [ServiceCode.SIM_REGISTER],
            url: 'task/sim-register'
          },
          {
            id: 'historySim',
            title: 'Lịch sử đấu nối',
            translate: '',
            type: 'item',
            icon: 'circle',
            exactMatch: true,
            url: 'telecom'
          },
          // {
          //   id: 'updateSim',
          //   title: 'Cập nhật TTTB',
          //   translate: '',
          //   type: 'item',
          //   icon: 'circle',
          //   url: 'telecom/update'
          // },
        ]
      },
      {
        id: 'category-management',
        title: 'Danh mục',
        translate: '',
        type: 'collapsible',
        icon: 'folder',
        badge: {
          title: '3',
          translate: '',
          classes: 'badge-light-success badge-pill'
        },
        children: [
          {
            id: 'unit-list',
            title: 'Danh sách đơn vị',
            translate: '',
            type: 'item',
            icon: 'circle',
            url: 'units'
          },
          {
            id: 'task-product',
            title: 'Danh sách số đã sử dụng',
            translate: '',
            type: 'item',
            icon: 'circle',
            url: 'task/task-product'
          },
          {
            id: 'user-history',
            title: 'Lịch sử chuyển sử dụng',
            translate: '',
            type: 'item',
            icon: 'circle',
            url: 'task/user-history'
          },
        ]
      }
      // {
      //   id: 'dashboard',
      //   title: 'Sim Du lịch',
      //   translate: '',
      //   type: 'collapsible',
      //   icon: 'book',
      //   role: [ServiceCode.SIM_PROFILE, ServiceCode.SIM_KITTING, ServiceCode.SIM_REGISTER, ServiceCode.SIM_BUNDLE],
      //   badge: {
      //     title: '5',
      //     translate: '',
      //     classes: 'badge-light-warning badge-pill'
      //   },
      //   children: [
      //     {
      //       id: 'newSim',
      //       title: 'Đơn profile SIM',
      //       translate: '',
      //       type: 'item',
      //       icon: 'circle',
      //       role: [ServiceCode.SIM_PROFILE],
      //       url: 'task/sim'
      //     },
      //     {
      //       id: 'changeSim',
      //       title: 'Đơn KITTING',
      //       translate: '',
      //       type: 'item',
      //       role: [ServiceCode.SIM_KITTING],
      //       icon: 'circle',
      //       url: 'task/kitting'
      //     },
      //     {
      //       id: 'changeSim',
      //       title: 'KITTING Esim',
      //       translate: '',
      //       type: 'item',
      //       role: [ServiceCode.SIM_KITTING],
      //       icon: 'circle',
      //       url: 'task/kitting-esim'
      //     },
         
      //     {
      //       id: 'changeSim',
      //       title: 'Tra cứu',
      //       translate: '',
      //       type: 'item',
      //       icon: 'circle',
      //       url: 'task/search'
      //     },
      //     {
      //       id: 'changeSim',
      //       title: 'Add on Data',
      //       translate: '',
      //       type: 'item',
      //       icon: 'circle',
      //       url: 'task/recharge'
      //     }
      //   ]
      // },
      // {
      //   id: 'dashboard',
      //   title: 'GIP',
      //   translate: '',
      //   type: 'collapsible',
      //   icon: 'grid',
      //   role: ['GIP'],
      //   badge: {
      //     title: '4',
      //     translate: '',
      //     classes: 'badge-light-warning badge-pill'
      //   },
      //   children: [
      //     {
      //       id: 'users',
      //       title: 'Danh sách thuê bao',
      //       translate: '',
      //       type: 'item',
      //       icon: 'circle',
      //       role: ['GIP'],
      //       url: 'gip/list'
      //     },
      //     {
      //       id: 'users',
      //       title: 'Lịch sử cuộc gọi',
      //       translate: '',
      //       type: 'item',
      //       icon: 'circle',
      //       role: ['GIP'],
      //       url: 'gip/call-history'
      //     },
      //     {
      //       id: 'users',
      //       title: 'Báo cáo tiêu dùng',
      //       translate: '',
      //       type: 'item',
      //       icon: 'circle',
      //       role: ['GIP'],
      //       url: 'gip/report'
      //     },
      //     {
      //       id: 'users',
      //       title: 'Quản lý TT GIP',
      //       translate: '',
      //       type: 'item',
      //       icon: 'circle',
      //       role: ['GIP'],
      //       url: 'gip/configuration'
      //     },
      //   ]
      // },
      // {
      //   id: 'users',
      //   title: 'AirTime',
      //   translate: '',
      //   type: 'item',
      //   role: ['AIRTIME_TOPUP'],
      //   icon: 'cast',
      //   url: 'services/airtime'
      // },
      // {
      //   id: 'users',
      //   title: 'Đơn Bundle',
      //   translate: '',
      //   type: 'item',
      //   icon: 'cast',
      //   role: [ServiceCode.SIM_BUNDLE],
      //   url: 'task/sim-bundle'
      // },
      // {
      //   id: 'users',
      //   title: 'Số dư',
      //   translate: '',
      //   type: 'item',
      //   role: [ServiceCode.ADD_MONEY_BALANCE],
      //   icon: 'cast',
      //   url: 'task/balance'
      // },
      // {
      //   id: 'users',
      //   title: 'Số dư Data',
      //   translate: '',
      //   type: 'item',
      //   role: [ServiceCode.ADD_DATA_BALANCE],
      //   icon: 'cast',
      //   url: 'task/data'
      // },
      // {
      //   id: 'users',
      //   title: 'Voice OTP',
      //   role: ['VOICE_OTP'],
      //   translate: '',
      //   type: 'item',
      //   icon: 'message-square',
      //   url: 'services/voice'
      // },

    ]
  },


  // {
  //   id: 'users',
  //   type: 'section',
  //   title: 'Khác',
  //   translate: '',
  //   icon: 'package',
  //   children: [
  //     {
  //       id: 'users',
  //       title: 'Payments',
  //       role: ['AIRTIME_TOPUP', 'VOICE_OTP'],
  //       translate: '',
  //       type: 'item',
  //       icon: 'credit-card',
  //       url: 'payment/list'
  //     },
  //     {
  //       id: 'changeSim',
  //       title: 'Giao dịch số dư',
  //       role: [ServiceCode.ADD_MONEY_BALANCE],
  //       translate: '',
  //       type: 'item',
  //       icon: 'circle',
  //       url: `transaction/${ServiceCode.ADD_MONEY_BALANCE}`
  //     },
  //     {
  //       id: 'changeSim',
  //       title: 'Giao dịch Data',
  //       role: [ServiceCode.ADD_DATA_BALANCE],
  //       translate: '',
  //       type: 'item',
  //       icon: 'circle',
  //       url: `transaction/${ServiceCode.ADD_DATA_BALANCE}`
  //     },
  //     {
  //       id: 'balance_fluctuations',
  //       title: 'Thông tin',
  //       translate: '',
  //       type: 'item',
  //       icon: 'info',
  //       url: 'profile/user-info',
  //     },
  //   ]
  // },


];