/**
 * user can change username
 */
export class User {
  id: number;           // start at 0
  username: string;
  password: string;
  roleId: number;
}

/**
 * roleId: 0 = admin, 1 = employeeLevel1, 2 = employeeLevel2,...
 * an upper-leveled user can access data of a lower-leveled users
 */
export class Role {
  id: number;
  name: string;
}
