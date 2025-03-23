create type user_auth_type as enum('faculty', 'student', 'admin');

create table user_auth (
  id varchar(16) primary key,
  pass_hash varchar(256) not null,
  user_type user_auth_type not null,
  is2FA varchar(128)
);

create table faculty_details (
  id serial primary key,
  name varchar(128) not null,
  empid varchar(16) unique references user_auth(id)
);

create table section_details (
  id serial primary key,
  proctor integer references faculty_details(id),
  name char(2) not null
);

create table course_details (
  id serial primary key,
  name varchar(128) not null
);

create table course_incharge (
  course_id integer references course_details(id),
  section_id integer references section_details(id),
  incharge integer references faculty_details(id),
  primary key (course_id, section_id)
);

create table student_details (
  id serial primary key,
  rollno varchar(16) unique references user_auth(id),
  section_id integer references section_details(id),
  name varchar(128) not null
);

-- ATTENDENCE

create table attendence_record (
  id serial primary key,
  course_id integer references course_details(id),
  section_id integer references section_details(id),
  record_date date not null, 
  topics text,
  count int not null
);

create table student_attendence (
  record_id integer references attendence_record(id),
  student_id integer references student_details(id),
  present boolean,
  primary key (record_id, student_id)
);

-- EXAMS & MARKS

create table exam_record (
  id serial primary key,
  course_id integer references course_details(id),
  section_id integer references section_details(id),
  max_mark int not null,
  name varchar(64) not null,
  record_date date not null
);

create table student_marks (
  exam_id integer references exam_record(id),
  student_id integer references student_details(id),
  mark int not null,
  primary key (exam_id, student_id)
);

