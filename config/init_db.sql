drop table if exists statistics;
drop table if exists users;
drop table if exists activities;
drop table if exists activity_groups;

create table users(
    id bigserial primary key
  , name text
  , password text
  , email text
);

create table activity_groups(
    id bigserial primary key
  , name text
  , is_active boolean
);

create table activities(
    id bigserial primary key
  , activity_group_id integer
  , name text
  , is_active boolean
  , foreign key (activity_group_id) references activity_groups(id)
);

create table statistics (
  id bigserial primary key
  , user_id integer
  , activity_id integer
  , date date
  , time time
  , foreign key (user_id) references users(id)
  , foreign key (activity_id) references activities(id)
);