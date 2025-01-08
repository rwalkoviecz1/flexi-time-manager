import { createContext, useContext, useState, ReactNode } from "react";
import { TimeEntry, WorkdayConfigData } from "@/types/timesheet";

interface TimesheetContextType {
  timeEntries: TimeEntry[];
  setTimeEntries: (entries: TimeEntry[]) => void;
  workdayConfig: WorkdayConfigData;
  setWorkdayConfig: (config: WorkdayConfigData) => void;
  dashboardData: {
    totalHours: string;
    overtimeHours: string;
    overtimeThisWeek: string;
    bankHours: string;
    absences: number;
  };
  setDashboardData: (data: {
    totalHours: string;
    overtimeHours: string;
    overtimeThisWeek: string;
    bankHours: string;
    absences: number;
  }) => void;
}

const TimesheetContext = createContext<TimesheetContextType | undefined>(undefined);

export function TimesheetProvider({ children }: { children: ReactNode }) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [workdayConfig, setWorkdayConfig] = useState<WorkdayConfigData>(() => {
    const saved = localStorage.getItem('workdayConfig');
    return saved ? JSON.parse(saved) : {
      startTime: "08:00",
      endTime: "17:00",
      breakStart: "12:00",
      breakEnd: "13:00",
      workDays: ["SEG", "TER", "QUA", "QUI", "SEX"],
      salary: 0,
      workHoursPerDay: 8,
      periodStart: "",
      periodEnd: ""
    };
  });
  const [dashboardData, setDashboardData] = useState({
    totalHours: "176h",
    overtimeHours: "8h",
    overtimeThisWeek: "+2h",
    bankHours: "+12h",
    absences: 1
  });

  return (
    <TimesheetContext.Provider value={{
      timeEntries,
      setTimeEntries,
      workdayConfig,
      setWorkdayConfig,
      dashboardData,
      setDashboardData
    }}>
      {children}
    </TimesheetContext.Provider>
  );
}

export function useTimesheet() {
  const context = useContext(TimesheetContext);
  if (context === undefined) {
    throw new Error('useTimesheet must be used within a TimesheetProvider');
  }
  return context;
}