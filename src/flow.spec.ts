
import { FlowCounterSignConfidition } from './FlowCounterSignConfidition.class';
import { testFlowConfig } from './flow.config';
import { FlowNode } from './flow.model';

class FlowService {

    rejectToFlow(data: TestData): FlowNode | null {
        const currFlowNodeConfig = testFlowConfig.flowNodeConfigs[data.currentFlow];
        if (currFlowNodeConfig.rejectFlowId) {
            return this.getFlowNode(currFlowNodeConfig.rejectFlowId);
        }
        return null;
    }

    processFlow(data: TestData) {
        // RoleResolver impl
        // preProcess: 檢核流程資料/寫log紀錄...，沒有問題後，寫簽核紀錄，並繼續 nextFlow
        // NOTE: 會簽流程有可能不會直接進入下一個流程

        // if preProcess return true, then call nextFlow
        const nextFlow = this.nextFlow(data);
        if (nextFlow) {
            data.currentFlow = nextFlow.id;

            // autoSignProcess: 自動連續簽核
        }

        // postProcess: 發信通知/寫log紀錄...

    }

    nextFlow(data: TestData): FlowNode | null {
        const currFlowNodeConfig = testFlowConfig.flowNodeConfigs[data.currentFlow];

        if (currFlowNodeConfig.nextFlowType === 'FLOW_NODE') {
            return this.getFlowNode(currFlowNodeConfig.nextFlowValue);

        } else if (currFlowNodeConfig.nextFlowType === 'FLOW_CONDITIONAL') {
            if (currFlowNodeConfig.nextFlowValue === 'FlowCounterSignConfidition') {
                const nextFlowId = new FlowCounterSignConfidition().run(data, currFlowNodeConfig.conditionalPath!);
                return this.getFlowNode(nextFlowId);
            }
            
            throw new Error(`Invalid FLOW_CONDITIONAL type: '${currFlowNodeConfig.nextFlowValue}'`);

        } else if (currFlowNodeConfig.nextFlowType === 'FLOW_END') {
            console.info('流程結束');
        }

        return null;
    }

    getFlowNode(flowNodeId: string): FlowNode {
        const flowNodeConfig = testFlowConfig.flowNodeConfigs[flowNodeId];
        return {
            id: flowNodeId,
            flowAction: flowNodeConfig.flowAction,
            flowRole: flowNodeConfig.flowRole,
        };
    }

}

const data: TestData = {
    currentFlow: 'flow-node-1',
    isCounterSign: false,
};

const flowService = new FlowService();
let nextFlow = flowService.nextFlow(data);
console.log(nextFlow);

data.currentFlow = nextFlow?.id || '';
nextFlow = flowService.nextFlow(data);
console.log(nextFlow);

data.currentFlow = nextFlow?.id || '';
nextFlow = flowService.nextFlow(data);
console.log(nextFlow);


const testRejectData: TestData = {
    currentFlow: 'flow-node-2_2',
    isCounterSign: false,
};
const rejectToFlow = flowService.rejectToFlow(testRejectData);
console.log(rejectToFlow);


type TestData = {
    currentFlow: string,
    isCounterSign: boolean,
}