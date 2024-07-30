import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProductService } from 'app/auth/service/product.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-shared-list-so',
  templateUrl: './list-so.component.html',
  styleUrls: ['./list-so.component.scss']
})
export class ListSoComponent implements OnInit {
  [x: string]: any;

  @Output() listSelected = new EventEmitter<any>();
  @Output() submitSearch = new EventEmitter<any>();

  public list: any;
  public total:any;
  public searchForm: any = {
    keyword: '',
    page: 1,
  }
  public paramsSearch = {
    keysearch: '',
    take: 10,
    skip: 0,
  }
  public page:number=1;
  public pageSize: number = 20;

  // public selectedSim = [];

  constructor(
    private productService: ProductService,
    private alertService :SweetAlertService,
  ) {  
  }
  onSubmitSearch() {
    this.getData();
  }
  onSelectSim(event, item) {
    this.listSelected.emit({item: item, event: event});
    // this.selectedSim.push(item);
    
    // console.log(this.selectedSim);
    // this.listSelected.emit(this.selectedSim);
  }
  loadPage(page) { 
    console.log(page);     
    this.paramsSearch.skip = this.paramsSearch.take * (page - 1);
    this.page=page;
    this.getData();
    
  }
  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
    this.paramsSearch.keysearch = this.searchForm.keysearch && this.searchForm.keysearch != undefined ? this.searchForm.keysearch : '';
    this.productService.getAll(this.paramsSearch).subscribe(res => {
      this.list = res.data.products;
      this.total= res.data.count;
    })
  }
}
