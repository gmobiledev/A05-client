import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Stepper from 'bs-stepper';

@Component({
  selector: 'app-buy-so',
  templateUrl: './buy-so.component.html',
  styleUrls: ['./buy-so.component.scss']
})
export class BuySoComponent implements OnInit {
  // public
  public contentHeader: object;
  public selectedSim = [];
  public totalPhihoamang: number = 0;
  public totalCuoc: number = 0;
  public totalPrice: number = 0;

  // private
  private horizontalWizardStepper: Stepper;
  private bsStepper;

  /**
   * Horizontal Wizard Stepper Next
   *
   * @param data
   */
  horizontalWizardStepperNext(data) {
    if (data.form.valid === true) {
      this.horizontalWizardStepper.next();
    }
  }
  /**
   * Horizontal Wizard Stepper Previous
   */
  horizontalWizardStepperPrevious() {
    this.horizontalWizardStepper.previous();
  }

  onSelectedSim(selected) {
    if(selected.event.target.checked){
      console.log('checked');
      this.selectedSim.push(selected.item);
      this.totalCuoc += parseInt(selected.item.price);
      this.totalPhihoamang += parseInt(selected.item.price);
    }
    else{
      console.log('unchecked');
      this.selectedSim = this.selectedSim.filter(x => x.sim_no != selected.item.sim_no);
      this.totalCuoc -= parseInt(selected.item.price);
      this.totalPhihoamang -= parseInt(selected.item.price);
    }
    this.totalPrice = this.totalCuoc + this.totalPhihoamang;
    console.log(this.selectedSim);
  }

  /**
   * On Submit
   */
  onSubmit() {
    alert('Submitted!!');
    return false;
  }

  constructor() {}

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Init
   */
  ngOnInit() {
    this.horizontalWizardStepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });

    this.bsStepper = document.querySelectorAll('.bs-stepper');

    // content header
    this.contentHeader = {
      headerTitle: 'Mua số',
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
            name: 'Mua số',
            isLink: false
          }
        ]
      }
    };
  }
}
