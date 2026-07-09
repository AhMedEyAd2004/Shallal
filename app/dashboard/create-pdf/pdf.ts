export interface CompanySettings {
  companyName: string;
  logo: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
}

export interface ClientInfo {
  name: string;
  phone: string;
  email: string;
}

export interface DocumentData {
  title: string;
  client: ClientInfo;
  content: string; // Fallback legacy support
  pages?: string[][]; // Updated: Array of pages, where each page contains an array of blocks
  tags: string[]; // Free-form labels, stored in DB for search/filtering
}
