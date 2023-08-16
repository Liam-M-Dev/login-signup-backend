const {app, PORT} = require("./server");

app.listen(PORT, () => {
    console.log(`
        API is up and running
    `);
});