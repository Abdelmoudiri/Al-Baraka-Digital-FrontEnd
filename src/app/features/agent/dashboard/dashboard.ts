import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';
import { AgentService } from '../../../core/services/agent.service';
import { OperationResponse } from '../../../core/models';
import { forkJoin, of, catchError } from 'rxjs';

@Component({
  selector: 'app-agent-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class AgentDashboard implements OnInit {
  currentUser: User | null = null;
  pendingOperations: OperationResponse[] = [];
  allOperations: OperationResponse[] = [];
  isLoading = true;
  error: string | null = null;

  stats = {
    pendingCount: 0,
    todayApproved: 0,
    todayRejected: 0,
    totalToday: 0
  };

  constructor(
    private authService: AuthService,
    private agentService: AgentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;
    
    forkJoin({
      pending: this.agentService.getPendingOperations().pipe(
        catchError(() => of([] as OperationResponse[]))
      ),
      all: this.agentService.getAllOperations().pipe(
        catchError(() => of([] as OperationResponse[]))
      )
    }).subscribe({
      next: (result) => {
        this.pendingOperations = result.pending;
        this.allOperations = result.all;
        this.stats.pendingCount = result.pending.length;
        this.calculateStats();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Erreur lors du chargement';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats(): void {
    const today = new Date().toDateString();
    this.stats.todayApproved = this.allOperations.filter(
      op => op.status === 'APPROVED' && op.executedAt && new Date(op.executedAt).toDateString() === today
    ).length;
    this.stats.todayRejected = this.allOperations.filter(
      op => op.status === 'REJECTED' && op.executedAt && new Date(op.executedAt).toDateString() === today
    ).length;
    this.stats.totalToday = this.stats.todayApproved + this.stats.todayRejected;
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'DEPOSIT': return 'Depot';
      case 'WITHDRAWAL': return 'Retrait';
      case 'TRANSFER': return 'Virement';
      default: return type;
    }
  }
}
