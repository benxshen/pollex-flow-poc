import { ConditionalPath, FlowAction, FlowRole } from './flow.model';

type FlowConfig = {
    flowId: string,
    startFlow: string,
    version: number,
    versionEffectDate: Date,
    flowNodeConfigs: FlowNodeConfigs
}

type FlowNodeConfigs = { [flowNodeId: string]: FlowNodeConfig };

type FlowNodeConfig = {
    flowAction: FlowAction,
    flowRole: FlowRole,
    nextFlowType: NextFlowType,
    nextFlowValue: string,
    conditionalPath?: ConditionalPath,
    rejectFlowId?: string,
};

type NextFlowType = 'FLOW_NODE' | 'FLOW_END' | 'FLOW_CONDITIONAL';

// ========================================

// POC 測試流程設定
/*
 NOTE:
 1. 若流程設定有異動，新版本要視情況考慮向下相容的流程處理，確保在途件能在新流程以舊資料正常簽核
 2. 依據上述狀況，需求單所存的流程版本，可能需要有兩個欄位: origFlowVersion, newFlowVersion
 3. 
 */
export const testFlowConfig: FlowConfig = {
    flowId: "f1",
    startFlow: "flow-node-1",
    version: 1,
    versionEffectDate: new Date('2024-01-01'),
    flowNodeConfigs: {
        "flow-node-1": {
            flowAction: 'APPLY',
            flowRole: 'APPLICANT',
            nextFlowType: 'FLOW_NODE',
            nextFlowValue: 'flow-node-2_1',
        },
        "flow-node-2_1": {
            flowAction: 'REVIEW',
            flowRole: 'REVIEWER',
            nextFlowType: 'FLOW_CONDITIONAL',
            nextFlowValue: 'FlowCounterSignConfidition',
            conditionalPath: {
                "YES": "flow-node-2_2",
                "NO": "flow-node-99"
            },
            rejectFlowId: "flow-node-1",
        },
        "flow-node-2_2": {
            flowAction: 'REVIEW',
            flowRole: 'APPROVER',
            nextFlowType: 'FLOW_NODE',
            nextFlowValue: 'flow-node-99',
            rejectFlowId: "flow-node-1",
        },
        "flow-node-99": {
            flowAction: 'COMPLETE',
            flowRole: 'APPROVER',
            nextFlowType: 'FLOW_END',
            nextFlowValue: 'END',
        },
    }
}

const taskTypeFlowMapping = {
    "需求母單": 'f1',
    "一般作業子單": 'f2'
}





