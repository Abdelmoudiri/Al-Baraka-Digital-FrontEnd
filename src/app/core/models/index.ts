// ==================== ENUMS ====================

export type OperationType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'DEPOT' | 'RETRAIT' | 'VIREMENT';

export type OperationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export type UserRole = 'CLIENT' | 'AGENT_BANCAIRE' | 'ADMIN';

// ==================== REQUESTS ====================

export interface OperationRequest {
    amount: number; // minimum 0.01
}

export interface TransferRequest {
    destinationAccountNumber: string;
    amount: number; // minimum 0.01
}

// ==================== RESPONSES ====================

export interface OperationResponse {
    id: number;
    type: OperationType;
    amount: number;
    status: OperationStatus;
    createdAt: string; // ISO DateTime
    executedAt: string | null;
    sourceAccountNumber: string;
    destinationAccountNumber: string | null;
    clientFullName?: string;
    motif?: string;
}

export interface ClientProfile {
    userId: number;
    email: string;
    fullName: string;
    accountNumber: string;
    balance: number;
    active: boolean;
}

export interface User {
    id: number;
    email: string;
    fullName: string;
    role: UserRole;
    active: boolean;
    createdAt: string;
}

export interface AiValidationResponse {
    id: number;
    operationId: number;
    decision: string;
    confidenceScore: number;
    analysisSummary: string;
    extractedAmount: number;
    documentQualityScore: number;
    riskFactors: string;
    analyzedAt: string;
    modelUsed: string;
    processingTimeMs: number;
}

// ==================== STATISTICS ====================

export interface AiStatistics {
    totalValidations: number;
    approvedCount: number;
    rejectedCount: number;
    averageConfidenceScore: number;
}

// ==================== DASHBOARD STATS ====================

export interface DashboardStats {
    totalUsers?: number;
    activeUsers?: number;
    totalOperations?: number;
    pendingOperations?: number;
    operationsToday?: number;
    approvedToday?: number;
    rejectedToday?: number;
}
