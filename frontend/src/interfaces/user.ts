interface IUser {
  _id?: string;
  name: string;
  email: string;
  /** Only sent when registering; never returned for other users. */
  password?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default IUser;
