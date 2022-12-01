export interface RunningSchedule {
  rid: number;
  schedule: string;
  feedback?: string;
  remark?: string;
  schedule_time: number;
  create_time: number;
  update_time: number;
  display: boolean;
}
