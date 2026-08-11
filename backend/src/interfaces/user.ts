interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  isConfirmEmail: boolean;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

export default IUser;
