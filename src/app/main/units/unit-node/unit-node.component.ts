import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-unit-node',
  templateUrl: './unit-node.component.html',
  styleUrls: ['./unit-node.component.scss']
})
export class UnitNodeComponent {
  @Input() node: any;
  @Output() editUnitEvent = new EventEmitter<any>();
  @Output() deleteUnitEvent = new EventEmitter<any>();
  @Output() addChildEvent = new EventEmitter<any>();
  @Input() menuManager: any;

  expanded: boolean = false;
  showMenu: boolean = false;
  menuOpen = false;
  static activeMenu: UnitNodeComponent | null = null;

  ngOnChanges(): void {
    this.expanded = this.node.expanded;
  }
  toggle(): void {
    this.expanded = !this.expanded;
    this.node.expanded = this.expanded;  }

  toggleMenu(): void {
    if (UnitNodeComponent.activeMenu && UnitNodeComponent.activeMenu !== this) {
      UnitNodeComponent.activeMenu.closeMenu();
    }
    this.showMenu = !this.showMenu;
    UnitNodeComponent.activeMenu = this.showMenu ? this : null;
  }

  editUnit(): void {
    this.editUnitEvent.emit(this.node);
    this.showMenu = false;
  }

  deleteUnit(): void {
    this.deleteUnitEvent.emit(this.node);
    this.showMenu = false;
  }

  addChild(): void {
    this.addChildEvent.emit(this.node);
    this.showMenu = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.unit-menu-container')) {
      this.showMenu = false;
    }
  }

  closeMenu(): void {
    this.showMenu = false;
  }
}