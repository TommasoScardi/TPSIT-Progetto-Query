create database queryProject;
use queryProject;

create table mot --means of trasportation
(
    id int auto_increment,
    name varchar(255) not null,
    img_url varchar(255),
    primary key (id)
);

create table emissions
(
    id_mot int,
    g_co2_km float not null,
    primary key (id_mot),
    foreign key (id_mot) references mot(id)
);

create table costs
(
    id_mot int,
    taxes float,
    fuel char(1), --Elettrico, Benzina, Diesel, Gas, Metano
    fuel_consumption_unit varchar(2), --Litro, MetroCubo, Kilowatt
    kilometer_per_unit float,
    subscription float,
    ticket float,
    primary key (id_mot),
    foreign key (id_mot) references mot(id)
);

create table trip --use of diffrent means of trasportation in one travel
(
    id int auto_increment,
    name varchar(255),
    primary key (id)
);

create table trip_mot --associate to a combo all the means of trasportation with a many to many relationship
(
    id_trip int not null,
    id_mot int not null,
    km_traveled float not null,
    foreign key (id_trip) references trip(id),
    foreign key (id_mot) references mot(id)
);