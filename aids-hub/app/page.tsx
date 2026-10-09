"use client";

import { useState } from "react";
import {
  BookOpen, Bot, Brain, Code2, Database, GraduationCap,
  LayoutDashboard, Send, Sparkles, Trophy, Menu, X,
  FileText, CalendarDays, FolderKanban, ArrowRight,
} from "lucide-react";

const subjects = [
  { name: "Artificial Intelligence", detail: "Learn AI concepts and algorithms", icon: Brain, color: "purple" },
  { name: "Python Programming", detail: "Practice coding and debugging", icon: Code2, color: "blue" },
  { name: "Machine Learning", detail: "Explore models and predictions", icon: Database, color: "green" },
  { name: "Data Science", detail: "Analyze and visualize data", icon: BookOpen, color: "orange" },
];

const quickLinks = [
  { label: "Study Materials", icon: FileText },
  { label: "Assignments", icon: CalendarDays },
  { label: "My Projects", icon: FolderKanban },
  { label: "Practice Quiz", icon: Trophy },
];

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askAI(text = question) {
    const prompt = text.trim();
    if (!prompt || loading) return;

    const updated: Message[] = [...messages, { role: "user", content: prompt }];
    setMessages(updated);
    setQuestion("");
    setError("");
    setLoading(true);
    setActive("StudyAI");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to get an answer.");
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const navigation = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Study Materials", icon: BookOpen },
    { label: "Assignments", icon: CalendarDays },
    { label: "My Projects", icon: FolderKanban },
    { label: "Practice Quiz", icon: Trophy },
    { label: "StudyAI", icon: Bot },
  ];

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><GraduationCap /></div>
          <div><strong>AI&DS Hub</strong><small>STUDENT PORTAL</small></div>
          <button className="mobile-close" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X /></button>
        </div>

        <p className="nav-heading">LEARNING SPACE</p>
        <nav>
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${active === label ? "nav-active" : ""}`}
              onClick={() => {
                setActive(label);
                setMobileMenu(false);
                if (label === "StudyAI") document.getElementById("studyai")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Icon size={19} /><span>{label}</span>
              {label === "StudyAI" && <span className="new-tag">AI</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="ai-promo">
            <Sparkles size={20} />
            <strong>Need help studying?</strong>
            <p>Ask StudyAI to explain any AI&DS concept.</p>
            <button onClick={() => {
              setActive("StudyAI");
              document.getElementById("studyai")?.scrollIntoView({ behavior: "smooth" });
            }}>Ask StudyAI <ArrowRight size={15} /></button>
          </div>
          <div className="profile">
            <div className="avatar">S</div>
            <div><strong>AI&DS Student</strong><small>Demo student account</small></div>
          </div>
        </div>
      </aside>

      {mobileMenu && <button className="menu-backdrop" aria-label="Close menu" onClick={() => setMobileMenu(false)} />}

      <section className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu /></button>
          <div className="breadcrumb">Learning Space <span>/</span> {active}</div>
          <div className="topbar-right"><span className="status-dot" /> Your learning space</div>
        </header>

        <div className="page-content">
          <section className="welcome">
            <div>
              <div className="eyebrow"><Sparkles size={15} /> YOUR AI-POWERED CAMPUS</div>
              <h1>Learn smarter. <span>Build the future.</span></h1>
              <p>Your academic space for Artificial Intelligence and Data Science.</p>
            </div>
            <div className="welcome-art"><Brain size={74} strokeWidth={1.2} /><span className="orbit orbit-one" /><span className="orbit orbit-two" /></div>
          </section>

          <section className="chat-card" id="studyai">
            <div className="chat-heading">
              <div className="chat-logo"><Bot size={24} /></div>
              <div><h2>Meet StudyAI</h2><p>Your personal AI academic assistant</p></div>
              <span className="online-label"><span className="status-dot" /> AI ASSISTANT</span>
            </div>

            <div className="chat-body">
              {messages.length === 0 ? (
                <div className="chat-welcome">
                  <div className="sparkle-large"><Sparkles size={25} /></div>
                  <h3>What would you like to learn today?</h3>
                  <p>Ask a question, explore a concept, or get help with your code.</p>
                  <div className="suggestions">
                    {[
                      "Explain machine learning simply",
                      "Teach me Python from basics",
                      "Give me an AI&DS mini-project idea",
                    ].map((item) => (
                      <button key={item} onClick={() => askAI(item)}>{item}<ArrowRight size={15} /></button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="messages">
                  {messages.map((message, index) => (
                    <div className={`message-row ${message.role}`} key={index}>
                      <div className="message-avatar">{message.role === "assistant" ? <Bot size={18} /> : "S"}</div>
                      <div className="message-bubble">
                        <small>{message.role === "assistant" ? "StudyAI" : "You"}</small>
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {loading && <div className="typing">StudyAI is thinking...</div>}
                </div>
              )}
              {error && <div className="error-message">{error}</div>}
              <form className="chat-input" onSubmit={(e) => { e.preventDefault(); askAI(); }}>
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask StudyAI about AI, Python, Data Science..."
                  aria-label="Message StudyAI"
                  disabled={loading}
                />
                <button type="submit" disabled={loading || !question.trim()} aria-label="Send message"><Send size={18} /></button>
              </form>
              <p className="chat-disclaimer">StudyAI can make mistakes. Verify important academic information.</p>
            </div>
          </section>

          <div className="section-heading">
            <div><h2>Explore your subjects</h2><p>Build your knowledge, one concept at a time.</p></div>
            <span className="section-count">04 SUBJECTS</span>
          </div>

          <section className="subject-grid">
            {subjects.map(({ name, detail, icon: Icon, color }) => (
              <button className="subject-card" key={name} onClick={() => {
                setQuestion(`Help me learn ${name}. Start with the fundamentals and give me a practice question.`);
                setActive("StudyAI");
                document.getElementById("studyai")?.scrollIntoView({ behavior: "smooth" });
              }}>
                <div className={`subject-icon ${color}`}><Icon size={23} /></div>
                <h3>{name}</h3><p>{detail}</p>
                <span className="subject-link">Learn with StudyAI <ArrowRight size={15} /></span>
              </button>
            ))}
          </section>

          <div className="section-heading quick-heading">
            <div><h2>Your learning tools</h2><p>Everything you need, in one place.</p></div>
          </div>
          <section className="quick-grid">
            {quickLinks.map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => {
                setActive(label);
                if (label === "Practice Quiz") askAI("Create a 5-question AI&DS beginner quiz and wait for my answers.");
                else askAI(`Help me with ${label.toLowerCase()} for an AI&DS student. Explain how I can get started.`);
              }}>
                <Icon size={20} /><span>{label}</span><ArrowRight size={16} />
              </button>
            ))}
          </section>

          <footer>AI&DS Hub <span>•</span> Learn, practice, and grow with AI.</footer>
        </div>
      </section>
    </main>
  );
}
