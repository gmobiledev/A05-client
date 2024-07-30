import { Component, OnInit } from '@angular/core';
import { TaskService } from 'app/auth/service/task.service';

@Component({
  selector: 'app-sim-so',
  templateUrl: './sim-so.component.html',
  styleUrls: ['./sim-so.component.scss']
})
export class SimSoComponent implements OnInit {

  public contentHeader: any = {
    headerTitle: 'Thống kê',
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
          name: 'Thống kê',
          isLink: false
        }
      ]
    }
  };
  data;

  constructor(
    private readonly taskService: TaskService
  ) { }
  

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.taskService.getReportTelecom({}).subscribe(res => {
      this.data = res.data;
    })
  }

}
