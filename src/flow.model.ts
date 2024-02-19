

export type FlowAction = 'APPLY' | 'REJECT' | 'REVIEW' | 'APPROVE' | 'COMPLETE' | 'CANCEL';
export type FlowRole = 'APPLICANT' | 'APPROVER' | 'REVIEWER' | 'ADMIN';

export type FlowNode = {
    id: string,
    flowAction: FlowAction,
    flowRole: FlowRole,
}

export type ConditionalPath = {[key: string]: string}; // Map<key, value>

export interface FlowConfidition {
    run(context: any, conditionalPath: ConditionalPath): string;
    possibleFlowPaths(): string[];
}

// PreProcess, PostProcess strategy pattern design