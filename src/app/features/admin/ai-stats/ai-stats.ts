import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AiValidationService } from '../../../core/services/ai-validation.service';
import { AiStatistics } from '../../../core/models';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-ai-stats',
  imports: [CommonModule, RouterLink],
  templateUrl: './ai-stats.html',
  styleUrl: './ai-stats.css',
})
export class AiStatsComponent implements OnInit {
  stats: AiStatistics | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private aiService: AiValidationService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.error = null;
    this.aiService.getStatistics().pipe(
      catchError(err => {
        console.error('Erreur chargement stats IA', err);
        this.error = 'Erreur lors du chargement des statistiques IA';
        return of(null as AiStatistics | null);
      })
    ).subscribe({
      next: (stats) => {
        this.stats = stats;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getApprovalRate(): number {
    if (!this.stats || this.stats.totalValidations === 0) return 0;
    return (this.stats.approvedCount / this.stats.totalValidations) * 100;
  }

  getRejectionRate(): number {
    if (!this.stats || this.stats.totalValidations === 0) return 0;
    return (this.stats.rejectedCount / this.stats.totalValidations) * 100;
  }

  getPendingRate(): number {
    if (!this.stats || this.stats.totalValidations === 0) return 0;
    const pendingCount = this.stats.totalValidations - this.stats.approvedCount - this.stats.rejectedCount;
    return (pendingCount / this.stats.totalValidations) * 100;
  }
}
