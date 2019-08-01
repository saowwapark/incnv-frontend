import { User } from '../user';

export const ALL_USERS: User[] = [
  {
    id: 1,
    username: 'mew',
    password: '123456',
    roleId: 1 // mew = admin
  },
  {
    id: 2,
    username: 'kan',
    password: '123456',
    roleId: 2 // kan = userlevel1
  },
  {
    id: 3,
    username: 'note',
    password: '123456',
    roleId: 3 // note = userlevel2
  }
];
