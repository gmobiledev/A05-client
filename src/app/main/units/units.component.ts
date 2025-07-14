// units.component.ts
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  @ViewChild('unitModal') unitModal: TemplateRef<any>;
  @ViewChild('confirmModal') confirmModal: TemplateRef<any>;

  units = [];
  treeUnits: any[] = [];
  unitForm: FormGroup;
  isEditing = false;
  currentId: number = null;
  searchKeyword = '';
  unitToDelete: any;

  contentHeader = {
    headerTitle: 'Danh sách đơn vị',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        { name: 'Trang chủ', isLink: true, link: '/' },
        { name: 'Danh sách đơn vị', isLink: false }
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
      id: [''],
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: [''],
      parent_id: ['']
    });
    this.loadUnits();
  }

  loadUnits(): void {
    this.unitService.getAllUnits().subscribe(res => {
      this.units = res.data || res;
      this.treeUnits = this.buildUnitTree(this.units);
    });
  }

  buildUnitTree(units: any[]): any[] {
    const map = new Map<number, any>();
    const roots: any[] = [];

    units.forEach(unit => {
      unit.children = [];
      unit.expanded = false; // default state
      map.set(unit.id, unit);
    });

    units.forEach(unit => {
      if (unit.parent_id) {
        const parent = map.get(unit.parent_id);
        if (parent) parent.children.push(unit);
      } else {
        roots.push(unit);
      }
    });

    return roots;
  }

  openModal(modal: TemplateRef<any>, parentUnit = null): void {
    this.resetForm();
    if (parentUnit) {
      this.unitForm.patchValue({ parent_id: parentUnit.id });
    }
    this.modalService.open(modal, { centered: true });
  }

  editUnit(unit: any, modal: TemplateRef<any>): void {
    this.unitForm.patchValue(unit);
    this.isEditing = true;
    this.currentId = unit.id;
    this.modalService.open(modal, { centered: true });
  }

  deleteUnit(id: number): void {
    this.unitService.deleteUnit(id).subscribe(() => {
      this.alertService.showSuccess('Xoá thành công');
      this.loadUnits();
    });
  }

  openConfirmModal(unit: any, modal: TemplateRef<any>): void {
    this.unitToDelete = unit;
    this.modalService.open(modal, { centered: true });
  }

  onConfirmDelete(modal: any): void {
    let a = this.unitService.deleteUnit(this.unitToDelete.id).subscribe({
      next: () => {
        modal.close();
        this.alertService.showMess('Xóa đơn vị thành công!');
      },
      error: (error) => {
        const errorMessage = error || 'Xóa đơn vị thất bại. Vui lòng thử lại.';
        this.alertService.showMess(errorMessage);
      }
    });
  }

  onSubmit(modal): void {
    if (this.unitForm.invalid) return;
    const data = this.unitForm.value;

    if (this.isEditing) {
      this.unitService.updateUnit(this.currentId, data).subscribe(() => {
        this.alertService.showSuccess('Cập nhật thành công');
        this.resetForm();
        this.loadUnits();
        modal.close();
      });
    } else {
      this.unitService.createUnit(data).subscribe(() => {
        this.alertService.showSuccess('Thêm mới thành công');
        this.resetForm();
        this.loadUnits();
        modal.close();
      });
    }
  }

  resetForm(): void {
    this.unitForm.reset();
    this.isEditing = false;
    this.currentId = null;
  }

  onSearch(): void {
    const keyword = this.searchKeyword.trim().toLowerCase();

    if (!keyword) {
      const fullTree = this.buildUnitTree(this.units);

      const resetTree = (nodes: any[]) => {
        nodes.forEach(node => {
          node.highlighted = false;
          node.expanded = false;
          if (node.children) resetTree(node.children);
        });
      };

      resetTree(fullTree);
      this.treeUnits = fullTree;
      return;
    }

    const matchedUnits = this.units.filter(unit =>
      unit.name.toLowerCase().includes(keyword)
    );

    const idSet = new Set<number>(matchedUnits.map(u => u.id));

    const collectParents = (unitId: number) => {
      const unit = this.units.find(u => u.id === unitId);
      if (unit?.parent_id && !idSet.has(unit.parent_id)) {
        idSet.add(unit.parent_id);
        collectParents(unit.parent_id);
      }
    };

    matchedUnits.forEach(unit => collectParents(unit.id));

    const filtered = this.units.filter(u => idSet.has(u.id));
    const fullTree = this.buildUnitTree(filtered);

    const expandMatched = (node: any): boolean => {
      const isMatch = matchedUnits.some(m => m.id === node.id);
      node.highlighted = isMatch;

      if (node.children) {
        let anyChildMatch = false;
        node.children.forEach(child => {
          const childMatch = expandMatched(child);
          if (childMatch) anyChildMatch = true;
        });
        if (anyChildMatch) node.expanded = true;
        return isMatch || anyChildMatch;
      }

      node.expanded = isMatch;
      return isMatch;
    };

    fullTree.forEach(node => expandMatched(node));
    this.treeUnits = fullTree;
  }

}
