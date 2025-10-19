-- profiles 테이블 (supabase.auth.users 와 연동용)
CREATE TABLE IF NOT EXISTS profiles (
id uuid PRIMARY KEY,
email text,
display_name text,
is_admin boolean DEFAULT false,
created_at timestamptz DEFAULT now()
);


create table if not exists problems (
  id bigserial primary key,
  title text not null,
  subject text,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  question text not null,
  answer text not null,
  hint text,
  explanation text,
  created_by uuid references auth.users(id),
  created_at timestamp default timezone('utc'::text, now())
);

create table if not exists attempts (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  problem_id bigint references problems(id) on delete cascade,
  attempt_num int check (attempt_num in (1, 2)),
  user_answer text not null,
  is_correct boolean default false,
  created_at timestamp default timezone('utc'::text, now())
);

-- events (접속/행동 로그)
CREATE TABLE IF NOT EXISTS events (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
user_id uuid REFERENCES profiles(id),
event_type text,
metadata jsonb,
created_at timestamptz DEFAULT now()
);


-- 인덱스
CREATE INDEX IF NOT EXISTS idx_attempts_user_problem ON attempts (user_id, problem_id);

create table if not exists problems (
  id bigserial primary key,
  title text not null,
  question text not null,
  answer text not null,
  hint text,
  solution text,
  subject text,
  difficulty text,
  created_at timestamp default now()
);
