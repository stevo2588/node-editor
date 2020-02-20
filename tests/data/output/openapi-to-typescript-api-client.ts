
export class User {
  id?: number;
  username?: string;
  email?: string;
}

export class UsersUserIdGetRequest  {
  parameters: {
    userId: number;
  };
}

export class UsersMeTrackingGetRequest  {
}

export class UsersMeTrackingPostRequest  {
  userId: number;
}

export interface Response {
  description: string;
}

export class UsersUserIdGet200 extends User implements Response {
  description = 'OK';
}

export class UsersUserIdGet400 implements Response {
  description = 'Invalid id supplied';
}

export class UsersUserIdGet404 implements Response {
  description = 'User not found';
}

export class UsersMeTrackingGet200 implements Response {
  description = 'OK';
  tracking: User[];
  recentlyTracked?: User[];
}

export class UsersMeTrackingGet400 implements Response {
  description = 'Invalid id supplied';
}

export class UsersMeTrackingGet404 implements Response {
  description = 'User not found';
}

export class UsersMeTrackingPost200 implements Response {
  description = 'OK';
}

export class UsersMeTrackingPost400 implements Response {
  description = 'Invalid id supplied';
}

export class UsersMeTrackingPost404 implements Response {
  description = 'User not found';
}

export const UsersUserIdGet = async (req: UsersUserIdGetRequest): Promise<UsersUserIdGet200|UsersUserIdGet400|UsersUserIdGet404> => {
  try {
    const res = await fetch(`${apiRoot}/users/${req.parameters.userId}`, {
      method: 'GET',
    });
    const json = await res.json();
    return json as UsersUserIdGet200;
  } catch (err) {
    throw new Error("Error");
  }
};

export const UsersMeTrackingGet = async (req: UsersMeTrackingGetRequest): Promise<UsersMeTrackingGet200|UsersMeTrackingGet400|UsersMeTrackingGet404> => {
  try {
    const res = await fetch(`${apiRoot}/users/me/tracking`, {
      method: 'GET',
    });
    const json = await res.json();
    return json as UsersMeTrackingGet200;
  } catch (err) {
    throw new Error("Error");
  }
};

export const UsersMeTrackingPost = async (req: UsersMeTrackingPostRequest): Promise<UsersMeTrackingPost200|UsersMeTrackingPost400|UsersMeTrackingPost404> => {
  try {
    const res = await fetch(`${apiRoot}/users/me/tracking`, {
      method: 'POST',
      body: JSON.stringify(req),
    });
    const json = await res.json();
    return json as UsersMeTrackingPost200;
  } catch (err) {
    throw new Error("Error");
  }
};
