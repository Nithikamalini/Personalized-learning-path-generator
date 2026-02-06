import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import ProfileInfo from "./components/ProfileInfo"; // ✅ Import ProfileInfo

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ✅ Quiz Questions (Rest of the data remains the same)
const quizData = {
  python: [
    { question: "What is Python?", options: ["A snake", "A language", "Both", "None"], answer: 1 },
    { question: "Which keyword is used for function in Python?", options: ["func", "def", "function", "lambda"], answer: 1 },
    { question: "What is a decorator in Python?", options: ["A design pattern", "A library", "A tool for debugging", "None"], answer: 0 },
  ],
  sql: [
    { question: "SQL stands for?", options: ["Structured Query Language", "Simple Query Language", "None", "Both"], answer: 0 },
    { question: "Which command is used to fetch data?", options: ["SELECT", "GET", "FETCH", "EXTRACT"], answer: 0 },
    { question: "What is a primary key?", options: ["Unique identifier", "Foreign identifier", "Index", "None"], answer: 0 },
  ],
  javascript: [
    { question: "JS is used for?", options: ["Backend", "Frontend", "Both", "None"], answer: 2 },
    { question: "Which keyword declares a variable?", options: ["var", "let", "const", "All"], answer: 3 },
    { question: "What is 'this' in JS?", options: ["Current object", "Previous object", "Global object", "None"], answer: 0 },
  ],
  java: [
    { question: "Java is?", options: ["Platform dependent", "Platform independent", "Only web", "None"], answer: 1 },
    { question: "Java is used for?", options: ["Backend", "Frontend", "Both", "None"], answer: 2 },
    { question: "JVM stands for?", options: ["Java Virtual Machine", "Java Viral Machine", "Both", "None"], answer: 0 },
  ],
  mongodb: [
    { question: "MongoDB is a?", options: ["SQL DB", "NoSQL DB", "Both", "None"], answer: 1 },
    { question: "Command to insert data?", options: ["insertOne()", "insertData()", "add()", "save()"], answer: 0 },
    { question: "What is a BSON?", options: ["Binary JSON", "Basic JSON", "Both", "None"], answer: 0 },
  ],
  ds: [
    { question: "What is a stack?", options: ["FIFO", "LIFO", "Both", "None"], answer: 1 },
    { question: "Queue follows?", options: ["FIFO", "LIFO", "Both", "None"], answer: 0 },
    { question: "Time complexity of binary search?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], answer: 1 },
  ],
};

const skillGoals = {
  python: "Python Developer / Data Science",
  sql: "Database Developer / SQL Expert",
  javascript: "Frontend / Full Stack Developer",
  java: "Java Developer",
  mongodb: "Database Developer / NoSQL Specialist",
  ds: "Algorithm / Problem Solving Expert",
};

const learningPaths = {
  python: {
    Beginner: {
      steps: ["Learn Syntax", "Practice Loops", "Functions", "File Handling", "Basic Projects"],
      resources: [
        { name: "W3Schools Python", url: "https://www.w3schools.com/python/" },
        { name: "Programiz", url: "https://www.programiz.com/python-programming" },
        { name: "FreeCodeCamp Python", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" },
        { name: "Python.org Docs", url: "https://docs.python.org/3/tutorial/" },
        { name: "YouTube - Tech With Tim", url: "https://www.youtube.com/c/TechWithTim" },
      ],
    },
    Intermediate: {
      steps: ["OOP", "Modules", "Error Handling", "File I/O", "Intermediate Projects"],
      resources: [
        { name: "Real Python", url: "https://realpython.com/" },
        { name: "GeeksforGeeks Python", url: "https://www.geeksforgeeks.org/python-programming-language/" },
        { name: "TutorialsPoint Python", url: "https://www.tutorialspoint.com/python/" },
        { name: "HackerRank Python", url: "https://www.hackerrank.com/domains/python" },
        { name: "Python Crash Course Book", url: "https://nostarch.com/pythoncrashcourse2e" },
      ],
    },
    Expert: {
      steps: ["Flask/Django", "Automation", "Data Science", "AI/ML", "APIs"],
      resources: [
        { name: "Coursera Python", url: "https://www.coursera.org/specializations/python" },
        { name: "Kaggle", url: "https://www.kaggle.com/learn/python" },
        { name: "Udemy Advanced Python", url: "https://www.udemy.com/topic/python/" },
        { name: "YouTube - Corey Schafer", url: "https://www.youtube.com/c/Coreyms" },
        { name: "RealWorld Projects GitHub", url: "https://github.com/gothinkster/realworld" },
      ],
    },
  },
  java: {
    Beginner: {
      steps: ["Basics", "OOP", "Loops", "Conditionals", "Mini Projects"],
      resources: [
        { name: "W3Schools Java", url: "https://www.w3schools.com/java/" },
        { name: "JavaTPoint", url: "https://www.javatpoint.com/java-tutorial" },
        { name: "CodeWithHarry Java", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q" },
        { name: "Oracle Docs", url: "https://docs.oracle.com/javase/tutorial/" },
        { name: "Simplilearn Java", url: "https://www.simplilearn.com/tutorials/java-tutorial" },
      ],
    },
    Intermediate: {
      steps: ["Collections", "File I/O", "Multithreading", "JDBC", "Spring Basics"],
      resources: [
        { name: "GeeksforGeeks Java", url: "https://www.geeksforgeeks.org/java/" },
        { name: "TutorialsPoint", url: "https://www.tutorialspoint.com/java/" },
        { name: "Java Brains", url: "https://www.youtube.com/c/JavaBrainsChannel" },
        { name: "Baeldung", url: "https://www.baeldung.com/" },
        { name: "Coursera Java", url: "https://www.coursera.org/specializations/java-programming" },
      ],
    },
    Expert: {
      steps: ["Spring Boot", "Hibernate", "REST APIs", "Full Projects", "Deployment"],
      resources: [
        { name: "Udemy Java Masterclass", url: "https://www.udemy.com/course/java-the-complete-java-developer-course/" },
        { name: "Baeldung Advanced", url: "https://www.baeldung.com/spring-boot" },
        { name: "YouTube Telusko", url: "https://www.youtube.com/c/Telusko" },
        { name: "CodeWithMosh", url: "https://codewithmosh.com/" },
        { name: "Oracle Docs", url: "https://docs.oracle.com/en/java/" },
      ],
    },
  },
  sql: {
    Beginner: {
      steps: ["SELECT Basics", "Filtering", "Sorting", "LIMIT", "Basic Queries"],
      resources: [
        { name: "W3Schools SQL", url: "https://www.w3schools.com/sql/" },
        { name: "SQLZoo", url: "https://sqlzoo.net/" },
        { name: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/" },
        { name: "Khan Academy SQL", url: "https://www.khanacademy.org/computing/computer-programming/sql" },
        { name: "FreeCodeCamp SQL", url: "https://www.freecodecamp.org/news/learn-sql-in-10-minutes/" },
      ],
    },
    Intermediate: {
      steps: ["Joins", "Subqueries", "GROUP BY", "Aggregate Functions", "Set Operations"],
      resources: [
        { name: "Mode Analytics", url: "https://mode.com/sql-tutorial/sql-aggregate-functions/" },
        { name: "LeetCode SQL", url: "https://leetcode.com/problemset/database/" },
        { name: "GeeksforGeeks SQL", url: "https://www.geeksforgeeks.org/sql-tutorial/" },
        { name: "Coursera SQL", url: "https://www.coursera.org/learn/intro-sql" },
        { name: "DataCamp SQL", url: "https://www.datacamp.com/courses/introduction-to-sql" },
      ],
    },
    Expert: {
      steps: ["Optimization", "Stored Procedures", "Triggers", "Functions", "Transactions"],
      resources: [
        { name: "DataCamp Advanced SQL", url: "https://www.datacamp.com/courses/intermediate-sql" },
        { name: "HackerRank SQL", url: "https://www.hackerrank.com/domains/sql" },
        { name: "W3Resource SQL", url: "https://www.w3resource.com/sql-exercises/" },
        { name: "TutorialsPoint SQL", url: "https://www.tutorialspoint.com/sql/" },
        { name: "Udemy SQL Mastery", url: "https://www.udemy.com/topic/sql/" },
      ],
    },
  },
  javascript: {
    Beginner: {
      steps: ["Basics", "DOM Manipulation", "Events", "Loops", "Simple Apps"],
      resources: [
        { name: "W3Schools JS", url: "https://www.w3schools.com/js/" },
        { name: "FreeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
        { name: "MDN Docs", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
        { name: "Programiz JS", url: "https://www.programiz.com/javascript" },
        { name: "Scrimba JS", url: "https://scrimba.com/learn/learnjavascript" },
      ],
    },
    Intermediate: {
      steps: ["ES6+", "Promises", "APIs", "Modules", "Intermediate Projects"],
      resources: [
        { name: "JavaScript.info", url: "https://javascript.info/" },
        { name: "GeeksforGeeks JS", url: "https://www.geeksforgeeks.org/javascript/" },
        { name: "Codecademy JS", url: "https://www.codecademy.com/learn/introduction-to-javascript" },
        { name: "Udemy JS Bootcamp", url: "https://www.udemy.com/course/the-complete-javascript-course/" },
        { name: "YouTube - Traversy Media", url: "https://www.youtube.com/c/TraversyMedia" },
      ],
    },
    Expert: {
      steps: ["React", "Node.js", "Express", "Full Stack Projects", "Deployment"],
      resources: [
        { name: "React Docs", url: "https://react.dev/" },
        { name: "Node Docs", url: "https://nodejs.org/en/docs/" },
        { name: "Next.js Docs", url: "https://nextjs.org/docs" },
        { name: "FreeCodeCamp Full Stack", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/" },
        { name: "YouTube - Fireship", url: "https://www.youtube.com/c/Fireship" },
      ],
    },
  },
  mongodb: {
    Beginner: {
      steps: ["Basics", "CRUD", "Collections", "Documents", "Querying"],
      resources: [
        { name: "MongoDB Docs", url: "https://www.mongodb.com/docs/manual/tutorial/getting-started/" },
        { name: "FreeCodeCamp MongoDB", url: "https://www.freecodecamp.org/news/learn-mongodb-a4ce205e7739/" },
        { name: "Codecademy MongoDB", url: "https://www.codecademy.com/learn/learn-mongodb" },
        { name: "YouTube - Net Ninja", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA" },
        { name: "Simplilearn MongoDB", url: "https://www.simplilearn.com/tutorials/mongodb-tutorial" },
      ],
    },
    Intermediate: {
      steps: ["Indexing", "Aggregation", "Relationships", "Advanced Queries", "Shell Commands"],
      resources: [
        { name: "MongoDB University", url: "https://learn.mongodb.com/" },
        { name: "GeeksforGeeks MongoDB", url: "https://www.geeksforgeeks.org/mongodb-tutorial/" },
        { name: "Coursera MongoDB", url: "https://www.coursera.org/learn/introduction-mongodb" },
        { name: "Udemy MongoDB Bootcamp", url: "https://www.udemy.com/topic/mongodb/" },
        { name: "DataCamp MongoDB", url: "https://www.datacamp.com/courses/introduction-to-mongodb-in-python" },
      ],
    },
    Expert: {
      steps: ["Performance Tuning", "Replication", "Sharding", "Atlas Cloud", "Security"],
      resources: [
        { name: "Udemy Advanced MongoDB", url: "https://www.udemy.com/topic/mongodb/" },
        { name: "MongoDB Atlas Docs", url: "https://www.mongodb.com/docs/atlas/" },
        { name: "Official MongoDB Blog", url: "https://www.mongodb.com/blog" },
        { name: "Dev.to Mongo Guides", url: "https://dev.to/t/mongodb" },
        { name: "YouTube - MongoDB Official", url: "https://www.youtube.com/c/MongoDBofficial" },
      ],
    },
  },
  ds: {
    Beginner: {
      steps: ["Arrays", "Stacks", "Queues", "Linked Lists", "Searching"],
      resources: [
        { name: "Programiz DSA", url: "https://www.programiz.com/dsa" },
        { name: "W3Schools DSA", url: "https://www.w3schools.com/dsa/" },
        { name: "Simplilearn", url: "https://www.simplilearn.com/tutorials/data-structure-tutorial" },
        { name: "YouTube - Jenny's Lectures", url: "https://www.youtube.com/c/JennyslecturesCSIT" },
        { name: "GeeksforGeeks DSA", url: "https://www.geeksforgeeks.org/data-structures/" },
      ],
    },
    Intermediate: {
      steps: ["Trees", "Heaps", "Recursion", "Sorting", "Graphs"],
      resources: [
        { name: "Coursera DSA", url: "https://www.coursera.org/specializations/data-structures-algorithms" },
        { name: "Khan Academy", url: "https://www.khanacademy.org/computing/computer-science/algorithms" },
        { name: "Scaler Topics", url: "https://www.scaler.com/topics/data-structures/" },
        { name: "NeetCode", url: "https://neetcode.io/" },
        { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/data-structures/" },
      ],
    },
    Expert: {
      steps: ["Dynamic Programming", "Graph Algorithms", "Complexity Analysis", "Optimization", "Real Projects"],
      resources: [
        { name: "LeetCode", url: "https://leetcode.com/" },
        { name: "HackerRank", url: "https://www.hackerrank.com/" },
        { name: "InterviewBit", url: "https://www.interviewbit.com/" },
        { name: "Codeforces", url: "https://codeforces.com/" },
        { name: "CodeChef", url: "https://www.codechef.com/" },
      ],
    },
  },
};

function App() {
  const [skills, setSkills] = useState({
    python: 0,
    sql: 0,
    ds: 0,
    javascript: 0,
    java: 0,
    mongodb: 0,
  });

  const [goal, setGoal] = useState("Set your goal");
  const [path, setPath] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState({});

  // Quiz states
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizTopic, setQuizTopic] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (userId) {
      axios
        .get(`${API_URL}/api/getPath/${userId}`)
        .then((res) => {
          if (res.data) {
            setSkills(res.data.skills || skills);
            setGoal(res.data.goal || goal);
            setPath(res.data.path || []);
          }
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [userId]);

  useEffect(() => {
    if (path.length > 0) {
      const completed = path.filter((i) => i.completed).length;
      setProgress(Math.round((completed / path.length) * 100));
    } else {
      setProgress(0);
    }
  }, [path]);

  const getLevel = (score) => {
    if (score <= 1) return "Beginner";
    if (score === 2) return "Intermediate";
    return "Expert";
  };

  const handleLoginSuccess = (data) => {
    console.log("handleLoginSuccess called with data:", data);
    try {
      setUserId(data.userId);
      setSkills(data.skills || skills);
      setGoal(data.goal || "Set your goal");
      setPath(data.path || []);
      setUserProfile({
        name: data.name,
        phone: data.phone,
        role: data.role,
        gender: data.gender,
        nationality: data.nationality,
      });

      if (!data.name) {
        console.log("No profile name found, showing profile form");
        setShowWelcome(false); // Move away from login screen
        setShowProfileForm(true); // Show the profile setup form
      } else {
        console.log("Profile found, hiding welcome screen");
        setShowWelcome(false);
      }
    } catch (err) {
      console.error("Error inside handleLoginSuccess:", err);
    }
  };

  const onProfileSubmit = async (profileData) => {
    console.log("Submitting profile for userId:", userId);
    if (!userId) {
      alert("System Error: No User ID found. Please refresh and login again.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/updateUser`, {
        userId,
        ...profileData,
      });
      console.log("Profile update success:", res.data);
      setUserProfile(profileData);
      setShowProfileForm(false);
      setShowWelcome(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMsg = error.response?.data?.error || "Could not connect to server. Is the backend running?";
      alert("Failed to save profile: " + errorMsg);
    }
  };

  const handleLogout = () => {
    setUserId(null);
    setShowWelcome(true);
    setSkills({ python: 0, sql: 0, ds: 0, javascript: 0, java: 0, mongodb: 0 });
    setGoal("Set your goal");
    setPath([]);
    setProgress(0);
  };

  const startQuiz = (topic) => {
    setQuizTopic(topic);
    setCurrentQuestion(0);
    setScore(0);
    setShowQuiz(true);
  };

  const submitAnswer = (optionIndex) => {
    const isCorrect = quizData[quizTopic][currentQuestion].answer === optionIndex;
    const updatedScore = isCorrect ? score + 1 : score;
    setScore(updatedScore);

    if (currentQuestion + 1 < quizData[quizTopic].length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz(updatedScore);
    }
  };

  const finishQuiz = async (finalScore) => {
    const updatedSkills = { ...skills, [quizTopic]: finalScore };
    setSkills(updatedSkills);

    const bestSkill = quizTopic; // Based on the quiz just taken
    const level = getLevel(finalScore);
    const newGoal = skillGoals[bestSkill];
    setGoal(newGoal);

    const selectedPath = learningPaths[bestSkill][level];
    const formattedPath = selectedPath.steps.map((step) => ({
      text: step,
      completed: false,
    }));

    setPath(formattedPath);
    setShowQuiz(false);

    if (userId) {
      try {
        await axios.post(`${API_URL}/api/updateUser`, {
          userId,
          skills: updatedSkills,
          goal: newGoal,
          path: formattedPath,
        });
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const toggleComplete = async (index) => {
    const updated = [...path];
    updated[index].completed = !updated[index].completed;
    setPath(updated);

    if (userId) {
      try {
        await axios.post(`${API_URL}/api/updateUser`, {
          userId,
          path: updated,
        });
      } catch (error) {
        console.error("Error auto-saving path:", error);
      }
    }
  };


  const getRecommendedResources = () => {
    try {
      // Find the skill with the highest score
      const activeTopic = quizTopic || Object.keys(skills).reduce((a, b) =>
        (skills[a] || 0) > (skills[b] || 0) ? a : b, "python"
      );

      if (!activeTopic || !path || path.length === 0) return [];

      const level = getLevel(skills[activeTopic] || 0);
      if (learningPaths[activeTopic] && learningPaths[activeTopic][level]) {
        return learningPaths[activeTopic][level].resources || [];
      }
    } catch (e) {
      console.error("Resource calculation error:", e);
    }
    return [];
  };

  if (showWelcome) {
    return (
      <Login
        setUserId={setUserId}
        setSkills={setSkills}
        setGoal={setGoal}
        setPath={setPath}
        setShowWelcome={setShowWelcome}
        handleLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="app-container">
      <header className="hero bg-primary text-white text-center py-4 position-relative">
        <button className="btn btn-outline-light position-absolute top-0 end-0 m-3" onClick={handleLogout} style={{ zIndex: 100 }}>
          Logout
        </button>
        <h1>Personalized Learning Path Generator</h1>
        <p>
          Welcome, {userProfile.name || "Learner"}
          {userProfile.role && ` (${userProfile.role})`}!
          {showProfileForm ? " Let's complete your profile." : ` From ${userProfile.nationality || "your location"}, your personalized roadmap is ready.`}
        </p>
      </header>

      <main className="py-5 container">
        {showProfileForm ? (
          <div className="d-flex justify-content-center">
            <ProfileInfo onProfileSubmit={onProfileSubmit} />
          </div>
        ) : (
          <div className="row g-4">
            {/* LEFT SECTION */}
            <div className="col-lg-7">
              <div className="card p-4 mb-4 shadow-sm border-0 glass">
                <h4>Skill Assessment</h4>
                {Object.keys(skills).map((key) => (
                  <div key={key} className="row align-items-center mb-3">
                    <div className="col-4 text-capitalize">{key}</div>
                    <div className="col-6">
                      <div className="progress" style={{ height: "10px" }}>
                        <div className="progress-bar" style={{ width: `${(skills[key] / 3) * 100}%` }}></div>
                      </div>
                    </div>
                    <div className="col-2 text-end">
                      <span className="badge bg-primary rounded-pill">{getLevel(skills[key])}</span>
                    </div>
                  </div>
                ))}
                <hr />
                <h5>Current Learning Goal: <b className="text-primary">{goal}</b></h5>
              </div>

              {/* QUIZ SECTION */}
              <div className="card p-4 mb-4 shadow-sm border-0 glass">
                <h5>Take a Quiz to Update Path</h5>
                <div className="d-flex flex-wrap gap-2">
                  {Object.keys(quizData).map((topic) => (
                    <button key={topic} className="btn btn-outline-secondary text-capitalize" onClick={() => startQuiz(topic)}>
                      {topic} Quiz
                    </button>
                  ))}
                </div>
              </div>

              {showQuiz && quizTopic && (
                <div className="card p-4 shadow-sm border-0 glass-dark text-white">
                  <h4>{quizTopic.toUpperCase()} Quiz</h4>
                  <p className="lead">
                    Question {currentQuestion + 1}: {quizData[quizTopic][currentQuestion].question}
                  </p>
                  <div className="d-flex flex-column gap-2">
                    {quizData[quizTopic][currentQuestion].options.map((opt, i) => (
                      <button key={i} className="btn btn-light text-start" onClick={() => submitAnswer(i)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SECTION */}
            <div className="col-lg-5">
              <div className="card p-4 shadow-sm border-0 glass">
                <h5>Your Learning Path</h5>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="small text-muted">Progress</div>
                  <div className="fw-bold text-success">{progress}%</div>
                </div>
                <div className="progress mb-4" style={{ height: 8 }}>
                  <div className="progress-bar bg-success" role="progressbar" style={{ width: progress + "%" }}></div>
                </div>

                <ul className="list-group list-group-flush mb-4">
                  {path.length > 0 ? (
                    path.map((item, i) => (
                      <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-light">
                        <div className={item.completed ? "text-decoration-line-through text-muted" : "fw-medium"}>
                          {i + 1}. {item.text}
                        </div>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={item.completed}
                          onChange={() => toggleComplete(i)}
                          style={{ cursor: "pointer", width: "20px", height: "20px" }}
                        />
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item text-center text-muted bg-transparent border-0">Take a quiz to generate your path!</li>
                  )}
                </ul>

                {path.length > 0 && (
                  <div className="bg-light p-3 rounded">
                    <h6 className="text-dark">📚 Recommended Resources:</h6>
                    <ul className="mb-0 ps-3">
                      {getRecommendedResources().map((res, i) => (
                        <li key={i} className="small mb-1">
                          <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">
                            🔗 {res.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-3 text-center text-muted border-top">
        © {new Date().getFullYear()} Personalized Learning Path Generator
      </footer>
    </div>
  );
}

export default App;