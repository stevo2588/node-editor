CREATE TABLE `user` (
  `id` bigint,
  `username` string,
  `email` string,
  `enabled` boolean
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `user_iap` (
  `id` bigint,
  `user_id` bigint,
  `iap_item_id` int
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `user_tracking` (
  `id` bigint,
  `user_id` bigint,
  `tracked_user_id` bigint
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `sport_event` (
  `id` bigint,
  `league_id` int
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `sport_league` (
  `id` bigint,
  `name` string
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

