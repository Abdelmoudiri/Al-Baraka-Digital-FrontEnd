import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgentService } from '../../../core/services/agent.service';
import { OperationResponse } from '../../../core/models';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-pending-operations',
  imports: [CommonModule, RouterLink],
  templateUrl: './pending.html',
  styleUrl: './pending.css',
})
export class PendingOperationsComponent implements OnInit {
  operations: OperationResponse[] = [];
  isLoading = true;
  error: string | null = null;
  processingId: number | null = null;
  showConfirmModal = false;
  confirmAction: 'approve' | 'reject' | null = null;
  selectedOperation: OperationResponse | null = null;

  constructor(private agentService: AgentService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadOperations();
  }

  loadOperations(): void {
    this.isLoading = true;
    this.error = null;
    this.agentService.getPendingOperations().pipe(
      catchError(err => {
        console.error('Erreur chargement operations en attente', err);
        this.error = 'Erreur lors du chargement des operations';
        return of([] as OperationResponse[]);
      })
    ).subscribe({
      next: (operations) => {
        this.operations = operations;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openConfirmModal(operation: OperationResponse, action: 'approve' | 'reject'): void {
    this.selectedOperation = operation;
    this.confirmAction = action;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.selectedOperation = null;
    this.confirmAction = null;
  }

  confirmOperation(): void {
    if (!this.selectedOperation || !this.confirmAction) return;

    this.processingId = this.selectedOperation.id;
    const observable = this.confirmAction === 'approve'
      ? this.agentService.approveOperation(this.selectedOperation.id)
      : this.agentService.rejectOperation(this.selectedOperation.id);

    observable.subscribe({
      next: () => {
        this.processingId = null;
        this.closeConfirmModal();
        this.loadOperations();
      },
      error: (err) => {
        this.processingId = null;
        this.error = err.error?.message || `Erreur lors de l'opération`;
        this.closeConfirmModal();
      }
    });
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'DEPOSIT': return 'Dépôt';
      case 'WITHDRAWAL': return 'Retrait';
      case 'TRANSFER': return 'Virement';
      default: return type;
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'DEPOSIT': return 'bg-green-100 text-green-800';
      case 'WITHDRAWAL': return 'bg-orange-100 text-orange-800';
      case 'TRANSFER': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
