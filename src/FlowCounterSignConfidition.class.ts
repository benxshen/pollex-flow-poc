import { ConditionalPath, FlowConfidition } from './flow.model';

export class FlowCounterSignConfidition implements FlowConfidition {
    // 會簽邏輯檢核判斷

    run(context: any, conditionalPath: ConditionalPath): string {
        return conditionalPath[context.isCounterSign ? 'YES' : 'NO'];
    }

     possibleFlowPaths(): string[] {
        return ["YES", "NO"];
    }
}