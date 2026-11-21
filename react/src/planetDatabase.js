const STORAGE_KEY = "space-explorer:saved-planets";

function isPlanet(value) {
    return value !== null
        && typeof value === "object"
        && typeof value.name === "string"
        && typeof value.orderFromSun === "number"
        && typeof value.type === "string"
        && typeof value.averageDistanceAu === "number"
        && typeof value.description === "string";
}

function readPlanets() {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (storedValue === null) {
        return [];
    }

    const planets = JSON.parse(storedValue);

    if (!Array.isArray(planets) || planets.some(planet => !isPlanet(planet))) {
        throw new Error("Saved planet data is invalid. Clear the saved planets and try again.");
    }

    return planets;
}

export function getSavedPlanets() {
    return readPlanets();
}

export function savePlanet(planet) {
    if (!isPlanet(planet)) {
        throw new Error("Cannot save an invalid planet.");
    }

    const planets = readPlanets();
    const existingIndex = planets.findIndex(
        savedPlanet => savedPlanet.name.toLowerCase() === planet.name.toLowerCase()
    );

    if (existingIndex === -1) {
        planets.push(planet);
    } else {
        planets[existingIndex] = planet;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(planets));
    return planets;
}

export function deletePlanet(name) {
    const planets = readPlanets().filter(
        planet => planet.name.toLowerCase() !== name.toLowerCase()
    );

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(planets));
    return planets;
}
