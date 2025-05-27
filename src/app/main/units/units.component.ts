import { Component, OnInit } from '@angular/core';
import { UnitService } from 'app/auth/service/unit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
  units = [];
  filteredUnits = [];
  unitForm: FormGroup;
  isEditing = false;
  currentId = null;
  searchKeyword = '';
  unitToDelete: any;

   contentHeader = {
    headerTitle: 'Danh sách đơn vị',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'Trang chủ',
          isLink: true,
          link: '/'
        },
        {
          name: 'Danh sách đơn vị',
          isLink: 'telecom'
        }
      ]
    }
  };

  constructor(
    private unitService: UnitService,
    private fb: FormBuilder,
    private alertService: SweetAlertService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.unitForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: [''],

    });
    this.loadUnits();
  }

  loadUnits(): void {
    this.unitService.getAllUnits().subscribe(res => {
      this.units = res.data || res;
      this.filteredUnits = this.units;
    });
  }

  onSearch(): void {
    const keyword = this.searchKeyword.toLowerCase();
    this.filteredUnits = this.units.filter(unit =>
      unit.name.toLowerCase().includes(keyword)
    );
  }

  openModal(modal): void {
    this.resetForm();
    this.modalService.open(modal, { centered: true });
  }

  onSubmit(modal): void {
    if (this.unitForm.invalid) return;
    const data = this.unitForm.value;
    if (this.isEditing) {
      this.unitService.updateUnit(this.currentId, data).subscribe(res => {
        this.alertService.showSuccess('Cập nhật thành công');
        this.resetForm();
        this.loadUnits();
        modal.close();
      });
    } else {
      this.unitService.createUnit(data).subscribe(res => {
        this.alertService.showSuccess('Thêm mới thành công');
        this.resetForm();
        this.loadUnits();
        modal.close();
      });
    }
  }

  editUnit(unit, modal): void {
    this.unitForm.patchValue(unit);
    this.isEditing = true;
    this.currentId = unit.id;
    this.modalService.open(modal, { centered: true });
  }

  deleteUnit(id: number): void {
    if (confirm('Bạn có chắc muốn xoá đơn vị này?')) {
      this.unitService.deleteUnit(id).subscribe(() => {
        this.alertService.showSuccess('Xoá thành công');
        this.loadUnits();
      });
    }
  }

  resetForm(): void {
    this.unitForm.reset();
    this.isEditing = false;
    this.currentId = null;
  }

  openConfirmModal(unit: any, modalRef: any) {
  this.unitToDelete = unit;
  this.modalService.open(modalRef, { centered: true });
}

  onConfirmDelete(modal: any) {
    this.deleteUnit(this.unitToDelete.id);
    modal.close();
  }
}
