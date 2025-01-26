import { useEffect, useState } from "react";
import supabase from "../supabase";
import "../style.css";

const CATEGORIES = [
  { name: "computer science", color: "#3b82f6" },
  { name: "information technology", color: "#16a34a" },
  { name: "electronics and communication", color: "#ef4444" },
  { name: "electrical", color: "#eab308" },
  { name: "mechanical", color: "#db2777" },
  { name: "civil", color: "#14b8a6" },
  { name: "mechatronics", color: "#f97316" },
  { name: "industrial production", color: "#8b5cf6" },
  { name: "Admin", color: "#A3ADB8" },
  { name: "Clubs", color: "#BDD09F" },
];

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(() => {
    async function getFacts() {
      setIsLoading(true);
      let query = supabase.from("facts").select("*");

      if (currentCategory !== "all") {
        query = query.eq("category", currentCategory);
      }

      const { data: facts, error } = await query
        .order("votesInteresting", { ascending: false })
        .limit(1000);

      if (!error) setFacts(facts);
      else alert("There was a problem getting data");
      setIsLoading(false);
    }
    getFacts();
  }, [currentCategory]);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? <Loader /> : <FactList facts={facts} setFacts={setFacts} />}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ showForm, setShowForm }) {
  const appTitle = "Jec Lens";

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="Jec Lens Logo" />
        <h1>{appTitle}</h1>
      </div>

      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "Close" : "Share a News"}
      </button>
    </header>
  );
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    const postCountData = JSON.parse(localStorage.getItem("postCount")) || {};

    if (!postCountData[today]) {
      postCountData[today] = 0;
    }

    if (postCountData[today] >= 5) {
      alert("You can only post up to 5 times per day.");
      return;
    }

    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      setIsUploading(true);

      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      if (!error) {
        setFacts((facts) => [newFact[0], ...facts]);
        setText("");
        setSource("");
        setCategory("");
        setShowForm(false);

        postCountData[today] += 1;
        localStorage.setItem("postCount", JSON.stringify(postCountData));
      }
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a News with the colleagues..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source..."
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Department:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return <p className="message">No News for this category yet! Create the first one ✌️</p>;
  }

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} News in the database. Add your own!</p>
      <p>Developed and Managed By Ayush Chouksey!</p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const categoryColor =
    CATEGORIES.find((cat) => cat.name === fact.category)?.color || "#ccc";

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);

    if (!error) {
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
    }
  }

  return (
    <li className="fact">
      <p>
        {fact.text}
        <a className="source" href={fact.source} target="_blank" rel="noreferrer">
          (Source)
        </a>
      </p>
      <span className="tag" style={{ backgroundColor: categoryColor }}>
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button onClick={() => handleVote("votesInteresting")}>
          👍 {fact.votesInteresting}
        </button>
        <button onClick={() => handleVote("votesMindblowing")}>
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
