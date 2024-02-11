import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { resetGamestate } from '../../../helpers';

@Component({
  selector: 'sw-modal-pause',
  templateUrl: './modal-pause.component.html',
  styleUrl: './modal-pause.component.scss',
})
export class ModalPauseComponent {
  private router = inject(Router);
  activeModal = inject(NgbActiveModal);

  private closeModal() {
    this.activeModal.close();
  }

  continue() {
    this.closeModal();
  }

  newRun() {
    this.closeModal();
    resetGamestate();
    this.router.navigate(['/new-run']);
  }

  mainMenu() {
    this.closeModal();
    this.router.navigate(['/home']);
  }
}
