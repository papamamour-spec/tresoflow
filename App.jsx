import { useState, useMemo } from "react";

// ─── IFC Color Palette ───────────────────────────────────────────────────────
const C = {
  navy: "#003B5C",
  navyLight: "#004F7C",
  navyDark: "#002840",
  orange: "#F5821F",
  orangeLight: "#F79A4A",
  teal: "#00A8A8",
  green: "#2E7D32",
  greenLight: "#E8F5E9",
  red: "#C62828",
  redLight: "#FFEBEE",
  amber: "#F57F17",
  amberLight: "#FFF8E1",
  blue: "#1565C0",
  blueLight: "#E3F2FD",
  gray50: "#FAFAFA",
  gray100: "#F5F5F5",
  gray200: "#EEEEEE",
  gray300: "#E0E0E0",
  gray400: "#BDBDBD",
  gray500: "#9E9E9E",
  gray600: "#757575",
  gray700: "#616161",
  gray800: "#424242",
  white: "#FFFFFF",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: 1, name: "Admin Principal", email: "admin@holding.com", role: "admin", entity: "Holding", active: true },
  { id: 2, name: "Marie Dupont", email: "marie@filiale-a.com", role: "user", entity: "Filiale A", active: true },
  { id: 3, name: "Jean Martin", email: "jean@filiale-b.com", role: "user", entity: "Filiale B", active: true },
  { id: 4, name: "Sophie Bernard", email: "sophie@holding.com", role: "manager", entity: "Holding", active: true },
];

const ENTITIES = ["Holding", "Filiale A", "Filiale B", "Filiale C"];
const BANKS = ["BNP Paribas", "Société Générale", "Crédit Agricole", "CIB", "BMCE", "Attijari"];

const INITIAL_ACCOUNTS = [
  { id: 1, entity: "Holding", bank: "BNP Paribas", number: "FR76 1234 5678 9012", currency: "EUR", balance: 2450000, type: "Courant" },
  { id: 2, entity: "Holding", bank: "Société Générale", number: "FR76 9876 5432 1098", currency: "EUR", balance: 850000, type: "Dépôt" },
  { id: 3, entity: "Filiale A", bank: "BNP Paribas", number: "FR76 1111 2222 3333", currency: "EUR", balance: 320000, type: "Courant" },
  { id: 4, entity: "Filiale A", bank: "BMCE", number: "MA 5678 9012 3456", currency: "MAD", balance: 1200000, type: "Courant" },
  { id: 5, entity: "Filiale B", bank: "Crédit Agricole", number: "FR76 4444 5555 6666", currency: "EUR", balance: 180000, type: "Courant" },
  { id: 6, entity: "Filiale C", bank: "CIB", number: "EG 7890 1234 5678", currency: "EGP", balance: 4500000, type: "Courant" },
];

const INITIAL_TRANSACTIONS = [
  { id: 1, date: "2025-03-01", entity: "Holding", accountId: 1, type: "encaissement", category: "Client", counterpart: "Client Alpha SA", amount: 125000, currency: "EUR", reference: "FAC-2025-001", status: "validé", note: "" },
  { id: 2, date: "2025-03-02", entity: "Holding", accountId: 1, type: "decaissement", category: "Fournisseur", counterpart: "Fournisseur Beta", amount: 45000, currency: "EUR", reference: "FOU-2025-042", status: "validé", note: "" },
  { id: 3, date: "2025-03-03", entity: "Filiale A", accountId: 3, type: "encaissement", category: "Interco", counterpart: "Holding", amount: 80000, currency: "EUR", reference: "IC-2025-010", status: "validé", note: "Avance interco" },
  { id: 4, date: "2025-03-05", entity: "Filiale B", accountId: 5, type: "decaissement", category: "Moratoire", counterpart: "BNP Paribas", amount: 12000, currency: "EUR", reference: "MOR-2025-001", status: "en attente", note: "" },
  { id: 5, date: "2025-03-06", entity: "Holding", accountId: 1, type: "encaissement", category: "Client", counterpart: "Gamma Industries", amount: 200000, currency: "EUR", reference: "FAC-2025-002", status: "validé", note: "" },
  { id: 6, date: "2025-03-08", entity: "Filiale A", accountId: 4, type: "decaissement", category: "Loyer", counterpart: "SCI Immo", amount: 35000, currency: "MAD", reference: "LOY-2025-03", status: "validé", note: "" },
];

const INITIAL_RECEIVABLES = [
  { id: 1, entity: "Holding", client: "Client Alpha SA", invoice: "FAC-2025-001", amount: 250000, currency: "EUR", dueDate: "2025-03-15", status: "en cours", daysOverdue: 0 },
  { id: 2, entity: "Filiale A", client: "Delta Corp", invoice: "FAC-A-2025-005", amount: 88000, currency: "EUR", dueDate: "2025-03-10", status: "en retard", daysOverdue: 12 },
  { id: 3, entity: "Holding", client: "Epsilon SA", invoice: "FAC-2025-003", amount: 155000, currency: "EUR", dueDate: "2025-04-01", status: "en cours", daysOverdue: 0 },
  { id: 4, entity: "Filiale B", client: "Zeta Ltd", invoice: "FAC-B-2025-003", amount: 42000, currency: "EUR", dueDate: "2025-02-28", status: "en retard", daysOverdue: 20 },
  { id: 5, entity: "Filiale A", client: "Eta Group", invoice: "FAC-A-2025-008", amount: 67000, currency: "EUR", dueDate: "2025-04-15", status: "en cours", daysOverdue: 0 },
];

const INITIAL_PAYABLES = [
  { id: 1, entity: "Holding", supplier: "Fournisseur Beta", invoice: "FOU-2025-042", amount: 45000, currency: "EUR", dueDate: "2025-03-20", status: "à payer", priority: "normal" },
  { id: 2, entity: "Filiale A", supplier: "Tech Solutions", invoice: "FOU-A-2025-011", amount: 28000, currency: "EUR", dueDate: "2025-03-12", status: "urgent", priority: "urgent" },
  { id: 3, entity: "Holding", supplier: "Conseil Expert", invoice: "FOU-2025-038", amount: 18000, currency: "EUR", dueDate: "2025-04-05", status: "à payer", priority: "normal" },
  { id: 4, entity: "Filiale B", supplier: "Services Pro", invoice: "FOU-B-2025-007", amount: 9500, currency: "EUR", dueDate: "2025-03-08", status: "urgent", priority: "urgent" },
];

const INITIAL_MORATORIA = [
  { id: 1, entity: "Holding", creditor: "BNP Paribas", type: "Moratoire fiscal", totalAmount: 480000, currency: "EUR", startDate: "2024-01-01", endDate: "2026-12-31", installments: 24, paidInstallments: 14, monthlyAmount: 20000, nextDueDate: "2025-03-31", status: "actif" },
  { id: 2, entity: "Filiale A", creditor: "CNSS", type: "Moratoire social", totalAmount: 120000, currency: "EUR", startDate: "2024-06-01", endDate: "2025-12-31", installments: 18, paidInstallments: 9, monthlyAmount: 6667, nextDueDate: "2025-03-15", status: "actif" },
  { id: 3, entity: "Filiale B", creditor: "DGI", type: "Moratoire TVA", totalAmount: 85000, currency: "EUR", startDate: "2024-03-01", endDate: "2025-08-31", installments: 18, paidInstallments: 12, monthlyAmount: 4722, nextDueDate: "2025-03-20", status: "actif" },
];

const INITIAL_LOANS = [
  { id: 1, entity: "Holding", lender: "BNP Paribas", purpose: "Investissement", principal: 2000000, currency: "EUR", rate: 4.5, startDate: "2023-01-15", endDate: "2028-01-15", termMonths: 60, remainingBalance: 1450000, monthlyPayment: 37000, nextPaymentDate: "2025-03-15", type: "amortissable" },
  { id: 2, entity: "Holding", lender: "Société Générale", purpose: "BFR", principal: 500000, currency: "EUR", rate: 3.8, startDate: "2024-06-01", endDate: "2027-06-01", termMonths: 36, remainingBalance: 380000, monthlyPayment: 14700, nextPaymentDate: "2025-03-01", type: "amortissable" },
  { id: 3, entity: "Filiale A", lender: "BMCE", purpose: "Équipement", principal: 800000, currency: "MAD", rate: 5.5, startDate: "2024-01-01", endDate: "2029-01-01", termMonths: 60, remainingBalance: 680000, monthlyPayment: 15300, nextPaymentDate: "2025-03-20", type: "amortissable" },
  { id: 4, entity: "Filiale B", lender: "Crédit Agricole", purpose: "Immobilier", principal: 1200000, currency: "EUR", rate: 3.2, startDate: "2022-09-01", endDate: "2042-09-01", termMonths: 240, remainingBalance: 1050000, monthlyPayment: 6800, nextPaymentDate: "2025-03-01", type: "amortissable" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n, cur = "EUR") => new Intl.NumberFormat("fr-FR", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n);
const fmtNum = (n) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n);
const today = () => new Date().toISOString().split("T")[0];
const genId = (arr) => Math.max(0, ...arr.map((x) => x.id)) + 1;

function amortizationSchedule(loan) {
  const rows = [];
  const monthlyRate = loan.rate / 100 / 12;
  let balance = loan.principal;
  const start = new Date(loan.startDate);
  for (let i = 1; i <= loan.termMonths; i++) {
    const interest = balance * monthlyRate;
    const principal = loan.monthlyPayment - interest;
    balance = Math.max(0, balance - principal);
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    rows.push({ month: i, date: d.toISOString().split("T")[0], principal: Math.round(principal), interest: Math.round(interest), payment: loan.monthlyPayment, balance: Math.round(balance) });
  }
  return rows;
}

// ─── Style Helpers ────────────────────────────────────────────────────────────
const ss = {
  card: { background: C.white, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: `1px solid ${C.gray200}`, padding: 24, marginBottom: 20 },
  badge: (color, bg) => ({ background: bg, color: color, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, display: "inline-block" }),
  btn: (primary = true) => ({
    background: primary ? C.orange : C.white,
    color: primary ? C.white : C.navy,
    border: primary ? "none" : `1.5px solid ${C.navy}`,
    borderRadius: 8,
    padding: "8px 18px",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    transition: "all .15s",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  }),
  input: { border: `1.5px solid ${C.gray300}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, width: "100%", outline: "none", background: C.white, color: C.navy, boxSizing: "border-box" },
  label: { fontSize: 12, fontWeight: 700, color: C.gray600, marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: 0.5 },
  th: { padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 800, color: C.white, background: C.navy, textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap" },
  td: { padding: "10px 14px", fontSize: 13, borderBottom: `1px solid ${C.gray100}`, color: C.gray800 },
};

// ─── Components ───────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, currentUser }) {
  const nav = [
    { id: "dashboard", label: "Tableau de bord", icon: "📊" },
    { id: "transactions", label: "Flux de trésorerie", icon: "💸" },
    { id: "accounts", label: "Comptes & Banques", icon: "🏦" },
    { id: "receivables", label: "Créances clients", icon: "📥" },
    { id: "payables", label: "Dettes fournisseurs", icon: "📤" },
    { id: "moratoria", label: "Moratoires", icon: "🤝" },
    { id: "loans", label: "Prêts & Amortissements", icon: "📋" },
    { id: "forecast", label: "Prévisions 13 semaines", icon: "📈" },
    { id: "users", label: "Gestion utilisateurs", icon: "👥", adminOnly: true },
  ];
  return (
    <div style={{ width: 240, background: C.navy, minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: C.orange, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: C.white }}>T</div>
          <div>
            <div style={{ color: C.white, fontWeight: 800, fontSize: 15, letterSpacing: 0.5 }}>TrésoFlow</div>
            <div style={{ color: `rgba(255,255,255,0.5)`, fontSize: 10, fontWeight: 600, letterSpacing: 1 }}>IFC STANDARDS</div>
          </div>
        </div>
      </div>
      {/* Entity badge */}
      <div style={{ padding: "12px 20px", borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
        <div style={{ background: "rgba(245,130,31,0.15)", borderRadius: 8, padding: "8px 12px" }}>
          <div style={{ color: C.orangeLight, fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>ENTITÉ</div>
          <div style={{ color: C.white, fontSize: 13, fontWeight: 700 }}>{currentUser.entity}</div>
          <div style={{ color: `rgba(255,255,255,0.5)`, fontSize: 11 }}>{currentUser.role}</div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 0" }}>
        {nav.filter((n) => !n.adminOnly || currentUser.role === "admin").map((n) => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 20px", background: page === n.id ? "rgba(245,130,31,0.2)" : "transparent",
              border: "none", cursor: "pointer", color: page === n.id ? C.orange : "rgba(255,255,255,0.7)",
              fontSize: 13, fontWeight: page === n.id ? 700 : 500, textAlign: "left",
              borderLeft: page === n.id ? `3px solid ${C.orange}` : "3px solid transparent",
              transition: "all .15s",
            }}
          >
            <span>{n.icon}</span> {n.label}
          </button>
        ))}
      </nav>
      {/* User */}
      <div style={{ padding: "16px 20px", borderTop: `1px solid rgba(255,255,255,0.1)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: C.teal, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: C.white }}>{currentUser.name[0]}</div>
          <div>
            <div style={{ color: C.white, fontSize: 12, fontWeight: 700 }}>{currentUser.name}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>{currentUser.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, color = C.navy, icon, trend }) {
  return (
    <div style={{ ...ss.card, padding: 20, marginBottom: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.gray500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
          {sub && <div style={{ fontSize: 11, color: C.gray500, marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 28 }}>{icon}</div>
      </div>
      {trend !== undefined && (
        <div style={{ marginTop: 12, padding: "4px 8px", borderRadius: 6, background: trend >= 0 ? C.greenLight : C.redLight, display: "inline-block", fontSize: 11, fontWeight: 700, color: trend >= 0 ? C.green : C.red }}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs mois dernier
        </div>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: C.white, borderRadius: 16, width: 600, maxWidth: "90vw", maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${C.gray200}` }}>
          <h3 style={{ margin: 0, color: C.navy, fontSize: 16, fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.gray500 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={ss.label}>{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...ss.input }}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (<option key={o.value || o} value={o.value || o}>{o.label || o}</option>))}
    </select>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function Dashboard({ transactions, accounts, receivables, payables, moratoria, loans, currentUser }) {
  const filteredAccounts = currentUser.role === "admin" ? accounts : accounts.filter((a) => a.entity === currentUser.entity);
  const totalCash = filteredAccounts.reduce((s, a) => s + (a.currency === "EUR" ? a.balance : 0), 0);
  const filteredTx = currentUser.role === "admin" ? transactions : transactions.filter((t) => t.entity === currentUser.entity);
  const encaissements = filteredTx.filter((t) => t.type === "encaissement").reduce((s, t) => s + (t.currency === "EUR" ? t.amount : 0), 0);
  const decaissements = filteredTx.filter((t) => t.type === "decaissement").reduce((s, t) => s + (t.currency === "EUR" ? t.amount : 0), 0);
  const overdueReceivables = receivables.filter((r) => r.status === "en retard").reduce((s, r) => s + r.amount, 0);
  const urgentPayables = payables.filter((p) => p.priority === "urgent").reduce((s, p) => s + p.amount, 0);
  const totalLoanBalance = loans.reduce((s, l) => s + (l.currency === "EUR" ? l.remainingBalance : 0), 0);

  // Monthly cash flow mock data
  const months = ["Oct", "Nov", "Déc", "Jan", "Fév", "Mar"];
  const cashData = [1800000, 2100000, 1950000, 2200000, 2350000, totalCash];
  const maxBar = Math.max(...cashData);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: C.navy, fontSize: 22, fontWeight: 900 }}>Tableau de bord</h2>
        <p style={{ color: C.gray500, fontSize: 13, margin: "4px 0 0" }}>Vue consolidée • {currentUser.entity} • {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <KpiCard label="Trésorerie totale (EUR)" value={fmt(totalCash)} sub={`${filteredAccounts.length} comptes actifs`} icon="💰" color={C.navy} trend={4.2} />
        <KpiCard label="Encaissements (mois)" value={fmt(encaissements)} sub="Mars 2025" icon="📥" color={C.green} trend={12.1} />
        <KpiCard label="Décaissements (mois)" value={fmt(decaissements)} sub="Mars 2025" icon="📤" color={C.red} trend={-3.5} />
        <KpiCard label="Créances en retard" value={fmt(overdueReceivables)} sub="Nécessite action" icon="⚠️" color={C.amber} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Cash flow chart */}
        <div style={ss.card}>
          <div style={{ fontWeight: 800, color: C.navy, fontSize: 15, marginBottom: 16 }}>Évolution de la trésorerie (6 mois)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
            {cashData.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 9, color: C.gray500, fontWeight: 700 }}>{fmtNum(v / 1000)}K</div>
                <div style={{ width: "100%", background: i === cashData.length - 1 ? C.orange : C.navyLight, borderRadius: "4px 4px 0 0", height: (v / maxBar) * 130, minHeight: 8, transition: "height .3s" }} />
                <div style={{ fontSize: 10, color: C.gray600, fontWeight: 600 }}>{months[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div style={ss.card}>
          <div style={{ fontWeight: 800, color: C.navy, fontSize: 15, marginBottom: 16 }}>Alertes & Actions</div>
          {[
            { icon: "🔴", text: `${receivables.filter((r) => r.status === "en retard").length} créances en retard`, color: C.red, bg: C.redLight },
            { icon: "🟠", text: `${payables.filter((p) => p.priority === "urgent").length} paiements urgents`, color: C.amber, bg: C.amberLight },
            { icon: "🟡", text: `${moratoria.length} moratoires actifs`, color: C.blue, bg: C.blueLight },
            { icon: "🟢", text: `${loans.length} prêts en cours`, color: C.green, bg: C.greenLight },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: a.bg, borderRadius: 8, marginBottom: 8, border: `1px solid ${a.color}22` }}>
              <span>{a.icon}</span>
              <span style={{ fontSize: 12, color: a.color, fontWeight: 700 }}>{a.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accounts summary */}
      <div style={ss.card}>
        <div style={{ fontWeight: 800, color: C.navy, fontSize: 15, marginBottom: 16 }}>Positions par compte</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Entité", "Banque", "N° Compte", "Devise", "Solde", "Type"].map((h) => <th key={h} style={ss.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filteredAccounts.map((a, i) => (
              <tr key={a.id} style={{ background: i % 2 === 0 ? C.gray50 : C.white }}>
                <td style={ss.td}><span style={ss.badge(C.navyLight, C.blueLight)}>{a.entity}</span></td>
                <td style={ss.td}>{a.bank}</td>
                <td style={{ ...ss.td, fontFamily: "monospace", fontSize: 11 }}>{a.number}</td>
                <td style={ss.td}>{a.currency}</td>
                <td style={{ ...ss.td, fontWeight: 800, color: a.balance > 0 ? C.green : C.red }}>{fmtNum(a.balance)} {a.currency}</td>
                <td style={ss.td}><span style={ss.badge(C.teal, "#E0F7FA")}>{a.type}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Transactions({ transactions, setTransactions, accounts, currentUser }) {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState({ type: "", entity: "", search: "" });
  const [form, setForm] = useState({ date: today(), entity: currentUser.entity, accountId: "", type: "encaissement", category: "Client", counterpart: "", amount: "", currency: "EUR", reference: "", note: "" });

  const filtered = transactions.filter((t) => {
    if (currentUser.role !== "admin" && t.entity !== currentUser.entity) return false;
    if (filter.type && t.type !== filter.type) return false;
    if (filter.entity && t.entity !== filter.entity) return false;
    if (filter.search && !JSON.stringify(t).toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const save = () => {
    if (!form.amount || !form.counterpart || !form.accountId) return;
    setTransactions([...transactions, { ...form, id: genId(transactions), amount: parseFloat(form.amount), status: "validé" }]);
    setShowModal(false);
  };

  const userAccounts = accounts.filter((a) => currentUser.role === "admin" || a.entity === currentUser.entity);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: C.navy, fontSize: 22, fontWeight: 900 }}>Flux de trésorerie</h2>
          <p style={{ color: C.gray500, fontSize: 13, margin: "4px 0 0" }}>Encaissements & Décaissements</p>
        </div>
        <button style={ss.btn()} onClick={() => setShowModal(true)}>+ Nouvelle opération</button>
      </div>

      {/* Filters */}
      <div style={{ ...ss.card, padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1 }}><input style={ss.input} placeholder="🔍 Rechercher..." value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} /></div>
        <Select value={filter.type} onChange={(v) => setFilter({ ...filter, type: v })} options={[{ value: "", label: "Tous types" }, { value: "encaissement", label: "Encaissements" }, { value: "decaissement", label: "Décaissements" }]} />
        {currentUser.role === "admin" && <Select value={filter.entity} onChange={(v) => setFilter({ ...filter, entity: v })} options={[{ value: "", label: "Toutes entités" }, ...ENTITIES.map((e) => ({ value: e, label: e }))]} />}
      </div>

      <div style={ss.card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Date", "Entité", "Type", "Catégorie", "Contrepartie", "Montant", "Référence", "Statut"].map((h) => <th key={h} style={ss.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={8} style={{ ...ss.td, textAlign: "center", color: C.gray400 }}>Aucune opération</td></tr>}
            {filtered.map((t, i) => (
              <tr key={t.id} style={{ background: i % 2 === 0 ? C.gray50 : C.white }}>
                <td style={{ ...ss.td, fontWeight: 700 }}>{t.date}</td>
                <td style={ss.td}><span style={ss.badge(C.navyLight, C.blueLight)}>{t.entity}</span></td>
                <td style={ss.td}>
                  <span style={ss.badge(t.type === "encaissement" ? C.green : C.red, t.type === "encaissement" ? C.greenLight : C.redLight)}>
                    {t.type === "encaissement" ? "▲ Enc." : "▼ Déc."}
                  </span>
                </td>
                <td style={ss.td}>{t.category}</td>
                <td style={ss.td}>{t.counterpart}</td>
                <td style={{ ...ss.td, fontWeight: 800, color: t.type === "encaissement" ? C.green : C.red }}>{t.type === "encaissement" ? "+" : "-"}{fmtNum(t.amount)} {t.currency}</td>
                <td style={{ ...ss.td, fontFamily: "monospace", fontSize: 11 }}>{t.reference}</td>
                <td style={ss.td}><span style={ss.badge(t.status === "validé" ? C.green : C.amber, t.status === "validé" ? C.greenLight : C.amberLight)}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Nouvelle opération" onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Date"><input type="date" style={ss.input} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></FormField>
            {currentUser.role === "admin" && <FormField label="Entité"><Select value={form.entity} onChange={(v) => setForm({ ...form, entity: v, accountId: "" })} options={ENTITIES} /></FormField>}
            <FormField label="Compte bancaire">
              <Select value={form.accountId} onChange={(v) => setForm({ ...form, accountId: parseInt(v) })} placeholder="Sélectionner..." options={userAccounts.filter((a) => currentUser.role === "admin" ? a.entity === form.entity : true).map((a) => ({ value: a.id, label: `${a.bank} - ${a.number}` }))} />
            </FormField>
            <FormField label="Type">
              <Select value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={[{ value: "encaissement", label: "Encaissement" }, { value: "decaissement", label: "Décaissement" }]} />
            </FormField>
            <FormField label="Catégorie">
              <Select value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={["Client", "Fournisseur", "Interco", "Moratoire", "Prêt", "Loyer", "Fiscal", "Social", "Autre"]} />
            </FormField>
            <FormField label="Contrepartie"><input style={ss.input} value={form.counterpart} onChange={(e) => setForm({ ...form, counterpart: e.target.value })} placeholder="Nom client / fournisseur" /></FormField>
            <FormField label="Montant"><input type="number" style={ss.input} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" /></FormField>
            <FormField label="Devise">
              <Select value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} options={["EUR", "MAD", "USD", "EGP", "XOF"]} />
            </FormField>
            <FormField label="Référence"><input style={ss.input} value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="N° facture / ref" /></FormField>
            <FormField label="Note"><input style={ss.input} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Commentaire optionnel" /></FormField>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button style={ss.btn(false)} onClick={() => setShowModal(false)}>Annuler</button>
            <button style={ss.btn()} onClick={save}>Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Receivables({ receivables, setReceivables, currentUser }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ entity: currentUser.entity, client: "", invoice: "", amount: "", currency: "EUR", dueDate: "", status: "en cours", daysOverdue: 0 });

  const data = currentUser.role === "admin" ? receivables : receivables.filter((r) => r.entity === currentUser.entity);

  const save = () => {
    setReceivables([...receivables, { ...form, id: genId(receivables), amount: parseFloat(form.amount), daysOverdue: parseInt(form.daysOverdue) }]);
    setShowModal(false);
  };

  const total = data.reduce((s, r) => s + r.amount, 0);
  const overdue = data.filter((r) => r.status === "en retard").reduce((s, r) => s + r.amount, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: C.navy, fontSize: 22, fontWeight: 900 }}>Créances clients</h2>
          <p style={{ color: C.gray500, fontSize: 13, margin: "4px 0 0" }}>Suivi des échéances clients • {fmt(total)} total • {fmt(overdue)} en retard</p>
        </div>
        <button style={ss.btn()} onClick={() => setShowModal(true)}>+ Ajouter créance</button>
      </div>

      {/* Aging buckets */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "À échoir", filter: (r) => r.daysOverdue === 0, color: C.green },
          { label: "1-30 jours", filter: (r) => r.daysOverdue > 0 && r.daysOverdue <= 30, color: C.amber },
          { label: "31-60 jours", filter: (r) => r.daysOverdue > 30 && r.daysOverdue <= 60, color: C.orange },
          { label: "> 60 jours", filter: (r) => r.daysOverdue > 60, color: C.red },
        ].map((b) => {
          const items = data.filter(b.filter);
          const val = items.reduce((s, r) => s + r.amount, 0);
          return (
            <div key={b.label} style={{ ...ss.card, marginBottom: 0, borderTop: `3px solid ${b.color}`, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.gray500, textTransform: "uppercase", letterSpacing: 0.8 }}>{b.label}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: b.color, marginTop: 4 }}>{fmt(val)}</div>
              <div style={{ fontSize: 11, color: C.gray400 }}>{items.length} facture(s)</div>
            </div>
          );
        })}
      </div>

      <div style={ss.card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Entité", "Client", "Facture", "Montant", "Devise", "Échéance", "Jours retard", "Statut"].map((h) => <th key={h} style={ss.th}>{h}</th>)}</tr></thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? C.gray50 : C.white }}>
                <td style={ss.td}><span style={ss.badge(C.navyLight, C.blueLight)}>{r.entity}</span></td>
                <td style={{ ...ss.td, fontWeight: 700 }}>{r.client}</td>
                <td style={{ ...ss.td, fontFamily: "monospace", fontSize: 11 }}>{r.invoice}</td>
                <td style={{ ...ss.td, fontWeight: 800 }}>{fmtNum(r.amount)}</td>
                <td style={ss.td}>{r.currency}</td>
                <td style={ss.td}>{r.dueDate}</td>
                <td style={ss.td}><span style={{ ...ss.badge(r.daysOverdue > 0 ? C.red : C.green, r.daysOverdue > 0 ? C.redLight : C.greenLight) }}>{r.daysOverdue > 0 ? `+${r.daysOverdue}j` : "OK"}</span></td>
                <td style={ss.td}><span style={ss.badge(r.status === "en retard" ? C.red : C.green, r.status === "en retard" ? C.redLight : C.greenLight)}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Ajouter une créance client" onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {currentUser.role === "admin" && <FormField label="Entité"><Select value={form.entity} onChange={(v) => setForm({ ...form, entity: v })} options={ENTITIES} /></FormField>}
            <FormField label="Client"><input style={ss.input} value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></FormField>
            <FormField label="N° Facture"><input style={ss.input} value={form.invoice} onChange={(e) => setForm({ ...form, invoice: e.target.value })} /></FormField>
            <FormField label="Montant"><input type="number" style={ss.input} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></FormField>
            <FormField label="Devise"><Select value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} options={["EUR", "MAD", "USD", "EGP"]} /></FormField>
            <FormField label="Date d'échéance"><input type="date" style={ss.input} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></FormField>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button style={ss.btn(false)} onClick={() => setShowModal(false)}>Annuler</button>
            <button style={ss.btn()} onClick={save}>Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Payables({ payables, setPayables, currentUser }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ entity: currentUser.entity, supplier: "", invoice: "", amount: "", currency: "EUR", dueDate: "", status: "à payer", priority: "normal" });

  const data = currentUser.role === "admin" ? payables : payables.filter((p) => p.entity === currentUser.entity);

  const save = () => {
    setPayables([...payables, { ...form, id: genId(payables), amount: parseFloat(form.amount) }]);
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: C.navy, fontSize: 22, fontWeight: 900 }}>Dettes fournisseurs</h2>
          <p style={{ color: C.gray500, fontSize: 13, margin: "4px 0 0" }}>Suivi des échéances fournisseurs</p>
        </div>
        <button style={ss.btn()} onClick={() => setShowModal(true)}>+ Ajouter dette</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <KpiCard label="Total à payer" value={fmt(data.reduce((s, p) => s + p.amount, 0))} icon="📤" color={C.navy} />
        <KpiCard label="Paiements urgents" value={fmt(data.filter((p) => p.priority === "urgent").reduce((s, p) => s + p.amount, 0))} icon="🚨" color={C.red} />
        <KpiCard label="Paiements normaux" value={fmt(data.filter((p) => p.priority === "normal").reduce((s, p) => s + p.amount, 0))} icon="📋" color={C.blue} />
      </div>

      <div style={ss.card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Entité", "Fournisseur", "Facture", "Montant", "Devise", "Échéance", "Priorité", "Statut"].map((h) => <th key={h} style={ss.th}>{h}</th>)}</tr></thead>
          <tbody>
            {data.map((p, i) => (
              <tr key={p.id} style={{ background: i % 2 === 0 ? C.gray50 : C.white }}>
                <td style={ss.td}><span style={ss.badge(C.navyLight, C.blueLight)}>{p.entity}</span></td>
                <td style={{ ...ss.td, fontWeight: 700 }}>{p.supplier}</td>
                <td style={{ ...ss.td, fontFamily: "monospace", fontSize: 11 }}>{p.invoice}</td>
                <td style={{ ...ss.td, fontWeight: 800 }}>{fmtNum(p.amount)}</td>
                <td style={ss.td}>{p.currency}</td>
                <td style={ss.td}>{p.dueDate}</td>
                <td style={ss.td}><span style={ss.badge(p.priority === "urgent" ? C.red : C.blue, p.priority === "urgent" ? C.redLight : C.blueLight)}>{p.priority}</span></td>
                <td style={ss.td}><span style={ss.badge(C.amber, C.amberLight)}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Ajouter une dette fournisseur" onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {currentUser.role === "admin" && <FormField label="Entité"><Select value={form.entity} onChange={(v) => setForm({ ...form, entity: v })} options={ENTITIES} /></FormField>}
            <FormField label="Fournisseur"><input style={ss.input} value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} /></FormField>
            <FormField label="N° Facture"><input style={ss.input} value={form.invoice} onChange={(e) => setForm({ ...form, invoice: e.target.value })} /></FormField>
            <FormField label="Montant"><input type="number" style={ss.input} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></FormField>
            <FormField label="Devise"><Select value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} options={["EUR", "MAD", "USD"]} /></FormField>
            <FormField label="Date d'échéance"><input type="date" style={ss.input} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></FormField>
            <FormField label="Priorité"><Select value={form.priority} onChange={(v) => setForm({ ...form, priority: v })} options={[{ value: "normal", label: "Normal" }, { value: "urgent", label: "Urgent" }]} /></FormField>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button style={ss.btn(false)} onClick={() => setShowModal(false)}>Annuler</button>
            <button style={ss.btn()} onClick={save}>Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Moratoria({ moratoria, setMoratoria, currentUser }) {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ entity: currentUser.entity, creditor: "", type: "Moratoire fiscal", totalAmount: "", currency: "EUR", startDate: "", endDate: "", installments: "", paidInstallments: 0, monthlyAmount: "", nextDueDate: "", status: "actif" });

  const data = currentUser.role === "admin" ? moratoria : moratoria.filter((m) => m.entity === currentUser.entity);

  const save = () => {
    setMoratoria([...moratoria, { ...form, id: genId(moratoria), totalAmount: parseFloat(form.totalAmount), installments: parseInt(form.installments), monthlyAmount: parseFloat(form.monthlyAmount) }]);
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: C.navy, fontSize: 22, fontWeight: 900 }}>Moratoires</h2>
          <p style={{ color: C.gray500, fontSize: 13, margin: "4px 0 0" }}>Suivi des moratoires obtenus (fiscal, social, bancaire)</p>
        </div>
        <button style={ss.btn()} onClick={() => setShowModal(true)}>+ Ajouter moratoire</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <KpiCard label="Encours total" value={fmt(data.reduce((s, m) => s + m.totalAmount, 0))} icon="🤝" color={C.navy} />
        <KpiCard label="Remboursé" value={fmt(data.reduce((s, m) => s + m.paidInstallments * m.monthlyAmount, 0))} icon="✅" color={C.green} />
        <KpiCard label="Restant à payer" value={fmt(data.reduce((s, m) => s + (m.installments - m.paidInstallments) * m.monthlyAmount, 0))} icon="⏳" color={C.amber} />
      </div>

      {data.map((m) => {
        const pct = Math.round((m.paidInstallments / m.installments) * 100);
        const remaining = m.installments - m.paidInstallments;
        return (
          <div key={m.id} style={ss.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 16, color: C.navy }}>{m.creditor}</span>
                  <span style={ss.badge(C.teal, "#E0F7FA")}>{m.type}</span>
                  <span style={ss.badge(C.navyLight, C.blueLight)}>{m.entity}</span>
                </div>
                <div style={{ color: C.gray500, fontSize: 12, marginTop: 4 }}>
                  Du {m.startDate} au {m.endDate} • Prochaine échéance: <strong style={{ color: C.orange }}>{m.nextDueDate}</strong>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: C.navy }}>{fmt(m.totalAmount, m.currency)}</div>
                <div style={{ fontSize: 11, color: C.gray500 }}>{fmt(m.monthlyAmount, m.currency)} / mois</div>
              </div>
            </div>
            {/* Progress */}
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.gray500, marginBottom: 4 }}>
                  <span>{m.paidInstallments} échéances payées</span>
                  <span>{remaining} restantes</span>
                </div>
                <div style={{ height: 8, background: C.gray200, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct > 66 ? C.green : pct > 33 ? C.orange : C.red, borderRadius: 4, transition: "width .3s" }} />
                </div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: C.orange, width: 50, textAlign: "right" }}>{pct}%</div>
            </div>
          </div>
        );
      })}

      {showModal && (
        <Modal title="Ajouter un moratoire" onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {currentUser.role === "admin" && <FormField label="Entité"><Select value={form.entity} onChange={(v) => setForm({ ...form, entity: v })} options={ENTITIES} /></FormField>}
            <FormField label="Créancier"><input style={ss.input} value={form.creditor} onChange={(e) => setForm({ ...form, creditor: e.target.value })} /></FormField>
            <FormField label="Type"><Select value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={["Moratoire fiscal", "Moratoire social", "Moratoire TVA", "Moratoire bancaire", "Autre"]} /></FormField>
            <FormField label="Montant total"><input type="number" style={ss.input} value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} /></FormField>
            <FormField label="Montant mensuel"><input type="number" style={ss.input} value={form.monthlyAmount} onChange={(e) => setForm({ ...form, monthlyAmount: e.target.value })} /></FormField>
            <FormField label="Nb échéances"><input type="number" style={ss.input} value={form.installments} onChange={(e) => setForm({ ...form, installments: e.target.value })} /></FormField>
            <FormField label="Date début"><input type="date" style={ss.input} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></FormField>
            <FormField label="Date fin"><input type="date" style={ss.input} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></FormField>
            <FormField label="Prochaine échéance"><input type="date" style={ss.input} value={form.nextDueDate} onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })} /></FormField>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button style={ss.btn(false)} onClick={() => setShowModal(false)}>Annuler</button>
            <button style={ss.btn()} onClick={save}>Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Loans({ loans, setLoans, currentUser }) {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ entity: currentUser.entity, lender: "", purpose: "", principal: "", currency: "EUR", rate: "", startDate: "", endDate: "", termMonths: "", remainingBalance: "", monthlyPayment: "", nextPaymentDate: "", type: "amortissable" });

  const data = currentUser.role === "admin" ? loans : loans.filter((l) => l.entity === currentUser.entity);
  const schedule = selected ? amortizationSchedule(selected) : [];

  const save = () => {
    const l = { ...form, id: genId(loans), principal: parseFloat(form.principal), rate: parseFloat(form.rate), termMonths: parseInt(form.termMonths), remainingBalance: parseFloat(form.remainingBalance), monthlyPayment: parseFloat(form.monthlyPayment) };
    setLoans([...loans, l]);
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: C.navy, fontSize: 22, fontWeight: 900 }}>Prêts & Tableaux d'amortissement</h2>
          <p style={{ color: C.gray500, fontSize: 13, margin: "4px 0 0" }}>Vue consolidée de l'endettement</p>
        </div>
        <button style={ss.btn()} onClick={() => setShowModal(true)}>+ Ajouter prêt</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        <KpiCard label="Encours total EUR" value={fmt(data.filter(l=>l.currency==="EUR").reduce((s, l) => s + l.remainingBalance, 0))} icon="🏦" color={C.navy} />
        <KpiCard label="Nb de prêts" value={data.length} icon="📋" color={C.teal} />
        <KpiCard label="Mensualités totales EUR" value={fmt(data.filter(l=>l.currency==="EUR").reduce((s, l) => s + l.monthlyPayment, 0))} icon="📅" color={C.orange} />
        <KpiCard label="Taux moyen" value={`${(data.reduce((s, l) => s + l.rate, 0) / data.length).toFixed(2)}%`} icon="%" color={C.blue} />
      </div>

      {/* Loans list */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {data.map((l) => {
          const pct = Math.round(((l.principal - l.remainingBalance) / l.principal) * 100);
          return (
            <div key={l.id} style={{ ...ss.card, cursor: "pointer", border: selected?.id === l.id ? `2px solid ${C.orange}` : `1px solid ${C.gray200}`, marginBottom: 0 }} onClick={() => setSelected(selected?.id === l.id ? null : l)}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: C.navy }}>{l.lender}</div>
                  <div style={{ color: C.gray500, fontSize: 12 }}>{l.purpose} • {l.entity} • {l.rate}% • {l.currency}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: C.navy }}>{fmtNum(l.remainingBalance)}</div>
                  <div style={{ fontSize: 11, color: C.gray500 }}>{l.currency} restant</div>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.gray500, marginBottom: 4 }}>
                  <span>Remboursé: {pct}%</span>
                  <span>Mensualité: {fmtNum(l.monthlyPayment)} {l.currency}</span>
                </div>
                <div style={{ height: 6, background: C.gray200, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: C.teal, borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: C.orange, fontWeight: 700 }}>
                Prochaine échéance: {l.nextPaymentDate} • Fin: {l.endDate}
              </div>
            </div>
          );
        })}
      </div>

      {/* Amortization table */}
      {selected && (
        <div style={ss.card}>
          <div style={{ fontWeight: 800, color: C.navy, fontSize: 15, marginBottom: 12 }}>
            Tableau d'amortissement — {selected.lender} ({selected.entity})
          </div>
          <div style={{ maxHeight: 350, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0 }}>
                <tr>{["Mois", "Date", "Capital remboursé", "Intérêts", "Mensualité", "Capital restant"].map((h) => <th key={h} style={ss.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {schedule.slice(0, 60).map((r, i) => (
                  <tr key={r.month} style={{ background: i % 2 === 0 ? C.gray50 : C.white }}>
                    <td style={{ ...ss.td, fontWeight: 700 }}>{r.month}</td>
                    <td style={ss.td}>{r.date}</td>
                    <td style={{ ...ss.td, color: C.teal, fontWeight: 700 }}>{fmtNum(r.principal)}</td>
                    <td style={{ ...ss.td, color: C.red }}>{fmtNum(r.interest)}</td>
                    <td style={{ ...ss.td, fontWeight: 800 }}>{fmtNum(r.payment)}</td>
                    <td style={{ ...ss.td, fontWeight: 700, color: C.navy }}>{fmtNum(r.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {schedule.length > 60 && <div style={{ textAlign: "center", padding: 8, fontSize: 12, color: C.gray400 }}>Affichage des 60 premières lignes sur {schedule.length}</div>}
        </div>
      )}

      {showModal && (
        <Modal title="Ajouter un prêt" onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {currentUser.role === "admin" && <FormField label="Entité"><Select value={form.entity} onChange={(v) => setForm({ ...form, entity: v })} options={ENTITIES} /></FormField>}
            <FormField label="Prêteur"><input style={ss.input} value={form.lender} onChange={(e) => setForm({ ...form, lender: e.target.value })} /></FormField>
            <FormField label="Objet"><input style={ss.input} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} /></FormField>
            <FormField label="Capital initial"><input type="number" style={ss.input} value={form.principal} onChange={(e) => setForm({ ...form, principal: e.target.value })} /></FormField>
            <FormField label="Taux (%)"><input type="number" style={ss.input} step="0.1" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} /></FormField>
            <FormField label="Durée (mois)"><input type="number" style={ss.input} value={form.termMonths} onChange={(e) => setForm({ ...form, termMonths: e.target.value })} /></FormField>
            <FormField label="Capital restant"><input type="number" style={ss.input} value={form.remainingBalance} onChange={(e) => setForm({ ...form, remainingBalance: e.target.value })} /></FormField>
            <FormField label="Mensualité"><input type="number" style={ss.input} value={form.monthlyPayment} onChange={(e) => setForm({ ...form, monthlyPayment: e.target.value })} /></FormField>
            <FormField label="Date début"><input type="date" style={ss.input} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></FormField>
            <FormField label="Date fin"><input type="date" style={ss.input} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></FormField>
            <FormField label="Prochaine échéance"><input type="date" style={ss.input} value={form.nextPaymentDate} onChange={(e) => setForm({ ...form, nextPaymentDate: e.target.value })} /></FormField>
            <FormField label="Devise"><Select value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} options={["EUR", "MAD", "USD"]} /></FormField>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button style={ss.btn(false)} onClick={() => setShowModal(false)}>Annuler</button>
            <button style={ss.btn()} onClick={save}>Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Forecast({ transactions, receivables, payables, moratoria, loans, accounts, currentUser }) {
  const weeks = Array.from({ length: 13 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i * 7);
    return `S${i + 1} ${d.getDate()}/${d.getMonth() + 1}`;
  });

  const data = currentUser.role === "admin" ? accounts : accounts.filter((a) => a.entity === currentUser.entity);
  const initCash = data.filter((a) => a.currency === "EUR").reduce((s, a) => s + a.balance, 0);

  const weeklyInflows = weeks.map((_, i) => 80000 + Math.random() * 60000 * (i % 3 === 0 ? 2 : 1));
  const weeklyOutflows = weeks.map((_, i) => 55000 + Math.random() * 40000);
  let cumulative = initCash;
  const cumulData = weeks.map((_, i) => {
    cumulative += weeklyInflows[i] - weeklyOutflows[i];
    return Math.round(cumulative);
  });
  const maxVal = Math.max(...weeklyInflows, ...weeklyOutflows);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: C.navy, fontSize: 22, fontWeight: 900 }}>Prévisions de trésorerie — 13 semaines</h2>
        <p style={{ color: C.gray500, fontSize: 13, margin: "4px 0 0" }}>Standard IFC • Outil de pilotage court terme</p>
      </div>

      <div style={{ ...ss.card, padding: 24 }}>
        <div style={{ fontWeight: 800, color: C.navy, marginBottom: 16 }}>Flux hebdomadaires prévisionnels</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ ...ss.th, width: 120 }}>Semaine</th>
                {weeks.map((w) => <th key={w} style={{ ...ss.th, textAlign: "right", fontSize: 10 }}>{w}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...ss.td, fontWeight: 700, color: C.green }}>Encaissements</td>
                {weeklyInflows.map((v, i) => <td key={i} style={{ ...ss.td, textAlign: "right", color: C.green, fontWeight: 700 }}>{fmtNum(Math.round(v))}</td>)}
              </tr>
              <tr style={{ background: C.gray50 }}>
                <td style={{ ...ss.td, fontWeight: 700, color: C.red }}>Décaissements</td>
                {weeklyOutflows.map((v, i) => <td key={i} style={{ ...ss.td, textAlign: "right", color: C.red, fontWeight: 700 }}>{fmtNum(Math.round(v))}</td>)}
              </tr>
              <tr>
                <td style={{ ...ss.td, fontWeight: 800, color: C.navy }}>Flux net</td>
                {weeklyInflows.map((v, i) => {
                  const net = Math.round(v - weeklyOutflows[i]);
                  return <td key={i} style={{ ...ss.td, textAlign: "right", fontWeight: 800, color: net >= 0 ? C.teal : C.red }}>{net >= 0 ? "+" : ""}{fmtNum(net)}</td>;
                })}
              </tr>
              <tr style={{ background: C.navy }}>
                <td style={{ ...ss.td, color: C.white, fontWeight: 800 }}>Trésorerie cumulée</td>
                {cumulData.map((v, i) => <td key={i} style={{ ...ss.td, textAlign: "right", color: v < 0 ? "#FF8A80" : C.orange, fontWeight: 900, background: C.navy }}>{fmtNum(v)}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar chart */}
      <div style={ss.card}>
        <div style={{ fontWeight: 800, color: C.navy, marginBottom: 16 }}>Visualisation des flux</div>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 180, overflowX: "auto" }}>
          {weeks.map((w, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 60 }}>
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 150 }}>
                <div style={{ width: 22, background: C.green, borderRadius: "3px 3px 0 0", height: (weeklyInflows[i] / maxVal) * 140, opacity: 0.85 }} title="Encaissement" />
                <div style={{ width: 22, background: C.red, borderRadius: "3px 3px 0 0", height: (weeklyOutflows[i] / maxVal) * 140, opacity: 0.85 }} title="Décaissement" />
              </div>
              <div style={{ fontSize: 9, color: C.gray500, fontWeight: 700 }}>{w}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, fontWeight: 700 }}>
          <span><span style={{ display: "inline-block", width: 12, height: 12, background: C.green, borderRadius: 2, marginRight: 4 }} />Encaissements</span>
          <span><span style={{ display: "inline-block", width: 12, height: 12, background: C.red, borderRadius: 2, marginRight: 4 }} />Décaissements</span>
        </div>
      </div>
    </div>
  );
}

function Accounts({ accounts, setAccounts, currentUser }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ entity: currentUser.entity, bank: "", number: "", currency: "EUR", balance: "", type: "Courant" });

  const data = currentUser.role === "admin" ? accounts : accounts.filter((a) => a.entity === currentUser.entity);

  const save = () => {
    setAccounts([...accounts, { ...form, id: genId(accounts), balance: parseFloat(form.balance) }]);
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: C.navy, fontSize: 22, fontWeight: 900 }}>Comptes & Banques</h2>
          <p style={{ color: C.gray500, fontSize: 13, margin: "4px 0 0" }}>Gestion des comptes bancaires par entité</p>
        </div>
        {(currentUser.role === "admin" || currentUser.role === "manager") && <button style={ss.btn()} onClick={() => setShowModal(true)}>+ Ajouter compte</button>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <KpiCard label="Total EUR" value={fmt(data.filter(a=>a.currency==="EUR").reduce((s,a)=>s+a.balance,0))} icon="💶" color={C.navy} />
        <KpiCard label="Comptes actifs" value={data.length} icon="🏦" color={C.teal} />
        <KpiCard label="Banques partenaires" value={[...new Set(data.map(a=>a.bank))].length} icon="🤝" color={C.blue} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 16 }}>
        {data.map((a) => (
          <div key={a.id} style={{ ...ss.card, marginBottom: 0, borderTop: `4px solid ${a.balance > 500000 ? C.green : a.balance > 100000 ? C.orange : C.red}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: C.navy }}>{a.bank}</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: C.gray500, marginTop: 2 }}>{a.number}</div>
              </div>
              <span style={ss.badge(C.teal, "#E0F7FA")}>{a.type}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: a.balance > 0 ? C.navy : C.red }}>{fmtNum(a.balance)} <span style={{ fontSize: 14, fontWeight: 600, color: C.gray400 }}>{a.currency}</span></div>
            <div style={{ marginTop: 8 }}><span style={ss.badge(C.navyLight, C.blueLight)}>{a.entity}</span></div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="Ajouter un compte bancaire" onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {currentUser.role === "admin" && <FormField label="Entité"><Select value={form.entity} onChange={(v) => setForm({ ...form, entity: v })} options={ENTITIES} /></FormField>}
            <FormField label="Banque"><Select value={form.bank} onChange={(v) => setForm({ ...form, bank: v })} options={BANKS} /></FormField>
            <FormField label="N° Compte"><input style={ss.input} value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="IBAN ou référence" /></FormField>
            <FormField label="Solde initial"><input type="number" style={ss.input} value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} /></FormField>
            <FormField label="Devise"><Select value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} options={["EUR", "MAD", "USD", "EGP", "XOF"]} /></FormField>
            <FormField label="Type"><Select value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={["Courant", "Dépôt", "Épargne", "Devise"]} /></FormField>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button style={ss.btn(false)} onClick={() => setShowModal(false)}>Annuler</button>
            <button style={ss.btn()} onClick={save}>Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Users({ users, setUsers, currentUser }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "user", entity: ENTITIES[0], active: true });

  if (currentUser.role !== "admin") return (
    <div style={{ textAlign: "center", padding: 60, color: C.gray400 }}>
      <div style={{ fontSize: 48 }}>🔒</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>Accès réservé aux administrateurs</div>
    </div>
  );

  const save = () => {
    setUsers([...users, { ...form, id: genId(users) }]);
    setShowModal(false);
  };

  const toggle = (id) => setUsers(users.map((u) => u.id === id ? { ...u, active: !u.active } : u));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: C.navy, fontSize: 22, fontWeight: 900 }}>Gestion des utilisateurs</h2>
          <p style={{ color: C.gray500, fontSize: 13, margin: "4px 0 0" }}>Droits d'accès par entité et rôle</p>
        </div>
        <button style={ss.btn()} onClick={() => setShowModal(true)}>+ Nouvel utilisateur</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <KpiCard label="Utilisateurs actifs" value={users.filter((u) => u.active).length} icon="👥" color={C.green} />
        <KpiCard label="Administrateurs" value={users.filter((u) => u.role === "admin").length} icon="🔑" color={C.navy} />
        <KpiCard label="Entités couvertes" value={[...new Set(users.map((u) => u.entity))].length} icon="🏢" color={C.teal} />
      </div>

      {/* Role matrix */}
      <div style={{ ...ss.card, marginBottom: 20 }}>
        <div style={{ fontWeight: 800, color: C.navy, marginBottom: 16 }}>Matrice des droits</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Fonctionnalité", "Admin", "Manager", "Utilisateur"].map((h) => <th key={h} style={ss.th}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["Voir toutes les entités", "✅", "✅", "❌"],
              ["Saisir des transactions", "✅", "✅", "✅ (sa filiale)"],
              ["Ajouter des comptes", "✅", "✅", "❌"],
              ["Gérer les utilisateurs", "✅", "❌", "❌"],
              ["Valider les opérations", "✅", "✅", "❌"],
              ["Exporter les données", "✅", "✅", "✅"],
            ].map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? C.gray50 : C.white }}>
                {r.map((c, j) => <td key={j} style={{ ...ss.td, textAlign: j > 0 ? "center" : "left" }}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={ss.card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Nom", "Email", "Entité", "Rôle", "Statut", "Action"].map((h) => <th key={h} style={ss.th}>{h}</th>)}</tr></thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} style={{ background: i % 2 === 0 ? C.gray50 : C.white }}>
                <td style={{ ...ss.td, fontWeight: 700 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: u.role === "admin" ? C.orange : C.teal, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 800, fontSize: 13 }}>{u.name[0]}</div>
                    {u.name}
                  </div>
                </td>
                <td style={{ ...ss.td, color: C.gray500 }}>{u.email}</td>
                <td style={ss.td}><span style={ss.badge(C.navyLight, C.blueLight)}>{u.entity}</span></td>
                <td style={ss.td}>
                  <span style={ss.badge(u.role === "admin" ? C.orange : u.role === "manager" ? C.teal : C.blue, u.role === "admin" ? "#FFF3E0" : u.role === "manager" ? "#E0F7FA" : C.blueLight)}>{u.role}</span>
                </td>
                <td style={ss.td}><span style={ss.badge(u.active ? C.green : C.gray500, u.active ? C.greenLight : C.gray100)}>{u.active ? "Actif" : "Inactif"}</span></td>
                <td style={ss.td}>
                  {u.id !== currentUser.id && (
                    <button onClick={() => toggle(u.id)} style={{ ...ss.btn(!u.active), padding: "4px 12px", fontSize: 11 }}>
                      {u.active ? "Désactiver" : "Activer"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Nouvel utilisateur" onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Nom complet"><input style={ss.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
            <FormField label="Email"><input type="email" style={ss.input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
            <FormField label="Entité"><Select value={form.entity} onChange={(v) => setForm({ ...form, entity: v })} options={ENTITIES} /></FormField>
            <FormField label="Rôle">
              <Select value={form.role} onChange={(v) => setForm({ ...form, role: v })} options={[{ value: "admin", label: "Administrateur" }, { value: "manager", label: "Manager" }, { value: "user", label: "Utilisateur" }]} />
            </FormField>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button style={ss.btn(false)} onClick={() => setShowModal(false)}>Annuler</button>
            <button style={ss.btn()} onClick={save}>Créer utilisateur</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState(1);
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [receivables, setReceivables] = useState(INITIAL_RECEIVABLES);
  const [payables, setPayables] = useState(INITIAL_PAYABLES);
  const [moratoria, setMoratoria] = useState(INITIAL_MORATORIA);
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [showUserSwitch, setShowUserSwitch] = useState(false);

  const currentUser = users.find((u) => u.id === currentUserId);

  const props = { accounts, setAccounts, transactions, setTransactions, receivables, setReceivables, payables, setPayables, moratoria, setMoratoria, loans, setLoans, users, setUsers, currentUser };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard {...props} />;
      case "transactions": return <Transactions {...props} />;
      case "accounts": return <Accounts {...props} />;
      case "receivables": return <Receivables {...props} />;
      case "payables": return <Payables {...props} />;
      case "moratoria": return <Moratoria {...props} />;
      case "loans": return <Loans {...props} />;
      case "forecast": return <Forecast {...props} />;
      case "users": return <Users {...props} />;
      default: return <Dashboard {...props} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.gray100, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Sidebar page={page} setPage={setPage} currentUser={currentUser} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.gray200}`, padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={ss.badge(C.navyLight, C.blueLight)}>IFC Financial Standards</span>
            <span style={ss.badge(C.teal, "#E0F7FA")}>Multi-entités</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: C.gray500 }}>Démo: changer d'utilisateur →</span>
            <div style={{ position: "relative" }}>
              <button style={{ ...ss.btn(false), fontSize: 12 }} onClick={() => setShowUserSwitch(!showUserSwitch)}>
                👤 {currentUser.name} ▼
              </button>
              {showUserSwitch && (
                <div style={{ position: "absolute", right: 0, top: "110%", background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, minWidth: 220, overflow: "hidden" }}>
                  {users.filter((u) => u.active).map((u) => (
                    <button key={u.id} onClick={() => { setCurrentUserId(u.id); setShowUserSwitch(false); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: u.id === currentUserId ? C.blueLight : "transparent", border: "none", cursor: "pointer", fontSize: 13, color: C.navy, textAlign: "left" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: u.role === "admin" ? C.orange : C.teal, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{u.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: C.gray500 }}>{u.entity} · {u.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Main */}
        <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}