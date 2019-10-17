import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { EchartDataModel, selectDateModel } from './echarts.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-echarts',
  templateUrl: './echarts.component.html',
  styleUrls: ['./echarts.component.less']
})
export class EchartsComponent implements OnInit {
  showloading = true;
  activeUserTitle = '';
  activeUserData: EchartDataModel = new EchartDataModel();
  newUserData: EchartDataModel = new EchartDataModel();
  totalPatientData: EchartDataModel = new EchartDataModel();
  newPatientData: EchartDataModel = new EchartDataModel();

  linkoption1: any;
  linkoption2: any;
  linkoption3: any;
  linkoption4: any;

  selectValue1 = 'year';
  selectValue2 = 'year';
  selectValue3 = 'year';
  selectValue4 = 'year';
  selectList1: Array<selectDateModel> = [
    new selectDateModel('day', 'day'), new selectDateModel('month', 'month'), new selectDateModel('year', 'year')
  ];
  selectList2: Array<selectDateModel> = [
    new selectDateModel('day', 'day'), new selectDateModel('month', 'month'), new selectDateModel('year', 'year')
  ];
  selectList3: Array<selectDateModel> = [
    new selectDateModel('day', 'day'), new selectDateModel('month', 'month'), new selectDateModel('year', 'year')
  ];
  selectList4: Array<selectDateModel> = [
    new selectDateModel('day', 'day'), new selectDateModel('month', 'month'), new selectDateModel('year', 'year')
  ];

  data: any;
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.activeUserData.lable = ['1', '2', '4'];


    setTimeout(() => {
      this.showloading = false;
    }, 3000);
  }

  ngOnInit() {
    this.updateData1(this.selectValue1, 'active_user');
    this.updateData2(this.selectValue2, 'new_user');
    this.updateData3(this.selectValue3, 'total_patient');
    this.updateData4(this.selectValue4, 'new_patient');

  }

  onChange(type: number) {
    switch (type) {
      case 1:
        this.updateData1(this.selectValue1, 'active_user');
        break;
      case 2:
        this.updateData2(this.selectValue2, 'new_user');
        break;
      case 3:
        this.updateData3(this.selectValue3, 'total_patient');
        break;
      case 4:
        this.updateData4(this.selectValue4, 'new_patient');
        break;
    }
  }


  // tslint:disable-next-line:variable-name
  updateData1(period: string, api_address: string): void {
    const url: string = '/dt_monitor/api/statistics/' + api_address + '/' + period + '/';
    console.log(url);
    this.http.get(url)
      .pipe(
        tap(
          heroes => {
            this.activeUserData.lable = heroes['labels'];
            this.activeUserData.data = heroes['data'];
            this.setOption1();
          },
          error => {
            console.log(error);
          }),
      ).subscribe();
  }

  updateData2(period: string, api_address: string): void {
    const url: string = '/dt_monitor/api/statistics/' + api_address + '/' + period + '/';
    console.log(url);
    this.http.get(url)
      .pipe(
        tap(
          heroes => {
            this.newUserData.lable = heroes['labels'];
            this.newUserData.data = heroes['data'];
            this.setOption2();
          },
          error => {
            console.log(error);
          }),
      ).subscribe();
  }

  updateData3(period: string, api_address: string): void {
    const url: string = '/dt_monitor/api/statistics/' + api_address + '/' + period + '/';
    console.log(url);
    this.http.get(url)
      .pipe(
        tap(
          heroes => {
            this.totalPatientData.lable = heroes['labels'];
            this.totalPatientData.data = heroes['data'];
            this.setOption3();
          },
          error => {
            console.log(error);
          }),
      ).subscribe();
  }

  updateData4(period: string, api_address: string): void {
    const url: string = '/dt_monitor/api/statistics/' + api_address + '/' + period + '/';
    console.log(url);
    this.http.get(url)
      .pipe(
        tap(
          heroes => {
            this.newPatientData.lable = heroes['labels'];
            this.newPatientData.data = heroes['data'];
            this.setOption4();
          },
          error => {
            console.log(error);
          }),
      ).subscribe();
  }

  setOption1() {
    let interval = 0;
    if (this.selectValue1 === 'day') {
      interval = 2;
    }
    this.linkoption1 = {
      // title: {
      //   text: 'Active user'
      // },
      color: ['#3398DB'],
      // 气泡提示框，常用于展现更详细的数据
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      toolbox: {
        show: true,
        feature: {
          // 显示缩放按钮
          dataZoom: {
            show: true
          },
          // 显示折线和块状图之间的切换
          magicType: {
            show: true,
            type: ['bar', 'line']
          },
          // 显示是否还原
          restore: {
            show: false
          },
          // 是否显示图片
          saveAsImage: {
            show: true
          }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: this.activeUserData.lable,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: interval,
          rotate: 20
        },
      }],
      yAxis: [{
        name: this.activeUserTitle,
        type: 'value'
      }],
      series: [{
        name: '今日访问次数',
        type: 'bar',
        barWidth: '60%',
        label: {
          normal: {
            show: false
          }
        },
        data: this.activeUserData.data
      }]
    };
  }


  setOption2() {
    let interval = 0;
    if (this.selectValue2 === 'day') {
      interval = 2;
    }
    this.linkoption2 = {
      // title: {
      //   text: 'New user'
      // },
      color: ['#3398DB'],
      // 气泡提示框，常用于展现更详细的数据
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      toolbox: {
        show: true,
        feature: {
          // 显示缩放按钮
          dataZoom: {
            show: true
          },
          // 显示折线和块状图之间的切换
          magicType: {
            show: true,
            type: ['bar', 'line']
          },
          // 显示是否还原
          restore: {
            show: true
          },
          // 是否显示图片
          saveAsImage: {
            show: true
          }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: this.newUserData.lable,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: interval,
          rotate: 20
        },
      }],
      yAxis: [{
        name: this.activeUserTitle,
        type: 'value'
      }],
      series: [{
        name: '今日访问次数',
        type: 'bar',
        barWidth: '60%',
        label: {
          normal: {
            show: false
          }
        },
        data: this.newUserData.data
      }]
    };
  }

  setOption3() {
    let interval = 0;
    if (this.selectValue3 === 'day') {
      interval = 2;
    }
    this.linkoption3 = {
      // title: {
      //   text: 'Total patient'
      // },
      color: ['#3398DB'],
      // 气泡提示框，常用于展现更详细的数据
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      toolbox: {
        show: true,
        feature: {
          // 显示缩放按钮
          dataZoom: {
            show: true
          },
          // 显示折线和块状图之间的切换
          magicType: {
            show: true,
            type: ['bar', 'line']
          },
          // 显示是否还原
          restore: {
            show: true
          },
          // 是否显示图片
          saveAsImage: {
            show: true
          }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: this.totalPatientData.lable,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: interval,
          rotate: 20
        },
      }],
      yAxis: [{
        name: this.activeUserTitle,
        type: 'value'
      }],
      series: [{
        name: '今日访问次数',
        type: 'bar',
        barWidth: '60%',
        label: {
          normal: {
            show: false
          }
        },
        data: this.totalPatientData.data
      }]
    };
  }

  setOption4() {
    let interval = 0;
    if (this.selectValue4 === 'day') {
      interval = 2;
    }
    this.linkoption4 = {
      // title: {
      //   text: 'New patient'
      // },
      color: ['#3398DB'],
      // 气泡提示框，常用于展现更详细的数据
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      toolbox: {
        show: true,
        feature: {
          // 显示缩放按钮
          dataZoom: {
            show: true
          },
          // 显示折线和块状图之间的切换
          magicType: {
            show: true,
            type: ['bar', 'line']
          },
          // 显示是否还原
          restore: {
            show: true
          },
          // 是否显示图片
          saveAsImage: {
            show: true
          }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: this.newPatientData.lable,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: interval,
          rotate: 20
        },
      }],
      yAxis: [{
        name: this.activeUserTitle,
        type: 'value'
      }],
      series: [{
        name: '今日访问次数',
        type: 'bar',
        barWidth: '60%',
        label: {
          normal: {
            show: false
          }
        },
        data: this.newPatientData.data
      }]
    };
  }

}
