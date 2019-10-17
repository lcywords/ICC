export interface CurrentUser {
  username: string;
  password: string;
  sessionId: string;
  user_name?: string;
  user_id?: string;
  institution_id?: string;
  institution_name?: string;
  id?: string;
  name?: string;
  description?: string;
  sex?: string;
  authority?: string;
  type?: string;
  birth_date?: string;
  image?: string;
  introduce?: string;
  cooperate_type?: string;
  product_list?: string[];
  product_list_str?: string;
  cooperate_charge?: {
    contour: number;
    plan: number;
  };
  rtStationChecked?: boolean;
  rtSuiteChecked?: boolean;
  rtRemoteChecked?: boolean;
  rtCenterChecked?: boolean;
  datuyunChecked?: boolean;
  dtMonitorChecked?: boolean;
  dtBridgeChecked?: boolean;
  deletePatientChecked?: boolean;
  manageUserChecked?: boolean;
  manageInstitutionChecked?: boolean;
}


