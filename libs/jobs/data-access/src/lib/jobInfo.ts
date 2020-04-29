export interface FullInfo {
  repoName: string;
  jobs: JobInformation;
}

export interface JobInformation {
  [jobName: string]: JobDetails[];
}

export interface JobDetails {
  completed_at: string;
  lengthOfJob: number;
  started_at: string;
}
