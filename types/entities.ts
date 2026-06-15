export interface Job {
  id: string | number
  title: string
  company: string
  company_url?: string
  location: string
  salary?: string
  job_type: string
  job_contract: string
  source: string
  date_posted?: string
  created_at: string
  job_url: string
  description?: string
}

export interface Session {
  id: string | number
  name: string
  status: string
  total_jobs: number
  start_run_time: string
  end_run_time?: string
}

export interface BannedCompany {
  id: string | number
  name: string
  created_at?: string
}

export interface BannedKeyword {
  id: string | number
  keyword: string
  created_at?: string
}
