import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function App() {
  const [word, setWord] = useState("");
  const [submittedWords, setSubmittedWords] = useState([]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("topic", (topicText) => {
      setLoading(false);
      setTopic(topicText);
    });
    return () => socket.off("topic");
  }, []);

  async function submitWord() {
    if (!word.trim()) return;
    setSubmittedWords((prev) => [...prev, word]);
    setLoading(true);
    await axios.post("http://localhost:5000/submit-word", { word });
    setWord("");
  }

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.card}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={styles.title}>Topico</h1>
        <p style={styles.subtitle}>Add your word and get a random topic!</p>

        <input
          style={styles.input}
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter your word..."
        />
        <button style={styles.button} onClick={submitWord}>
          Send Word
        </button>

        <div style={styles.wordsContainer}>
          {submittedWords.map((w, i) => (
            <motion.div
              key={i}
              style={{
                ...styles.wordBox,
                backgroundColor: funColors[i % funColors.length],
              }}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {w}
            </motion.div>
          ))}
        </div>

        {loading && <p style={styles.loading}>Thinking of something fun…</p>}
      </motion.div>

      <AnimatePresence>
        {topic && (
          <motion.div
            style={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={styles.modal}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div style={styles.modalHeader}>Your Topic</div>
              <div style={styles.modalBody}>{topic}</div>
              <button style={styles.closeButton} onClick={() => setTopic("")}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const funColors = ["#FFD166", "#06D6A0", "#EF476F", "#118AB2", "#F78C6B"];

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    background:
      "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Comic Sans MS', 'Poppins', sans-serif",
    padding: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "30px",
    border: "4px solid #ffb703",
    padding: "40px",
    width: "420px",
    maxWidth: "95%",
    color: "#333",
    textAlign: "center",
    boxShadow: "8px 8px 0px #fb8500",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "10px",
    color: "#ff006e",
    textShadow: "2px 2px #ffd166",
  },
  subtitle: {
    fontSize: "1rem",
    marginBottom: "20px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "50px",
    border: "3px solid #06d6a0",
    backgroundColor: "#fefae0",
    fontSize: "1rem",
    marginBottom: "15px",
    outline: "none",
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "50px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#06d6a0",
    color: "#fff",
    cursor: "pointer",
    transition: "transform 0.2s ease, background-color 0.3s",
    boxShadow: "4px 4px 0px #118ab2",
  },
  wordsContainer: {
    marginTop: "25px",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
  },
  wordBox: {
    padding: "10px 18px",
    borderRadius: "50px",
    fontSize: "0.9rem",
    color: "#fff",
    fontWeight: "600",
    boxShadow: "3px 3px 0px rgba(0,0,0,0.3)",
  },
  loading: {
    marginTop: "20px",
    fontStyle: "italic",
    fontWeight: "600",
    color: "#ff006e",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "10px",
  },
  modal: {
    background: "#fff",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "400px",
    overflow: "hidden",
    textAlign: "center",
    border: "5px solid #ff006e",
    boxShadow: "8px 8px 0px #ffd166",
  },
  modalHeader: {
    background: "#ffb703",
    padding: "16px",
    color: "#333",
    fontSize: "1.3rem",
    fontWeight: "800",
    borderBottom: "3px dashed #ff006e",
  },
  modalBody: {
    padding: "25px",
    fontSize: "1.1rem",
    color: "#333",
    lineHeight: 1.6,
  },
  closeButton: {
    background: "#06d6a0",
    color: "#fff",
    border: "none",
    padding: "14px 20px",
    borderRadius: "0 0 20px 20px",
    width: "100%",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
  },
};
