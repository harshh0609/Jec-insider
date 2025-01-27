import { useEffect, useState } from "react";
import supabase from "../supabase";
import "../style.css";
import { useAuth } from "../utils/authContext";

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

const MAX_TEXT_LENGTH = 200;

function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    async function getFacts() {
      setIsLoading(true);
      let query = supabase.from("facts").select("*");
  
      // Only show approved facts to regular users
      if (user?.email !== "jecinsider@gmail.com") {
        query = query.eq("approved", true);
      }
  
      // Filter by category if selected
      if (currentCategory !== "all") {
        query = query.eq("category", currentCategory);
      }
  
      const { data, error } = await query
        .order("votesInteresting", { ascending: false })
        .limit(1000);
  
      if (!error) setFacts(data || []);
      else console.error("Error fetching facts:", error);
  
      setIsLoading(false);
    }
  
    getFacts();
  }, [currentCategory, user]);
  

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm && <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />}

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
  const appTitle = "Jec Insider";
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="Jec Lens Logo" />
        <h1>{appTitle}</h1>
      </div>
      {/* "Post" button is always visible */}
      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((prev) => !prev)}
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
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if the user is authenticated
    if (!user) {
      alert("You need to be logged in to post a news!");
      return;
    }
  
    // Validate form inputs
    if (text && isValidHttpUrl(source) && category && text.length <= MAX_TEXT_LENGTH) {
      setIsUploading(true);
      const { data, error } = await supabase
        .from("facts")
        .insert([{ text, source, category, approved: false }])
        .select();
  
      setIsUploading(false);
  
      if (!error) {
        setFacts((facts) => [data[0], ...facts]);
        setText("");
        setSource("");
        setCategory("");
        setShowForm(false);
        
        // Alert the user that their news is under review
        alert("Your news has been submitted and is under review. It will be accessible soon.");
      } else {
        console.error("Error submitting fact:", error);
      }
    } else {
      alert("Please fill in all fields correctly.");
    }
  };
  

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a News with colleagues..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{MAX_TEXT_LENGTH - text.length}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        value={source}
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
    </section>
  );
}
function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  const categoryColor =
    CATEGORIES.find((cat) => cat.name === fact.category)?.color || "#ccc";

  // Check if the user has already voted on any of the vote fields
  const hasVotedInteresting = localStorage.getItem(`${fact.id}_votesInteresting`);
  const hasVotedMindblowing = localStorage.getItem(`${fact.id}_votesMindblowing`);
  const hasVotedFalse = localStorage.getItem(`${fact.id}_votesFalse`);

  const handleVote = async (columnName) => {
    if (!user) {
      alert("You need to be logged in to vote!");
      return;
    }

    const voteKey = `${fact.id}_${columnName}`; // Generate a unique key for the vote
    const hasVoted = localStorage.getItem(voteKey); // Check if the user has already voted on this fact and column

    if (hasVoted) {
      alert("You have already voted on this fact.");
      return;
    }

    setIsUpdating(true);

    const { data, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();

    if (!error) {
      // Store the fact and column name in localStorage to mark that the user has voted
      localStorage.setItem(voteKey, true);

      setIsUpdating(false);
      setFacts((facts) => facts.map((f) => (f.id === fact.id ? data[0] : f)));
    } else {
      setIsUpdating(false);
      console.error("Error updating vote:", error);
    }
  };

  const handleApprove = async () => {
    setIsUpdating(true);

    const { data, error } = await supabase
      .from("facts")
      .update({ approved: true })
      .eq("id", fact.id)
      .select();

    setIsUpdating(false);

    if (!error) {
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? data[0] : f))
      );
    } else {
      console.error("Error approving fact:", error);
    }
  };

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
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating || hasVotedInteresting} // Disable if already voted
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdating || hasVotedMindblowing} // Disable if already voted
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button
          onClick={() => handleVote("votesFalse")}
          disabled={isUpdating || hasVotedFalse} // Disable if already voted
        >
          ⛔️ {fact.votesFalse}
        </button>
        {user?.email === "ayushoficial04@gmail.com" && !fact.approved && (
          <button className="btn-approve" onClick={handleApprove} disabled={isUpdating}>
            Approve
          </button>
        )}
      </div>
    </li>
  );
}

export default App;

