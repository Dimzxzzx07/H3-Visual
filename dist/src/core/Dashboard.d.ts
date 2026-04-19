import { Metrics, DashboardConfig } from "../types";
export declare class Dashboard {
    private refreshRate;
    private theme;
    private metrics;
    private screen;
    private grid;
    private widgets;
    private currentData;
    private interval;
    constructor(config: DashboardConfig);
    render(): void;
    update(metrics: Metrics): void;
    destroy(): void;
}
//# sourceMappingURL=Dashboard.d.ts.map