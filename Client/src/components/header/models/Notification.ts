export interface ProgressUpdate {
    Id: null | number,
    testplanName: string,
    tests: number;
    passing: number;
    failing: number;
    spec_ran: string[];
    created_date: string;
    status: string;
    error: string;
}

export interface ExecutionContextProps {
    progress: ProgressUpdate;
    setProgress: React.Dispatch<React.SetStateAction<ProgressUpdate>>;
    count: number;
    setcount: React.Dispatch<React.SetStateAction<number>>;
    executions: ProgressUpdate[]; 
    setExecutions: React.Dispatch<React.SetStateAction<ProgressUpdate[]>>;
    filteredResults: ProgressUpdate[];
    setFilteredResults: React.Dispatch<React.SetStateAction<ProgressUpdate[]>>;
    getAllNotifications: () => void;
}

export interface NotificationItem {
    id: number;
    title: string;
    date: string;
    details: {
        summary: string;
        stats: {
            total: number;
            passed: number;
            failed: number;
        };
    };
    icon: string;
    status: string;
    error: string;
}