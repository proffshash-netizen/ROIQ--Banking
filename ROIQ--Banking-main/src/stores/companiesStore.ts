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
  ebitda?: string
  debt?: string
  cash?: string
  profitability?: string
  liquidity?: string
  dscr?: string
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
    ebitda: "₹32,800 Cr",
    debt: "₹85,000 Cr",
    cash: "₹28,000 Cr",
    profitability: "13.5% Margin",
    liquidity: "1.45x Current Ratio",
    dscr: "1.82x DSCR",
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
    ebitda: "₹1,15,000 Cr",
    debt: "₹1,28,000 Cr",
    cash: "₹98,000 Cr",
    profitability: "17.6% Margin",
    liquidity: "1.95x Current Ratio",
    dscr: "2.45x DSCR",
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
    ebitda: "₹18,200 Cr",
    debt: "₹2,40,000 Cr",
    cash: "₹12,000 Cr",
    profitability: "33.1% Margin",
    liquidity: "2.10x Current Ratio",
    dscr: "1.65x DSCR",
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
    ebitda: "₹19,000 Cr",
    debt: "₹1,42,000 Cr",
    cash: "₹14,500 Cr",
    profitability: "8.3% Margin",
    liquidity: "1.05x Current Ratio",
    dscr: "1.15x DSCR",
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
    ebitda: "₹18,500 Cr",
    debt: "₹1,25,000 Cr",
    cash: "₹9,800 Cr",
    profitability: "12.6% Margin",
    liquidity: "0.85x Current Ratio",
    dscr: "0.88x DSCR",
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
    ebitda: "₹1,78,000 Cr",
    debt: "₹3,10,000 Cr",
    cash: "₹1,52,000 Cr",
    profitability: "18.3% Margin",
    liquidity: "1.88x Current Ratio",
    dscr: "2.75x DSCR",
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
    ebitda: "₹82,000 Cr",
    debt: "₹24,50,000 Cr",
    cash: "₹68,000 Cr",
    profitability: "35.7% Margin",
    liquidity: "2.45x Current Ratio",
    dscr: "1.95x DSCR",
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
    ebitda: "₹21,000 Cr",
    debt: "₹74,000 Cr",
    cash: "₹17,500 Cr",
    profitability: "15.3% Margin",
    liquidity: "1.35x Current Ratio",
    dscr: "1.72x DSCR",
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
    ebitda: "₹950 Cr",
    debt: "₹3,800 Cr",
    cash: "₹650 Cr",
    profitability: "11.5% Margin",
    liquidity: "0.92x Current Ratio",
    dscr: "0.72x DSCR",
  },
]

import { api } from "@/lib/api"

interface CompaniesState {
  companies: Company[]
  selectedCompanyId: number
  loading: boolean
  error: string | null
  selectCompany: (id: number) => void
  fetchCompanies: () => Promise<void>
}

export const useCompaniesStore = create<CompaniesState>((set) => ({
  companies: staticCompanies,
  selectedCompanyId: 1, // default to Tata Steel
  loading: false,
  error: null,
  selectCompany: (id) => set({ selectedCompanyId: id }),
  fetchCompanies: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get('/companies')
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        set({ companies: res.data.data, loading: false })
      } else {
        set({ loading: false })
      }
    } catch {
      // Fallback gracefully to predefined portfolio if offline
      set({ loading: false })
    }
  },
}))
