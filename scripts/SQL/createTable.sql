SET TIMEZONE=-2;

DROP TABLE IF EXISTS Country CASCADE;
CREATE TABLE Country(
    name varchar,
    constraint countryPK PRIMARY KEY (name)
);

DROP TABLE IF EXISTS City CASCADE;
CREATE TABLE City(
    id integer GENERATED ALWAYS AS IDENTITY,
    name varchar not null,
    zipCode varchar not null,
    country varchar not null,
    constraint countryCityFK FOREIGN KEY (country) REFERENCES Country (name),
    UNIQUE (country, name),
    constraint cityPK PRIMARY KEY (id)
);

DROP TABLE IF EXISTS Street CASCADE;
CREATE TABLE Street(
    id integer GENERATED ALWAYS AS IDENTITY,
    name varchar not null,
    city integer not null,
    constraint cityStreetFK FOREIGN KEY (city) REFERENCES City (id),
    UNIQUE (name, city),
    constraint streetPK PRIMARY KEY (id)
);

DROP TABLE IF EXISTS Person CASCADE;
CREATE TABLE Person(
    id integer GENERATED ALWAYS AS IDENTITY,
    constraint personPK PRIMARY KEY (id),
    lastName varchar not null,
    firstName varchar not null,
    birthdate date not null,
    phoneNumber varchar not null unique,
    gender char null,
    numHouse varchar not null,
    street integer not null,
    constraint streetUserFK FOREIGN KEY (street) REFERENCES Street (id),
    mail varchar not null unique,
    password varchar not null,
    rating integer,
    isAdmin boolean not null
);

DROP TABLE IF EXISTS ToolName CASCADE;
CREATE TABLE ToolName(
    id integer GENERATED ALWAYS AS IDENTITY,
    name varchar not null unique,
    url varchar,
    constraint toolNamePK PRIMARY KEY (id)
);

DROP TABLE IF EXISTS Tool CASCADE;
CREATE TABLE Tool(
     id integer GENERATED ALWAYS AS IDENTITY,
     constraint toolPK PRIMARY KEY (id),
     brand varchar not null,
     size varchar,
     toolName integer not null,
     constraint toolNameToolFK FOREIGN KEY (toolName) REFERENCES ToolName (id) on delete cascade,
     owner integer not null,
     constraint ownerToolFK FOREIGN KEY (owner) REFERENCES Person (id) on delete cascade
);

DROP TABLE IF EXISTS State CASCADE;
CREATE TABLE State(
    id integer,
    constraint statePK PRIMARY KEY (id),
    name varchar not null
);

DROP TABLE IF EXISTS Loan CASCADE;
CREATE TABLE Loan(
     id integer GENERATED ALWAYS AS IDENTITY,
     constraint loanPK PRIMARY KEY (id),
     dateStart date,
     dateEnd date,
     state integer not null,
     constraint stateLoanFK FOREIGN KEY (state) REFERENCES State (id),
     tool integer not null,
     constraint toolLoanFK FOREIGN KEY (tool) REFERENCES Tool (id) on delete cascade,
     borrower integer not null,
     constraint borrowLoanFK FOREIGN KEY (borrower) REFERENCES Person (id) on delete cascade 
);