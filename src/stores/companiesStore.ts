import { create } from 'zustand'

export interface Company {
  id: number
  name: string
  sector: string
  country: string
  founded: number
  revenue: string
  employees: string
  creditScore: number
  riskLevel: "low" | "medium" | "high" | "critical"
  loanExposure: string
  status: "processing" | "completed" | "flagged" | "pending"
  module: string
  progress: number
  eta: string
  lastAnalysis: string
  ceo: string
  hq: string
}

export const staticCompanies: Company[] = [
  {
    id: 1,
    name: "Tata Steel Ltd.",
    sector: "Metals & Mining",
    country: "India",
    founded: 1907,
    revenue: "₹2,43,353 Cr",
    employees: "~76,000",
    creditScore: 68,
    riskLevel: "medium",
    loanExposure: "$420M",
    status: "processing",
    module: "Financial Analytics",
    progress: 72,
    eta: "~3 min",
    lastAnalysis: "In Progress",
    ceo: "T. V. Narendran",
    hq: "Mumbai, India",
  },
  {
    id: 2,
    name: "ONGC Ltd.",
    sector: "Oil & Gas",
    country: "India",
    founded: 1956,
    revenue: "₹6,53,020 Cr",
    employees: "~31,000",
    creditScore: 75,
    riskLevel: "low",
    loanExposure: "$310M",
    status: "processing",
    module: "Financial Analytics",
    progress: 41,
    eta: "~8 min",
    lastAnalysis: "In Progress",
    ceo: "Arun Kumar Singh",
    hq: "New Delhi, India",
  },
  {
    id: 3,
    name: "Bajaj Finance Ltd.",
    sector: "NBFC / Financial Services",
    country: "India",
    founded: 1987,
    revenue: "₹54,973 Cr",
    employees: "~42,000",
    creditScore: 81,
    riskLevel: "low",
    loanExposure: "$185M",
    status: "processing",
    module: "Loan Recommendation",
    progress: 15,
    eta: "~19 min",
    lastAnalysis: "In Progress",
    ceo: "Rajeev Jain",
    hq: "Pune, India",
  },
  {
    id: 4,
    name: "Adani Enterprises Ltd.",
    sector: "Conglomerate / Infrastructure",
    country: "India",
    founded: 1988,
    revenue: "₹2,30,000 Cr",
    employees: "~25,000",
    creditScore: 57,
    riskLevel: "high",
    loanExposure: "$870M",
    status: "completed",
    module: "Credit Risk",
    progress: 100,
    eta: "Done",
    lastAnalysis: "2 min ago",
    ceo: "Gautam Adani",
    hq: "Ahmedabad, India",
  },
  {
    id: 5,
    name: "Vedanta Resources PLC",
    sector: "Diversified Metals",
    country: "UK / India",
    founded: 1976,
    revenue: "₹1,47,000 Cr",
    employees: "~65,000",
    creditScore: 42,
    riskLevel: "critical",
    loanExposure: "$1.2B",
    status: "flagged",
    module: "Credit Risk",
    progress: 100,
    eta: "Done",
    lastAnalysis: "11 min ago",
    ceo: "Sunil Duggal",
    hq: "London, UK",
  },
  {
    id: 6,
    name: "Reliance Industries Ltd.",
    sector: "Energy / Telecom / Retail",
    country: "India",
    founded: 1966,
    revenue: "₹9,74,864 Cr",
    employees: "~2,36,000",
    creditScore: 88,
    riskLevel: "low",
    loanExposure: "$640M",
    status: "completed",
    module: "Executive Report",
    progress: 100,
    eta: "Done",
    lastAnalysis: "34 min ago",
    ceo: "Mukesh Ambani",
    hq: "Mumbai, India",
  },
  {
    id: 7,
    name: "HDFC Bank Ltd.",
    sector: "Banking",
    country: "India",
    founded: 1994,
    revenue: "₹2,29,397 Cr",
    employees: "~1,77,000",
    creditScore: 91,
    riskLevel: "low",
    loanExposure: "$520M",
    status: "completed",
    module: "Financial Analytics",
    progress: 100,
    eta: "Done",
    lastAnalysis: "3 hr ago",
    ceo: "Sashidhar Jagdishan",
    hq: "Mumbai, India",
  },
  {
    id: 8,
    name: "Mahindra & Mahindra Ltd.",
    sector: "Automotive / Agri",
    country: "India",
    founded: 1945,
    revenue: "₹1,37,048 Cr",
    employees: "~80,000",
    creditScore: 73,
    riskLevel: "medium",
    loanExposure: "$290M",
    status: "pending",
    module: "Loan Recommendation",
    progress: 0,
    eta: "Queued",
    lastAnalysis: "2 hr ago",
    ceo: "Anish Shah",
    hq: "Mumbai, India",
  },
  {
    id: 9,
    name: "Zee Entertainment Ltd.",
    sector: "Media & Entertainment",
    country: "India",
    founded: 1991,
    revenue: "₹8,241 Cr",
    employees: "~4,000",
    creditScore: 38,
    riskLevel: "critical",
    loanExposure: "$95M",
    status: "flagged",
    module: "Credit Risk",
    progress: 100,
    eta: "Done",
    lastAnalysis: "1 hr ago",
    ceo: "Punit Goenka",
    hq: "Mumbai, India",
  },
]

interface CompaniesState {
  companies: Company[]
  selectedCompanyId: number
  selectCompany: (id: number) => void
}

export const useCompaniesStore = create<CompaniesState>((set) => ({
  companies: staticCompanies,
  selectedCompanyId: 1, // default to Tata Steel
  selectCompany: (id) => set({ selectedCompanyId: id }),
}))
