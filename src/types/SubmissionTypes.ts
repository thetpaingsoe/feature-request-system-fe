interface DropdownOptionType {
    value: string | null | number;
    text: string;    
};

interface CompanyDetailFormData {
  fullName: string; 
  email : string;
  selectedOperationCountry : string;
  selectedDesignation: string;
  full_name: string;
  companyName: string;
  altCompanyName: string;
  selectedTargetCountry: Array<string>;
  jurisdiction_of_operation_id: number;
  numOfShares: number;
  areAllSharedIssued: boolean;
  issuedShares: number;
  selectedValuePerShares: number;
}

interface FormDataStructure {
  company_detail: CompanyDetailFormData;
  shareholders: any; 
  beneficial_owners: any;
  directors: any;
  
}