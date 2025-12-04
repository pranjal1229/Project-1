import { useEffect, useState } from "react";
import "./App.css";

const defaultUsers = [
  {
    username: "admin",
    pin: "1234",
    balance: 5000,
    transactions: [],
  },
  {
    username: "user1",
    pin: "1111",
    balance: 3000,
    transactions: [],
  },
];

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState("");

  // ✅ SAFE LOAD (handles old broken localStorage data)
  useEffect(() => {
    const stored = localStorage.getItem("atm-users");

    if (stored) {
      const parsed = JSON.parse(stored);

      // ✅ Ensure every user has transactions (prevents white screen)
      const fixedUsers = parsed.map((u) => ({
        ...u,
        transactions: u.transactions || [],
      }));

      setUsers(fixedUsers);
      localStorage.setItem("atm-users", JSON.stringify(fixedUsers));
    } else {
      localStorage.setItem("atm-users", JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    }
  }, []);

  // ✅ SAVE USERS
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("atm-users", JSON.stringify(users));
    }
  }, [users]);

  // ✅ SAFE LOGIN (no white screen possible)
  const login = () => {
    const user = users.find(
      (u) => u.username === username && u.pin === pin
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    // ✅ FORCE transactions array to exist
    setCurrentUser({
      ...user,
      transactions: user.transactions || [],
    });

    setUsername("");
    setPin("");
  };

  // ✅ DEPOSIT
  const deposit = () => {
    if (!amount) return;

    const updated = users.map((u) =>
      u.username === currentUser.username
        ? {
            ...u,
            balance: u.balance + Number(amount),
            transactions: [
              ...u.transactions,
              {
                type: "Deposit",
                amount: Number(amount),
                date: new Date().toLocaleString(),
              },
            ],
          }
        : u
    );

    setUsers(updated);
    setCurrentUser(
      updated.find((u) => u.username === currentUser.username)
    );
    setAmount("");
  };

  // ✅ WITHDRAW
  const withdraw = () => {
    if (!amount) return;

    if (Number(amount) > currentUser.balance) {
      alert("Insufficient balance");
      return;
    }

    const updated = users.map((u) =>
      u.username === currentUser.username
        ? {
            ...u,
            balance: u.balance - Number(amount),
            transactions: [
              ...u.transactions,
              {
                type: "Withdraw",
                amount: Number(amount),
                date: new Date().toLocaleString(),
              },
            ],
          }
        : u
    );

    setUsers(updated);
    setCurrentUser(
      updated.find((u) => u.username === currentUser.username)
    );
    setAmount("");
  };

  const logout = () => setCurrentUser(null);

  return (
    <div className="atm-bg">
      {!currentUser ? (
        <div className="atm-card">
          <h1>ATM Login</h1>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="PIN"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />

          <button onClick={login}>Login</button>

          <p className="demo">
            Demo: admin / 1234 &nbsp;|&nbsp; user1 / 1111
          </p>
        </div>
      ) : (
        <div className="atm-card">
          <h1>Welcome, {currentUser.username}</h1>
          <h2>Balance: ₹{currentUser.balance}</h2>

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="actions">
            <button onClick={deposit}>Deposit</button>
            <button onClick={withdraw} className="danger">
              Withdraw
            </button>
          </div>

          {/* ✅ TRANSACTION HISTORY */}
          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <h3 style={{ marginBottom: "8px" }}>Transaction History</h3>

            <div
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                background: "#020617",
                padding: "10px",
                borderRadius: "6px",
                fontSize: "13px",
              }}
            >
              {currentUser.transactions.length === 0 && (
                <p style={{ opacity: 0.6 }}>No transactions yet</p>
              )}

              {currentUser.transactions
                .slice()
                .reverse()
                .map((t, index) => (
                  <p key={index}>
                    {t.type} ₹{t.amount} <br />
                    <span style={{ opacity: 0.6 }}>{t.date}</span>
                  </p>
                ))}
            </div>
          </div>

          <button onClick={logout} className="logout">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
