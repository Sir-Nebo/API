module.exports.postLoan = async (client, dateStart, dateEnd, borrower, tool, state) => {
    await client.query("INSERT INTO loan (dateStart, dateEnd, borrower, tool, state) values ($1,$2,$3,$4,$5)",[dateStart, dateEnd, borrower, tool, state]);
}

module.exports.getLoan = async(client, borrower, tool, dateStart) => {
    return await client.query("SELECT * FROM loan where borrower = $1 and tool = $2 and datestart = $3", [borrower,tool, dateStart]);
}

module.exports.getLoanById = async(client, id) => {
    return await client.query("SELECT * FROM loan where id = $1", [id]);
}

module.exports.getAllLoans = async(client) => {
    return await client.query("SELECT lo.*, b.lastname as borrowerLastname, b.firstname as borrowerFirstname, b.mail as borrowerMail, " +
        "l.mail as loanerMail, l.lastname as loanerLastname, l.firstname as loanerFirstname,tn.name as toolname, s.name as state " +
        "FROM loan lo, Person b, Person l, Toolname tn, Tool t, State s WHERE lo.borrower = b.id AND lo.tool = t.id AND t.owner = l.id " +
        "AND t.toolname = tn.id and lo.state = s.id");
}

module.exports.getAllLoansAcceptedByBorrower = async(client, borrower) => {
    return await client.query("SELECT l.*, t.brand as toolbrand, t.size as toolsize, b.lastname as borrowerLastName, b.firstname as borrowerFirstName, b.rating as borrowerRating, b.mail as borrowerMail, o.lastname as ownerLastName, o.firstname as ownerFirstName, o.rating as ownerRating, o.mail as ownerMail, tn.name as toolName, tn.url as toolNameUrl FROM loan l, tool t, person b, person o, toolname tn where l.borrower = $1 and l.state = 2 and l.tool = t.id and t.owner = o.id and l.borrower = b.id and t.toolname = tn.id ", [borrower]);
}

module.exports.getAllLoansAcceptedByOwner = async(client, owner) => {
    return await client.query("SELECT l.*, t.brand as toolbrand, t.size as toolsize, b.lastname as borrowerLastName, b.firstname as borrowerFirstName, b.rating as borrowerRating, b.mail as borrowerMail, o.lastname as ownerLastName, o.firstname as ownerFirstName, o.rating as ownerRating, o.mail as ownerMail, tn.name as toolName, tn.url as toolNameUrl FROM loan l, tool t, person b, person o, toolname tn where l.tool in (select id from tool where owner = $1) and l.state = 2 and l.tool = t.id and t.owner = o.id and l.borrower = b.id and t.toolname = tn.id", [owner]);
}

module.exports.deleteLoan = async (client, id) => {
    await client.query("DELETE FROM loan where id = $1", [id]);
}

module.exports.loanExist = async (client, id) => {
    const {rows : loans} = await client.query(
        "SELECT count(id) AS nbr FROM loan WHERE id = $1",
        [id]
    );
    return loans[0].nbr === "1";
}

module.exports.updateState = async (client, id, state) => {
    await client.query("UPDATE loan SET state = $1 WHERE id = $2", [state, id]);
}

module.exports.getAllStates = async (client) => {
    return await client.query("SELECT * FROM state");
}

module.exports.getLoanByTool = async (client, toolId) =>{
    return await client.query("SELECT l.dateend, p.firstname as borrowerfirstname, p.lastname as borrowerlastname, p.rating as borrowerrating, p.mail as borrowermail FROM loan l, person p WHERE tool = $1 AND state = 2 AND l.borrower = p.id",[toolId]);
}