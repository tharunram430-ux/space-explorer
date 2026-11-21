
import { useState, useEffect } from "react";
import "./frontmain.css";
import { deletePlanet, getSavedPlanets, savePlanet } from "./planetDatabase.js";
import SpaceLearning from "./SpaceLearning.jsx";

function loadSavedPlanets() {
    try {
        return { planets: getSavedPlanets(), error: "" };
    } catch (error) {
        console.error("Failed to load saved planets from local storage:", error);
        return { planets: [], error: "Could not read saved planets from this browser." };
    }
}

function Frontmain() {

    const [planet, setPlanet] = useState("");
    const [database, setDatabase] = useState(loadSavedPlanets);
    const { planets: savedPlanets, error: storageError } = database;
    const [images, setImages] = useState([]);
    const [news, setNews] = useState([]);
    const [generalNews, setGeneralNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [planets, setPlanets] = useState([]);
    const [planetDetails, setPlanetDetails] = useState(null);
    const [planetDetailsError, setPlanetDetailsError] = useState("");
    const [backendMessage, setBackendMessage] = useState("");
    const [backendError, setBackendError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadPlanets() {
            try {
                const response = await fetch("/api/planets", {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(`The server returned HTTP ${response.status}`);
                }

                const data = await response.json();

                if (!Array.isArray(data) || data.some(item => typeof item.name !== "string")) {
                    throw new Error("The server returned an invalid planet list.");
                }

                setPlanets(data);
                setBackendMessage(`${data.length} planets loaded from Express.`);
            } catch (error) {
                if (error.name === "AbortError") {
                    return;
                }

                console.error("Failed to load planets from the Express API:", error);
                setBackendError("Could not load planets. Make sure the Express server is running.");
            }
        }

        loadPlanets();

        return () => controller.abort();
    }, []);

    // General space news
    useEffect(() => {

        fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=6&ordering=-published_at")
            .then(response => response.json())
            .then(data => {
                setGeneralNews(data.results);
            })
            .catch(error => console.log(error));

    }, []);

    // Planet details
    useEffect(() => {

        if (planet === "") {
            return;
        }

        const controller = new AbortController();
        setLoading(true);
        setImages([]);
        setNews([]);
        setPlanetDetails(null);
        setPlanetDetailsError("");

        fetch(`/api/planets/${encodeURIComponent(planet)}`, {
            signal: controller.signal
        })
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || `The server returned HTTP ${response.status}`);
                }

                return data;
            })
            .then(data => {
                setPlanetDetails(data);
            })
            .catch(error => {
                if (error.name === "AbortError") {
                    return;
                }

                console.error(`Failed to load ${planet} from the Express API:`, error);
                setPlanetDetailsError("Could not load this planet's details from the server.");
            });

        // Get planet images
        fetch(`https://images-api.nasa.gov/search?q=${planet}&media_type=image&page_size=6`)
            .then(response => response.json())
            .then(data => {

                let result = [];

                data.collection.items.map(item => {

                    if (item.links && item.data) {

                        result.push({
                            title: item.data[0].title,
                            image: item.links[0].href
                        });

                    }

                });

                setImages(result);

            })
            .catch(error => console.log(error));

        // Get planet news
        fetch(`https://api.spaceflightnewsapi.net/v4/articles/?search=${planet}&limit=6`)
            .then(response => response.json())
            .then(data => {
                setNews(data.results);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });

        return () => controller.abort();

    }, [planet]);

    return (

        <div className="explorer">

            <h1>SPACE EXPLORER</h1>

            <p className="intro">
                Explore planets and discover space news
            </p>

            <p className={`backend-status${backendError ? " backend-status-error" : ""}`} role="status">
                {backendError || (backendMessage
                    ? `Connected to Express: ${backendMessage}`
                    : "Loading planets from Express...")}
            </p>

            <SpaceLearning />

            <section>
                <h2>My Saved Planets</h2>
                <p className="storage-description">
                    Saved in this browser using localStorage. These records are not synced to other devices.
                </p>
                {storageError && (
                    <p className="backend-status backend-status-error" role="alert">
                        {storageError}
                    </p>
                )}
                {savedPlanets.length === 0 ? (
                    <p className="saved-empty">You have no saved planets yet.</p>
                ) : (
                    <div className="saved-planets">
                        {savedPlanets.map(savedPlanet => (
                            <div className="saved-planet" key={savedPlanet.name}>
                                <button onClick={() => setPlanet(savedPlanet.name)}>
                                    {savedPlanet.name}
                                </button>
                                <button
                                    className="remove-saved-planet"
                                    onClick={() => {
                                        try {
                                            setDatabase({ planets: deletePlanet(savedPlanet.name), error: "" });
                                        } catch (error) {
                                            console.error("Failed to remove a saved planet:", error);
                                            setDatabase(current => ({
                                                ...current,
                                                error: "Could not remove this planet from local storage."
                                            }));
                                        }
                                    }}
                                    aria-label={`Remove ${savedPlanet.name} from saved planets`}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* General news */}

            <section>

                <h2>Space Highlights</h2>

                {generalNews.length > 0 && (

                    <div className="highlight">

                        <h3>{generalNews[0].title}</h3>

                        <p>{generalNews[0].summary}</p>

                        <a href={generalNews[0].url} target="_blank" rel="noreferrer">
                            Read More
                        </a>

                    </div>

                )}

                <h3>More Space News</h3>

                <div className="general-list">

                    {generalNews.slice(1).map(article => (

                        <div className="general-card" key={article.id}>

                            <h4>{article.title}</h4>

                            <a href={article.url} target="_blank" rel="noreferrer">
                                Read More
                            </a>

                        </div>

                    ))}

                </div>

            </section>

            <hr />

            {/* Planets */}

            <section>

                <h2>Explore Planets</h2>

                <div className="planet-buttons">

                    {planets.map(({ name }) => (

                        <button
                            key={name}
                            onClick={() => setPlanet(name)}
                        >
                            {name}
                        </button>

                    ))}

                </div>

                {planet !== "" && (

                    <div>

                        <h2>{planet}</h2>

                        {planetDetails && (
                            <button
                                onClick={() => {
                                    try {
                                        setDatabase({ planets: savePlanet(planetDetails), error: "" });
                                    } catch (error) {
                                        console.error("Failed to save a planet to local storage:", error);
                                        setDatabase(current => ({
                                            ...current,
                                            error: "Could not save this planet in local storage."
                                        }));
                                    }
                                }}
                            >
                                {savedPlanets.some(
                                    savedPlanet => savedPlanet.name.toLowerCase() === planet.toLowerCase()
                                ) ? "Update Saved Planet" : "Save Planet"}
                            </button>
                        )}

                        {planetDetailsError && (
                            <p className="backend-status backend-status-error" role="alert">
                                {planetDetailsError}
                            </p>
                        )}

                        {planetDetails && (
                            <div className="planet-details">
                                <p>{planetDetails.description}</p>
                                <p><strong>Order from the Sun:</strong> {planetDetails.orderFromSun}</p>
                                <p><strong>Type:</strong> {planetDetails.type}</p>
                                <p><strong>Average distance from the Sun:</strong> {planetDetails.averageDistanceAu} AU</p>
                            </div>
                        )}

                        {loading && <p>Loading...</p>}

                        <h3>Planet Gallery</h3>

                        <div className="image-gallery">

                            {images.map((item, index) => (

                                <div className="image-card" key={index}>

                                    <img src={item.image} alt={item.title} />

                                    <p>{item.title}</p>

                                </div>

                            ))}

                        </div>

                        <h3>Planet News</h3>

                        <div className="news-list">

                            {news.map(article => (

                                <div className="news-card" key={article.id}>

                                    <h4>{article.title}</h4>

                                    <p>{article.summary}</p>

                                    <a href={article.url} target="_blank" rel="noreferrer">
                                        Read More
                                    </a>

                                </div>

                            ))}

                        </div>

                    </div>

                )}

            </section>

            <footer>
                SPACE EXPLORER
            </footer>

        </div>

    );

}

export default Frontmain;
