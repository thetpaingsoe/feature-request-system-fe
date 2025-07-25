import { CompanyDesignation } from "./CompanyDesignationTypes";
import { Country } from "./CountryTypes";
import { ShareValue } from "./ShareValueTypes";

export interface DropdownOptionType {
    id: string | null | number;
    value: string;    
};

export type Shareholder = {
  id : number;
  name: string;
  email: string;
  percentage: number;
};

type BeneficialOwner = {
  name: string;
  relationship: string;
};

type Director = {
  name: string;
  position: string;
  email: string;
};

// Type for a single Submission item
export type Submission = {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  company_name: string;
  alternative_company_name: string;
  company_designation_id: number;
  company_designation: CompanyDesignation;

  jurisdiction_of_operation_id: number;
  jurisdiction_of_operation: Country;

  target_jurisdictions: number[];
  target_jurisdiction_names: Country[]; // from accessor

  number_of_shares: number;
  are_all_shares_issued: boolean;
  number_of_issued_shares: number;

  share_value_id: number;
  share_value: ShareValue;

  shareholders: Shareholder[]; 
  beneficial_owners: BeneficialOwner[];
  directors: Director[];

  status: 'pending' | 'approved' | 'rejected' | 'reviewing' | 'feedback';  

  submitted_at: string;
  created_at: string;
  updated_at: string;
};

export interface FormDataStructure {
  company_detail: Submission;
  shareholders: any; 
  beneficial_owners: any;
  directors: any;
  
}