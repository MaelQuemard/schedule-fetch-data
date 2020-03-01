CREATE TABLE hardware (
    id serial PRIMARY KEY,
    name TEXT,
    temp numeric,
    fan numeric,
    power numeric,
    powerMin numeric,
    powerMax numeric,
    powerStock numeric,
    speed numeric,
    bus TEXT,
    core TEXT,
    coreMax TEXT,
    memory TEXT,
    memoryMax TEXT,
    load TEXT,
    nodeId serial REFERENCES node(id) 
)