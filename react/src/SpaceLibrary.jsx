import { useEffect, useMemo, useState } from "react";
import { spaceFacts, spaceTheories } from "./spaceKnowledge.js";
import "./spaceLibrary.css";

const FACTS_PER_PAGE = 10;

export function SpaceFacts() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All topics");
    const [page, setPage] = useState(1);

    const categories = useMemo(
        () => ["All topics", ...new Set(spaceFacts.map(fact => fact.category))],
        []
    );
    const filteredFacts = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();

        return spaceFacts.filter(fact => (
            (category === "All topics" || fact.category === category)
            && (!searchTerm || `${fact.category} ${fact.text}`.toLowerCase().includes(searchTerm))
        ));
    }, [category, search]);
    const pageCount = Math.max(1, Math.ceil(filteredFacts.length / FACTS_PER_PAGE));
    const visibleFacts = filteredFacts.slice((page - 1) * FACTS_PER_PAGE, page * FACTS_PER_PAGE);

    function updateFilters(update) {
        setPage(1);
        update();
    }

    return (
        <div className="space-library">
            <p className="library-intro">
                Browse 100 facts about planets, stars, satellites, galaxies, and more.
            </p>

            <div className="library-filters">
                <label>
                    Search facts
                    <input
                        type="search"
                        value={search}
                        onChange={event => updateFilters(() => setSearch(event.target.value))}
                        placeholder="Try stars, planets, gravity..."
                    />
                </label>
                <label>
                    Topic
                    <select
                        value={category}
                        onChange={event => updateFilters(() => setCategory(event.target.value))}
                    >
                        {categories.map(topic => <option key={topic}>{topic}</option>)}
                    </select>
                </label>
            </div>

            <p className="library-count" role="status">
                Showing {filteredFacts.length === 0 ? 0 : (page - 1) * FACTS_PER_PAGE + 1}
                {"–"}{Math.min(page * FACTS_PER_PAGE, filteredFacts.length)} of {filteredFacts.length} facts
                {" "}({spaceFacts.length} total)
            </p>

            {visibleFacts.length > 0 ? (
                <ol className="fact-grid" start={(page - 1) * FACTS_PER_PAGE + 1}>
                    {visibleFacts.map((fact, index) => (
                        <li className="fact-card" key={`${fact.category}-${fact.text}`}>
                            <span className="fact-number">{(page - 1) * FACTS_PER_PAGE + index + 1}</span>
                            <span className="fact-category">{fact.category}</span>
                            <p>{fact.text}</p>
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="library-empty">No facts match that search. Try another word or topic.</p>
            )}

            {filteredFacts.length > 0 && (
                <nav className="library-pagination" aria-label="Space facts pages">
                    <button
                        type="button"
                        onClick={() => setPage(currentPage => currentPage - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {pageCount}</span>
                    <button
                        type="button"
                        onClick={() => setPage(currentPage => currentPage + 1)}
                        disabled={page === pageCount}
                    >
                        Next
                    </button>
                </nav>
            )}
        </div>
    );
}

export function SpaceTheories() {
    const [theoryImages, setTheoryImages] = useState({});

    useEffect(() => {
        const controller = new AbortController();

        async function loadTheoryImages() {
            const results = await Promise.all(spaceTheories.map(async theory => {
                try {
                    const query = new URLSearchParams({
                        q: theory.imageQuery,
                        media_type: "image",
                        page_size: "1"
                    });
                    const response = await fetch(
                        `https://images-api.nasa.gov/search?${query.toString()}`,
                        { signal: controller.signal }
                    );

                    if (!response.ok) {
                        throw new Error(`NASA image search returned HTTP ${response.status}`);
                    }

                    const data = await response.json();
                    const item = data.collection?.items?.[0];
                    const image = item?.links?.find(link => link.render === "image")?.href
                        || item?.links?.[0]?.href;
                    const title = item?.data?.[0]?.title;

                    if (!image) {
                        throw new Error("NASA image search returned no image for this topic.");
                    }

                    return [theory.title, { image, title: title || theory.title, error: "" }];
                } catch (error) {
                    if (error.name === "AbortError") {
                        return null;
                    }

                    console.error(`Failed to load a NASA image for ${theory.title}:`, error);
                    return [theory.title, { image: "", title: "", error: "NASA image unavailable right now." }];
                }
            }));

            if (!controller.signal.aborted) {
                setTheoryImages(Object.fromEntries(results.filter(Boolean)));
            }
        }

        loadTheoryImages();
        return () => controller.abort();
    }, []);

    return (
        <section className="space-library">
            <p className="library-intro">
                These explainers summarize scientific models and the evidence researchers use to test them.
            </p>
            <div className="theory-grid">
                {spaceTheories.map(theory => {
                    const image = theoryImages[theory.title];

                    return (
                        <article className="theory-card" key={theory.title}>
                            {image?.image && (
                                <img src={image.image} alt={image.title} loading="lazy" />
                            )}
                            {image?.error && (
                                <p className="theory-image-status" role="status">{image.error}</p>
                            )}
                            {!image && <p className="theory-image-status">Loading image from NASA...</p>}
                            <div className="theory-copy">
                                <h3>{theory.title}</h3>
                                <p>{theory.summary}</p>
                                <p><strong>Evidence:</strong> {theory.evidence}</p>
                                {image?.image && (
                                    <small className="image-credit">
                                        Image: NASA Image and Video Library — {image.title}
                                    </small>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
