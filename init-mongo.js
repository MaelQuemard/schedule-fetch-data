db.createUser({
    user: "mongoUser",
    pwd: "mongoPwd",
    roles: [{
        role: "readWrite",
        db: "minerstat"
    }]
})
