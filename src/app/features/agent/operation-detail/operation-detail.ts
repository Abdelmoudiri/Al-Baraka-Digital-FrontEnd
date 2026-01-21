import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgentService } from '../../../core/services/agent.service';
import { AiValidationService } from '../../../core/services/ai-validation.service';
import { OperationResponse, AiValidationResponse } from '../../../core/models';

@Component({
  selector: 'app-operation-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './operation-detail.html',
  styleUrl: './operation-detail.css',
})
export class OperationDetailComponent implements OnInit {
  operationId: number = 0;
  operation: OperationResponse | null = null;
  aiValidation: AiValidationResponse | null = null;
  isLoading = true;
  isLoadingAi = false;
  isProcessing = false;
  error: string | null = null;
  aiError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private agentService: AgentService,
    private aiValidationService: AiValidationService
  ) { }

  ngOnInit(): void {
    this.operationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOperation();
  }

  loadOperation(): void {
    this.isLoading = true;
    // On utilise getAllOperations et on filtre pour trouver l'opération
    this.agentService.getAllOperations().subscribe({
      next: (operations) => {
        this.operation = operations.find(op => op.id === this.operationId) || null;
        this.isLoading = false;
        if (this.operation) {
          this.loadAiValidation();
        }
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'opération';
        this.isLoading = false;
      }
    });
  }

  loadAiValidation(): void {
    this.isLoadingAi = true;
    this.aiValidationService.getValidationResult(this.operationId).subscribe({
      next: (validation) => {
        this.aiValidation = validation;
        this.isLoadingAi = false;
      },
      error: (err) => {
        this.aiError = 'Analyse IA non disponible';
        this.isLoadingAi = false;
      }
    });
  }

  approveOperation(): void {
    this.isProcessing = true;
    this.agentService.approveOperation(this.operationId).subscribe({
      next: () => {
        this.isProcessing = false;
        this.router.navigate(['/agent/pending']);
      },
      error: (err) => {
        this.isProcessing = false;
        this.error = err.error?.message || 'Erreur lors de l\'approbation';
      }
    });
  }

  rejectOperation(): void {
    this.isProcessing = true;
    this.agentService.rejectOperation(this.operationId).subscribe({
      next: () => {
        this.isProcessing = false;
        this.router.navigate(['/agent/pending']);
      },
      error: (err) => {
        this.isProcessing = false;
        this.error = err.error?.message || 'Erreur lors du rejet';
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'APPROVED': return 'Approuvé';
      case 'REJECTED': return 'Rejeté';
      case 'COMPLETED': return 'Terminé';
      default: return status;
    }
  }

  getConfidenceClass(score: number): string {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  }

  getDecisionClass(decision: string): string {
    if (decision.toLowerCase().includes('approve') || decision.toLowerCase().includes('accept')) {
      return 'bg-green-100 text-green-800';
    }
    if (decision.toLowerCase().includes('reject') || decision.toLowerCase().includes('deny')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  }
}
