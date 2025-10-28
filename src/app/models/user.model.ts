export interface IResource {
  roleResourceMasterId: string;
  resourceName: string;
  resourceDiscription: string;
  roleId: string;
}
export interface ILoginResponse {
  name: string;
  userName: string;
  userCode: string;
  role: string;
  serviceKey: string;
  apiKey: string;
  officeId: string;
  discom: string;
  resources: IResource[];
}

export enum UserRole {
  Admin = 'admin',
  User = 'user',
  AERole = 'ROLE_AE',
}
