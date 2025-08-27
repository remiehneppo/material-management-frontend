import type { BaseEntity } from './common';

// Material types
export interface Material extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  unit: string;
  category: MaterialCategory;
  specifications?: Record<string, string>;
  isActive: boolean;
}

export interface MaterialCategory extends BaseEntity {
  name: string;
  description?: string;
  parentId?: string;
  children?: MaterialCategory[];
}

// Budget material types
export interface BudgetMaterial extends BaseEntity {
  projectId: string;
  materialId: string;
  material: Material;
  budgetQuantity: number;
  unitPrice: number;
  totalBudgetAmount: number;
  notes?: string;
  status: BudgetStatus;
}

export interface BudgetProject extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  startDate: string;
  endDate?: string;
  totalBudget: number;
  status: ProjectStatus;
  materials: BudgetMaterial[];
}

// Actual material output types
export interface MaterialOutput extends BaseEntity {
  projectId: string;
  materialId: string;
  material: Material;
  outputQuantity: number;
  unitPrice: number;
  totalAmount: number;
  outputDate: string;
  recipientName: string;
  recipientPosition?: string;
  notes?: string;
  status: OutputStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface MaterialOutputRequest extends BaseEntity {
  projectId: string;
  requestedBy: string;
  requestedAt: string;
  requestReason: string;
  items: MaterialOutputRequestItem[];
  status: RequestStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface MaterialOutputRequestItem extends BaseEntity {
  requestId: string;
  materialId: string;
  material: Material;
  requestedQuantity: number;
  approvedQuantity?: number;
  notes?: string;
}

// Enums
export const BudgetStatus = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED'
} as const;

export type BudgetStatus = typeof BudgetStatus[keyof typeof BudgetStatus];

export const ProjectStatus = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export const OutputStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;

export type OutputStatus = typeof OutputStatus[keyof typeof OutputStatus];

export const RequestStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PARTIALLY_DELIVERED: 'PARTIALLY_DELIVERED',
  COMPLETED: 'COMPLETED'
} as const;

export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

// Create/Update DTOs
export interface CreateMaterialDTO {
  code: string;
  name: string;
  description?: string;
  unit: string;
  categoryId: string;
  specifications?: Record<string, string>;
}

export interface UpdateMaterialDTO extends Partial<CreateMaterialDTO> {
  isActive?: boolean;
}

export interface CreateBudgetMaterialDTO {
  projectId: string;
  materialId: string;
  budgetQuantity: number;
  unitPrice: number;
  notes?: string;
}

export interface UpdateBudgetMaterialDTO extends Partial<CreateBudgetMaterialDTO> {
  status?: BudgetStatus;
}

export interface CreateMaterialOutputDTO {
  projectId: string;
  materialId: string;
  outputQuantity: number;
  unitPrice: number;
  outputDate: string;
  recipientName: string;
  recipientPosition?: string;
  notes?: string;
}

export interface UpdateMaterialOutputDTO extends Partial<CreateMaterialOutputDTO> {
  status?: OutputStatus;
  approvedBy?: string;
}
