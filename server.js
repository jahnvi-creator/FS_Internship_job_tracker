const express = require("express");
const fs = require("fs");
const path = require("path");
const STATUSES = require("./statuses");

const app = express();
const PORT = process.env.PORT || 3000;
const DB = path.join(__dirname, "data", "db.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function load() {
  try {
    const db = JSON.parse(fs.readFileSync(DB, "utf8"));
    return {
      students: Array.isArray(db.students) ? db.students : [],
      applications: Array.isArray(db.applications) ? db.applications : []
    };
  } catch {
    return { students: [], applications: [] };
  }
}
function save(db) {
  fs.mkdirSync(path.dirname(DB), { recursive: true });
  fs.writeFileSync(DB, JSON.stringify(db, null, 2));
}

app.post("/api/register", (req, res) => {
  const name = String(req.body.name || "").trim();
  const rollNo = String(req.body.rollNo || "").trim().toUpperCase();
  if (!name || !rollNo) return res.status(400).json({ error: "All fields are required." });
  const db = load();
  let student = db.students.find(s => s.rollNo === rollNo);
  if (!student) {
    student = { name, rollNo, registeredAt: new Date().toISOString() };
    db.students.push(student);
    save(db);
  }
  res.json({ student });
});

app.get("/api/statuses", (_req, res) => res.json(STATUSES));

app.get("/api/applications/:rollNo", (req, res) => {
  const rollNo = String(req.params.rollNo).trim().toUpperCase();
  res.json(load().applications.filter(a => a.rollNo === rollNo));
});

app.post("/api/applications", (req, res) => {
  const b = req.body || {};
  const rollNo = String(b.rollNo || "").trim().toUpperCase();
  const company = String(b.company || "").trim();
  const role = String(b.role || "").trim();
  const db = load();
  if (!db.students.some(s => s.rollNo === rollNo))
    return res.status(400).json({ error: "Student not registered." });
  if (!company || !role)
    return res.status(400).json({ error: "Company and role are required." });
  if (!STATUSES.includes(b.status))
    return res.status(400).json({ error: "Invalid status." });
  const duplicate = db.applications.some(a =>
    a.rollNo === rollNo &&
    a.company.toLowerCase() === company.toLowerCase() &&
    a.role.toLowerCase() === role.toLowerCase()
  );
  if (duplicate) return res.status(400).json({ error: "This application is already tracked." });

  const now = new Date().toISOString();
  const application = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    rollNo, company, role,
    location: String(b.location || "").trim(),
    stipend: String(b.stipend || "").trim(),
    appliedOn: String(b.appliedOn || ""),
    deadline: String(b.deadline || ""),
    status: b.status,
    link: String(b.link || "").trim(),
    notes: String(b.notes || "").trim(),
    createdAt: now, updatedAt: now
  };
  db.applications.push(application);
  save(db);
  res.status(201).json({ application });
});

app.put("/api/applications/:id", (req, res) => {
  const db = load();
  const a = db.applications.find(x => x.id === req.params.id);
  if (!a) return res.status(404).json({ error: "Application not found." });
  if (a.rollNo !== String(req.body.rollNo || "").trim().toUpperCase())
    return res.status(403).json({ error: "Not your application." });
  if (req.body.status !== undefined) {
    if (!STATUSES.includes(req.body.status))
      return res.status(400).json({ error: "Invalid status." });
    a.status = req.body.status;
  }
  if (req.body.notes !== undefined) a.notes = String(req.body.notes);
  a.updatedAt = new Date().toISOString();
  save(db);
  res.json({ application: a });
});

app.delete("/api/applications/:id", (req, res) => {
  const db = load();
  const rollNo = String(req.query.rollNo || "").trim().toUpperCase();
  const i = db.applications.findIndex(a => a.id === req.params.id && a.rollNo === rollNo);
  if (i < 0) return res.status(404).json({ error: "Application not found." });
  db.applications.splice(i, 1);
  save(db);
  res.json({ ok: true });
});

app.get("/api/stats/:rollNo", (req, res) => {
  const rollNo = String(req.params.rollNo).trim().toUpperCase();
  const mine = load().applications.filter(a => a.rollNo === rollNo);
  const counts = Object.fromEntries(STATUSES.map(s => [s, mine.filter(a => a.status === s).length]));
  res.json({ total: mine.length, counts });
});

app.listen(PORT, () => console.log(`Internship Job Tracker running at http://localhost:${PORT}`));
