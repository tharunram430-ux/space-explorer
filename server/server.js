const app = require("../api/index");

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
    console.log(`Space Explorer API is running at http://localhost:${PORT}`);
});
