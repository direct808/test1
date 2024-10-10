create table if not exists public.item
(
    id    uuid default uuid_generate_v4() not null
        constraint "PK_d3c0c71f23e7adcf952a1d13423"
            primary key,
    name  varchar                         not null,
    price numeric(10, 2)                  not null
);

alter table public.item
    owner to postgres;

create table if not exists public."user"
(
    id      uuid default uuid_generate_v4() not null
        constraint "PK_cace4a159ff9f2512dd42373760"
            primary key,
    name    varchar                         not null,
    balance numeric(10, 2)                  not null
);

alter table public."user"
    owner to postgres;

create table if not exists public.transaction
(
    id       uuid default uuid_generate_v4() not null
        constraint "PK_89eadb93a89810556e1cbcd6ab9"
            primary key,
    amount   numeric(10, 2)                  not null,
    "userId" uuid
        constraint "FK_605baeb040ff0fae995404cea37"
            references public."user",
    "itemId" uuid
        constraint "FK_fae09ef9b1765a71a91475f8ba7"
            references public.item
);
