import { Model } from 'objection';


export class User extends Model {
  public static readonly tableName = 'user';
  id: number;
  username: string;
  email: string;
  enabled: boolean;

  iaps?: UserIap[];
  tracking?: User[];
  trackers?: User[];

  static get relationMappings() {
    return {
      iaps: {
        relation: Model.HasManyRelation,
        modelClass: UserIap,
        join: { from: `${User.tableName}.id`, to: `${UserIap.tableName}.user_id` },
      },
      tracking: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: `${User.tableName}.id`,
          through: {
            from: `${UserTracking.tableName}.user_id`,
            to: `${UserTracking.tableName}.tracked_user_id`,
          },
          to: `${User.tableName}.id`,
        },
      },
      trackers: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: `${User.tableName}.id`,
          through: {
            from: `${UserTracking.tableName}.tracked_user_id`,
            to: `${UserTracking.tableName}.user_id`,
          },
          to: `${User.tableName}.id`,
        },
      },
    };
  }
}

export class UserIap extends Model {
  public static readonly tableName = 'user_iap';
  id: number;
  user_id: number;
  iap_item_id: number;
}

export class UserTracking extends Model {
  public static readonly tableName = 'user_tracking';
  id: number;
  user_id: number;
  tracked_user_id: number;
}

export class SportEvent extends Model {
  public static readonly tableName = 'sport_event';
  id: number;
  league_id: number;
}
