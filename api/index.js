const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const planets = [
    {
        name: "Mercury",
        orderFromSun: 1,
        type: "Terrestrial",
        averageDistanceAu: 0.39,
        description: "The smallest planet and the closest planet to the Sun."
    },
    {
        name: "Venus",
        orderFromSun: 2,
        type: "Terrestrial",
        averageDistanceAu: 0.72,
        description: "A rocky planet with a very thick, hot atmosphere."
    },
    {
        name: "Earth",
        orderFromSun: 3,
        type: "Terrestrial",
        averageDistanceAu: 1,
        description: "Our home planet, with liquid water on its surface."
    },
    {
        name: "Mars",
        orderFromSun: 4,
        type: "Terrestrial",
        averageDistanceAu: 1.52,
        description: "The Red Planet, known for its rocky surface."
    },
    {
        name: "Jupiter",
        orderFromSun: 5,
        type: "Gas giant",
        averageDistanceAu: 5.2,
        description: "The largest planet in our solar system."
    },
    {
        name: "Saturn",
        orderFromSun: 6,
        type: "Gas giant",
        averageDistanceAu: 9.58,
        description: "A gas giant famous for its bright ring system."
    },
    {
        name: "Uranus",
        orderFromSun: 7,
        type: "Ice giant",
        averageDistanceAu: 19.2,
        description: "An ice giant that rotates at a steep angle."
    },
    {
        name: "Neptune",
        orderFromSun: 8,
        type: "Ice giant",
        averageDistanceAu: 30.05,
        description: "A distant, cold ice giant with strong winds."
    }
];

app.get("/", (req, res) => {
    res.json({
        name: "Space Explorer API",
        endpoints: ["/api/health", "/api/planets", "/api/planets/:name"]
    });
});

app.get("/api", (req, res) => {
    res.json({
        name: "Space Explorer API",
        endpoints: ["/api/health", "/api/planets", "/api/planets/:name"]
    });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/api/planets", (req, res) => {
    res.json(planets);
});

app.get("/api/planets/:name", (req, res) => {
    const requestedName = req.params.name.toLowerCase();
    const planet = planets.find(item => item.name.toLowerCase() === requestedName);

    if (!planet) {
        return res.status(404).json({ error: "Planet not found." });
    }

    res.json(planet);
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found." });
});

module.exports = app;
