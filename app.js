/* ===================================================
   UTILITIES
=================================================== */
const bn = (s) => String(s).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

function bnWords(n) {
  n = Math.round(n);
  if (n === 0) return "শূন্য";
  const ones = [
    "",
    "এক",
    "দুই",
    "তিন",
    "চার",
    "পাঁচ",
    "ছয়",
    "সাত",
    "আট",
    "নয়",
    "দশ",
    "এগারো",
    "বারো",
    "তেরো",
    "চৌদ্দ",
    "পনেরো",
    "ষোলো",
    "সতেরো",
    "আঠারো",
    "উনিশ",
    "বিশ",
    "একুশ",
    "বাইশ",
    "তেইশ",
    "চব্বিশ",
    "পঁচিশ",
    "ছাব্বিশ",
    "সাতাশ",
    "আটাশ",
    "ঊনত্রিশ",
    "ত্রিশ",
    "একত্রিশ",
    "বত্রিশ",
    "তেত্রিশ",
    "চৌত্রিশ",
    "পঁয়ত্রিশ",
    "ছত্রিশ",
    "সাতত্রিশ",
    "আটত্রিশ",
    "ঊনচল্লিশ",
    "চল্লিশ",
    "একচল্লিশ",
    "বিয়াল্লিশ",
    "তেতাল্লিশ",
    "চৌচল্লিশ",
    "পঁয়তাল্লিশ",
    "ছেচল্লিশ",
    "সাতচল্লিশ",
    "আটচল্লিশ",
    "ঊনপঞ্চাশ",
    "পঞ্চাশ",
    "একান্ন",
    "বায়ান্ন",
    "তিপান্ন",
    "চুয়ান্ন",
    "পঞ্চান্ন",
    "ছাপান্ন",
    "সাতান্ন",
    "আটান্ন",
    "ঊনষাট",
    "ষাট",
    "একষট্টি",
    "বাষট্টি",
    "তেষট্টি",
    "চৌষট্টি",
    "পঁয়ষট্টি",
    "ছেষট্টি",
    "সাতষট্টি",
    "আটষট্টি",
    "ঊনসত্তর",
    "সত্তর",
    "একাত্তর",
    "বাহাত্তর",
    "তিয়াত্তর",
    "চুয়াত্তর",
    "পঁচাত্তর",
    "ছিয়াত্তর",
    "সাতাত্তর",
    "আটাত্তর",
    "ঊনআশি",
    "আশি",
    "একাশি",
    "বিরাশি",
    "তিরাশি",
    "চুরাশি",
    "পঁচাশি",
    "ছিয়াশি",
    "সাতাশি",
    "আটাশি",
    "ঊননব্বই",
    "নব্বই",
    "একানব্বই",
    "বিরানব্বই",
    "তিরানব্বই",
    "চুরানব্বই",
    "পঁচানব্বই",
    "ছিয়ানব্বই",
    "সাতানব্বই",
    "আটানব্বই",
    "নিরানব্বই",
  ];
  let r = "";
  if (n >= 10000000) {
    r += bnWords(Math.floor(n / 10000000)) + " কোটি ";
    n %= 10000000;
  }
  if (n >= 100000) {
    r += bnWords(Math.floor(n / 100000)) + " লক্ষ ";
    n %= 100000;
  }
  if (n >= 1000) {
    r += bnWords(Math.floor(n / 1000)) + " হাজার ";
    n %= 1000;
  }
  if (n >= 100) {
    r += ones[Math.floor(n / 100)] + " শত ";
    n %= 100;
  }
  if (n > 0) {
    r += ones[n];
  }
  return r.trim();
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function fmtMonthBn(ym) {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const months = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];
  return months[+m - 1] + " " + bn(y);
}

function hourlyRate(basic) {
  return Math.ceil((+basic || 0) / 104);
}

/* ===================================================
   FIREBASE DB — Firestore backend
   Falls back to localStorage if offline
=================================================== */
const SEED_EMPS = [
  {
    id: "seed1",
    name: "মোঃ এনামুল হক",
    desig: "এ টি আই",
    dept: "ট্রাফিক",
    branch: "রাজস্ব ও রিটার্ন",
    basic: 27300,
    ic: "২৪৭২",
  },
  {
    id: "seed2",
    name: "মোঃ ইব্রাহীম খলিলূর রহমান",
    desig: "এ টি আই",
    dept: "ট্রাফিক",
    branch: "রাজস্ব ও রিটার্ন",
    basic: 24160,
    ic: "২৫০৬",
  },
  {
    id: "seed3",
    name: "মোঃ সামিউল আলম সুমেল",
    desig: "সিঃ আঃ এ্যাঃ",
    dept: "ট্রাফিক",
    branch: "রাজস্ব ও রিটার্ন",
    basic: 17680,
    ic: "২৯৩৫",
  },
  {
    id: "seed4",
    name: "মোঃ ইবনে হাসান",
    desig: "সিঃ আঃ এ্যাঃ",
    dept: "ট্রাফিক",
    branch: "রাজস্ব ও রিটার্ন",
    basic: 17680,
    ic: "২৯৩৩",
  },
  {
    id: "seed5",
    name: "মোঃ সাইদুল ইসলাম",
    desig: "জঃ আঃ এ্যাঃ",
    dept: "ট্রাফিক",
    branch: "রাজস্ব ও রিটার্ন",
    basic: 9776,
    ic: "৩৭৫৮",
  },
];

// In-memory cache (populated from Firestore via real-time listeners)
let _emps = [];
let _bills = [];
let _fsReady = false;
let currentUserProfile = null; // { role, empId, ic } from users/{uid}
let pendingUserProfile = null;
const ADMIN_LOGIN_ID = "admin";
const ADMIN_LOGIN_PASSWORD = "sas@911225";
const LOCAL_SESSION_KEY = "mpa_login_session";
const LOCAL_USERS_KEY = "mpa_local_users";
let adminLoginVisible = false;

function _isEmployee() { return currentUserProfile?.role === "employee"; }
function _myEmpId()    { return currentUserProfile?.empId || null; }
function _visibleEmps()  {
  return _isEmployee() ? _emps.filter(e => e.id === _myEmpId()) : _emps;
}
function _visibleBills() {
  return _isEmployee() ? _bills.filter(b => b.empId === _myEmpId()) : _bills;
}

function _localUsers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function _saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function startLocalSession(profile) {
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(profile));
  localStorage.removeItem("mpa_admin_session");
  currentUserProfile = profile;
  isAdmin = profile?.role === "admin";
  showMainApp();
  renderAll();
  updateUserChip();
  updateRoleUi();
}

function restoreLocalSession() {
  let profile = null;
  try {
    profile = JSON.parse(localStorage.getItem(LOCAL_SESSION_KEY) || "null");
  } catch {
    profile = null;
  }
  if (!profile && localStorage.getItem("mpa_admin_session") === "1") {
    profile = { role: "admin" };
  }
  if (!profile) return false;
  startLocalSession(profile);
  return true;
}

function _saveLocal() {
  localStorage.setItem("mpa_emps", JSON.stringify(_emps));
  localStorage.setItem("mpa_bills", JSON.stringify(_bills));
}

const DB = {
  emps() {
    return _emps;
  },
  bills() {
    return _bills;
  },

  async addEmp(data) {
    if (!_fsReady) {
      data.id = _icKey(data.ic) || uid();
      _emps.push(data);
      _saveLocal();
      renderAll();
      return;
    }
    const { doc, setDoc, db } = globalThis._fs;
    try {
      const id = _icKey(data.ic) || uid();
      await setDoc(doc(db, "employees", id), data);
      data.id = id;
    } catch (err) {
      toast("সংরক্ষণ ব্যর্থ: " + (err.code || err.message), "er");
      throw err;
    }
  },

  async updateEmp(id, data) {
    if (!_fsReady) {
      const i = _emps.findIndex((e) => e.id === id);
      if (i > -1) _emps[i] = { ..._emps[i], ...data };
      _saveLocal();
      renderAll();
      return;
    }
    const { doc, setDoc } = globalThis._fs;
    try {
      await setDoc(doc(globalThis._fs.db, "employees", id), data);
    } catch (err) {
      toast("আপডেট ব্যর্থ: " + (err.code || err.message), "er");
      throw err;
    }
  },

  async deleteEmp(id) {
    if (!_fsReady) {
      _emps = _emps.filter((e) => e.id !== id);
      _saveLocal();
      renderAll();
      return;
    }
    const { doc, deleteDoc } = globalThis._fs;
    try {
      await deleteDoc(doc(globalThis._fs.db, "employees", id));
    } catch (err) {
      toast("মুছতে ব্যর্থ: " + (err.code || err.message), "er");
      throw err;
    }
  },

  async addBill(data) {
    if (!_fsReady) {
      data.id = uid();
      _bills.push(data);
      _saveLocal();
      renderAll();
      return;
    }
    const { addDoc, collection } = globalThis._fs;
    try {
      const docData = { ...data };
      delete docData.id;
      const ref = await addDoc(collection("bills"), docData);
      data.id = ref.id;
    } catch (err) {
      toast("সংরক্ষণ ব্যর্থ: " + (err.code || err.message), "er");
      throw err;
    }
  },

  async deleteBill(id) {
    if (!_fsReady) {
      _bills = _bills.filter((b) => b.id !== id);
      _saveLocal();
      renderAll();
      return;
    }
    const { doc, deleteDoc } = globalThis._fs;
    try {
      await deleteDoc(doc(globalThis._fs.db, "bills", id));
    } catch (err) {
      toast("মুছতে ব্যর্থ: " + (err.code || err.message), "er");
      throw err;
    }
  },
};

function renderAll() {
  renderDash();
  renderEmpTable();
  renderEmpGrid();
  renderBills();
}

// Show Firebase connection status in topbar
function setStatus(connected) {
  const el = document.getElementById("fbStatus");
  if (!el) return;
  el.innerHTML = connected
    ? '<span style="color:#6ed4ae;font-size:12px;">🟢 Firebase</span>'
    : '<span style="color:#f5a742;font-size:12px;">🟡 Offline</span>';
}

// Setup real-time Firestore listeners
function setupListeners() {
  const { collection, onSnapshot } = globalThis._fs;

  // Employees listener
  onSnapshot(
    collection("employees"),
    (snap) => {
      _emps = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
      renderEmpTable();
      renderEmpGrid();
      renderDash();
      if (currentUserProfile) updateUserChip();
    },
    (err) => {
      toast("কর্মচারী ডেটা লোড ব্যর্থ: " + (err.code || err.message), "er");
    },
  );

  // Bills listener
  onSnapshot(
    collection("bills"),
    (snap) => {
      _bills = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
      _bills.sort((a, b) =>
        (a.createdAt || "").localeCompare(b.createdAt || ""),
      );
      renderBills();
      renderDash();
    },
    (err) => {
      toast("বিল ডেটা লোড ব্যর্থ: " + (err.code || err.message), "er");
    },
  );
}

async function seedFirestore() {
  const { doc, setDoc } = globalThis._fs;
  for (const emp of SEED_EMPS) {
    const { id, ...data } = emp;
    await setDoc(doc(globalThis._fs.db, "employees", _icKey(data.ic) || id), data);
  }
}

// Auto sync auth state — load user profile from Firestore
globalThis.addEventListener("authStateChanged", async ({ detail: { user } }) => {
  if (!user) {
    if (restoreLocalSession()) return;
    currentUserProfile = null;
    isAdmin = false;
    showLoginScreen();
    return;
  }

  // Load profile from users/{uid}
  let profile = null;
  if (_fsReady) {
    try {
      const { getDoc, doc, db } = globalThis._fs;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        profile = snap.data();
      } else if (pendingUserProfile?.uid === user.uid) {
        profile = pendingUserProfile.profile;
      } else if (!user.email.endsWith("@mpa-otbill.local")) {
        // Real email → treat as admin, auto-create users doc
        profile = { role: "admin" };
        const { setDoc, doc: d2, db: db2 } = globalThis._fs;
        await setDoc(d2(db2, "users", user.uid), profile);
      } else {
        const ic = user.email.split("@")[0];
        const emp = await findEmployeeByIc(ic);
        if (!emp) {
          await globalThis._auth.signOut(globalThis._auth.auth);
          toast("অ্যাকাউন্ট পাওয়া যায়নি, পুনরায় নিবন্ধন করুন", "er");
          return;
        }
        profile = { role: "employee", empId: emp.id, ic };
        const { setDoc, doc: d2, db: db2 } = globalThis._fs;
        await setDoc(d2(db2, "users", user.uid), profile);
      }
    } catch (err) {
      toast("প্রোফাইল লোড ব্যর্থ: " + (err.code || err.message), "er");
      return;
    }
  }

  currentUserProfile = profile;
  if (pendingUserProfile?.uid === user.uid) pendingUserProfile = null;
  isAdmin = profile?.role === "admin";
  showMainApp();
  renderAll();
  updateUserChip();
  updateRoleUi();
});

// Wait for Firebase module to load then start
globalThis.addEventListener("firebaseReady", async () => {
  _fsReady = true;
  setStatus(true);
  setupListeners();
  toast("☁️ Firebase সংযুক্ত হয়েছে", "ok");
  // Seed once on first-ever install only
  if (!localStorage.getItem("mpa_seeded")) {
    const { getDocs, collection } = globalThis._fs;
    const snap = await getDocs(collection("employees"));
    if (snap.empty) await seedFirestore();
    localStorage.setItem("mpa_seeded", "1");
  }
});

// Fallback: if Firebase doesn't load in 3s, use localStorage
setTimeout(() => {
  if (!_fsReady) {
    setStatus(false);
    try {
      _emps = JSON.parse(localStorage.getItem("mpa_emps") || "[]");
    } catch {
      _emps = [];
    }
    try {
      _bills = JSON.parse(localStorage.getItem("mpa_bills") || "[]");
    } catch {
      _bills = [];
    }
    if (!_emps.length) {
      _emps = SEED_EMPS;
      localStorage.setItem("mpa_emps", JSON.stringify(_emps));
    }
    renderAll();
    toast("⚠️ Offline mode — Firebase সংযুক্ত হয়নি", "er");
  }
}, 3000);

/* ===================================================
   TOAST
=================================================== */
function toast(msg, type = "ok") {
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.innerHTML = `<span>${type === "ok" ? "✅" : "❌"}</span><span>${msg}</span>`;
  document.getElementById("toasts").appendChild(el);
  setTimeout(() => el.remove(), 3400);
}

/* ===================================================
   NAVIGATION
=================================================== */
const viewTitles = {
  dashboard: "ড্যাশবোর্ড",
  "new-bill": "নতুন OT বিল",
  "all-bills": "সকল বিল",
  employees: "কর্মচারী ডেটাবেস",
};

function goView(name) {
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  const v = document.getElementById("view-" + name);
  if (v) v.classList.add("active");
  const ni = document.querySelector('[data-view="' + name + '"]');
  if (ni) ni.classList.add("active");
  document.getElementById("viewTitle").textContent = viewTitles[name] || name;
  if (name === "dashboard") renderDash();
  if (name === "employees") renderEmpTable();
  if (name === "new-bill") renderEmpGrid();
  if (name === "all-bills") renderBills();
}

/* ===================================================
   DASHBOARD
=================================================== */
function renderDash() {
  const emps  = _visibleEmps(),
    bills = _visibleBills();
  const totHrs = bills.reduce((s, b) => s + (b.totalHours || 0), 0);
  const totAmt = bills.reduce((s, b) => s + (b.totalAmt || 0), 0);
  document.getElementById("s-emp").textContent = bn(emps.length);
  document.getElementById("s-bills").textContent = bn(bills.length);
  document.getElementById("s-hrs").textContent = bn(totHrs);
  document.getElementById("s-amt").textContent = bn(
    totAmt.toLocaleString("en-IN"),
  );

  const tbody = document.getElementById("dash-tbody");
  const recent = [...bills].reverse().slice(0, 10);
  if (!recent.length) {
    tbody.innerHTML =
      '<tr><td colspan="6"><div class="empty"><div class="empty-ico">📋</div><p>কোনো বিল নেই</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = recent
    .map((b) => {
      const emp = emps.find((e) => e.id === b.empId) || {};
      return `<tr>
      <td><strong>${emp.name || "—"}</strong></td>
      <td><span class="badge badge-blue">${emp.desig || "—"}</span></td>
      <td>${fmtMonthBn(b.month)}</td>
      <td><span class="badge badge-gold">${bn(b.totalHours || 0)} ঘন্টা</span></td>
      <td><span class="text-gold bold">৳ ${bn((b.totalAmt || 0).toLocaleString("en-IN"))}</span></td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-xs" onclick="printBill('${b.id}')">🖨️</button>
          ${isAdmin ? `<button class="btn btn-danger btn-xs" onclick="delBill('${b.id}')">🗑️</button>` : ""}
        </div>
      </td>
    </tr>`;
    })
    .join("");
}

/* ===================================================
   LOGIN SCREEN HELPERS
=================================================== */
function showLoginScreen() {
  document.getElementById("loginOverlay").style.display = "flex";
  document.getElementById("appLayout").style.display = "none";
  document.getElementById("userChip").style.display = "none";
  adminLoginVisible = false;
  switchLoginTab("login");
  updateLoginModeUi();
  document.getElementById("loginUsername").focus();
}

function showMainApp() {
  document.getElementById("loginOverlay").style.display = "none";
  document.getElementById("appLayout").style.display = "grid";
}

function updateUserChip() {
  const chip = document.getElementById("userChip");
  chip.style.display = "flex";
  const badge = document.getElementById("adminBadge");

  if (isAdmin) {
    const email = globalThis._auth?.auth?.currentUser?.email || "admin";
    document.getElementById("userChipIcon").textContent = "🔐";
    document.getElementById("userChipName").textContent = "Admin";
    document.getElementById("userChipSub").textContent = email;
    badge.style.display = "inline-flex";
  } else {
    const emp = _emps.find(e => e.id === _myEmpId()) || {};
    document.getElementById("userChipIcon").textContent = "👤";
    document.getElementById("userChipName").textContent = emp.name || currentUserProfile?.ic || "—";
    document.getElementById("userChipSub").textContent = `IC: ${currentUserProfile?.ic || "—"} | ${emp.desig || ""}`;
    badge.style.display = "none";
  }
  updateRoleUi();
}

function switchLoginTab(tab) {
  document.getElementById("loginForm").style.display = tab === "login" ? "block" : "none";
  document.getElementById("registerForm").style.display = tab === "register" ? "block" : "none";
  document.getElementById("loginTabBtn").classList.toggle("active", tab === "login");
  document.getElementById("registerTabBtn").classList.toggle("active", tab === "register");
  document.getElementById("loginError").textContent = "";
  document.getElementById("registerError").textContent = "";
}

function updateLoginModeUi() {
  const label = document.getElementById("loginIdLabel");
  const hint = document.getElementById("loginIdHint");
  const input = document.getElementById("loginUsername");
  const registerBtn = document.getElementById("registerTabBtn");
  if (!label || !hint || !input || !registerBtn) return;
  label.textContent = adminLoginVisible ? "Admin ID" : "IC নম্বর";
  hint.textContent = adminLoginVisible ? "Ctrl+Shift click" : "কর্মচারী লগইন";
  input.placeholder = adminLoginVisible ? "admin" : "আপনার IC নম্বর";
  if (adminLoginVisible) {
    input.value = ADMIN_LOGIN_ID;
    registerBtn.style.display = "none";
  } else {
    if (input.value.toLowerCase() === ADMIN_LOGIN_ID) input.value = "";
    registerBtn.style.display = "";
  }
}

async function openAdminLogin() {
  adminLoginVisible = true;
  try {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    localStorage.removeItem("mpa_admin_session");
    const { auth, signOut } = globalThis._auth || {};
    if (auth?.currentUser) await signOut(auth);
  } catch {}
  currentUserProfile = null;
  isAdmin = false;
  document.getElementById("loginOverlay").style.display = "flex";
  document.getElementById("appLayout").style.display = "none";
  switchLoginTab("login");
  updateLoginModeUi();
  document.getElementById("loginPassword").value = "";
  document.getElementById("loginUsername").focus();
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
    e.preventDefault();
    openAdminLogin();
  }
});

document.getElementById("loginOverlay").addEventListener("click", (e) => {
  if (e.ctrlKey && e.shiftKey) {
    e.preventDefault();
    openAdminLogin();
  }
});

async function doLogin() {
  const raw = document.getElementById("loginUsername").value.trim();
  const pw  = document.getElementById("loginPassword").value;
  if (!raw || !pw) {
    document.getElementById("loginError").textContent = "ID এবং পাসওয়ার্ড দিন";
    return;
  }
  if (raw.toLowerCase() === ADMIN_LOGIN_ID) {
    if (!adminLoginVisible) {
      document.getElementById("loginError").textContent = "Admin লগইনের জন্য Ctrl+Shift ধরে click করুন";
      return;
    }
    const users = _localUsers();
    const adminPass = users.admin?.password || ADMIN_LOGIN_PASSWORD;
    if (pw !== adminPass) {
      document.getElementById("loginError").textContent = "Admin পাসওয়ার্ড ভুল";
      return;
    }
    try {
      const { auth, signOut } = globalThis._auth || {};
      if (auth?.currentUser) await signOut(auth);
    } catch {}
    if (!users.admin) {
      users.admin = { password: ADMIN_LOGIN_PASSWORD, profile: { role: "admin" } };
      _saveLocalUsers(users);
    }
    document.getElementById("loginPassword").value = "";
    startLocalSession({ role: "admin" });
    return;
  }
  const loginId = raw.includes("@") ? raw : _icKey(raw);
  if (!raw.includes("@") && !loginId) {
    document.getElementById("loginError").textContent = "সঠিক IC নম্বর দিন";
    return;
  }
  if (!raw.includes("@")) {
    const users = _localUsers();
    if (users[`emp:${loginId}`]) {
      const loggedIn = await localEmployeeLogin(loginId, pw);
      if (loggedIn) return;
      return;
    }
  }
  const email = raw.includes("@") ? raw : `${loginId}@mpa-otbill.local`;
  try {
    const { auth, signInWithEmailAndPassword } = globalThis._auth;
    await signInWithEmailAndPassword(auth, email, pw);
    document.getElementById("loginPassword").value = "";
    // onAuthStateChanged handles the rest
  } catch (err) {
    const code = err.code || "";
    if (!raw.includes("@") && code === "auth/configuration-not-found") {
      const loggedIn = await localEmployeeLogin(loginId, pw);
      if (loggedIn) return;
    }
    if (!raw.includes("@") && pw === "123456" && (code === "auth/invalid-credential" || code === "auth/user-not-found")) {
      const activated = await activateEmployeeLogin(loginId);
      if (activated) return;
    }
    document.getElementById("loginError").textContent =
      code === "auth/wrong-password" || code === "auth/invalid-credential"
        ? "পাসওয়ার্ড ভুল!"
        : code === "auth/user-not-found" || code === "auth/invalid-email"
        ? "ID নিবন্ধিত নয়"
        : code === "auth/too-many-requests"
        ? "অনেক চেষ্টা হয়েছে, কিছুক্ষণ পরে আবার করুন"
        : "লগইন ব্যর্থ: " + (code || err.message);
  }
}

async function activateEmployeeLogin(empId) {
  const errEl = document.getElementById("loginError");
  const existingEmp = await findEmployeeByIc(empId);
  if (!existingEmp) {
    errEl.textContent = "এই IC নম্বর কর্মচারী তালিকায় নেই";
    return false;
  }
  try {
    const { auth, createUserWithEmailAndPassword } = globalThis._auth;
    const cred = await createUserWithEmailAndPassword(auth, `${empId}@mpa-otbill.local`, "123456");
    const { setDoc, doc, db } = globalThis._fs;
    const profile = { role: "employee", empId: existingEmp.id, ic: empId };
    pendingUserProfile = { uid: cred.user.uid, profile };
    await setDoc(doc(db, "users", cred.user.uid), profile);
    document.getElementById("loginPassword").value = "";
    return true;
  } catch (err) {
    const code = err.code || "";
    if (code === "auth/configuration-not-found") {
      return localEmployeeLogin(empId, "123456");
    }
    errEl.textContent =
      code === "auth/email-already-in-use"
        ? "এই IC-তে লগইন আছে, বর্তমান পাসওয়ার্ড দিন"
        : "লগইন তৈরি ব্যর্থ: " + (code || err.message);
    return false;
  }
}

async function localEmployeeLogin(empId, password) {
  const errEl = document.getElementById("loginError");
  const emp = await findEmployeeByIc(empId);
  if (!emp) {
    errEl.textContent = "এই IC নম্বর কর্মচারী তালিকায় নেই";
    return false;
  }

  const users = _localUsers();
  const key = `emp:${empId}`;
  if (!users[key]) {
    if (password !== "123456") {
      errEl.textContent = "প্রাথমিক পাসওয়ার্ড 123456 দিয়ে প্রথমবার লগইন করুন";
      return false;
    }
    users[key] = {
      password: "123456",
      profile: { role: "employee", empId: emp.id, ic: empId },
    };
    _saveLocalUsers(users);
  }

  if (users[key].password !== password) {
    errEl.textContent = "পাসওয়ার্ড ভুল!";
    return false;
  }

  document.getElementById("loginPassword").value = "";
  startLocalSession(users[key].profile);
  return true;
}

async function findEmployeeByIc(empId) {
  const cached = _emps.find((e) => _icKey(e.ic) === empId || e.id === empId);
  if (cached) return cached;
  if (!_fsReady) return null;
  const { getDoc, doc, db } = globalThis._fs;
  const direct = await getDoc(doc(db, "employees", empId));
  if (direct.exists()) return { ...direct.data(), id: direct.id };
  const { getDocs, collection } = globalThis._fs;
  const snap = await getDocs(collection("employees"));
  const found = snap.docs
    .map((d) => ({ ...d.data(), id: d.id }))
    .find((e) => _icKey(e.ic) === empId || e.id === empId);
  if (found) return found;
  return null;
}

async function doRegister() {
  const name = document.getElementById("regName").value.trim();
  const desig = document.getElementById("regDesig").value.trim();
  const ic = document.getElementById("regIC").value.trim();
  const dept = document.getElementById("regDept").value.trim() || "ট্রাফিক";
  const branch = document.getElementById("regBranch").value.trim() || "রাজস্ব ও রিটার্ন";
  const basic = +document.getElementById("regBasic").value || 0;
  const errEl = document.getElementById("registerError");
  const empId = _icKey(ic);
  const existingEmp = _emps.find(e => _icKey(e.ic) === empId || e.id === empId);
  const pw = "123456";

  if (!empId) { errEl.textContent = "সঠিক IC নম্বর দিন"; return; }
  if (!existingEmp) {
    if (!name) { errEl.textContent = "পূর্ণ নাম দিন"; return; }
    if (!desig) { errEl.textContent = "পদবী দিন"; return; }
    if (!basic) { errEl.textContent = "মূল বেতন দিন"; return; }
  }

  try {
    const { auth, createUserWithEmailAndPassword } = globalThis._auth;
    const cred = await createUserWithEmailAndPassword(auth, `${empId}@mpa-otbill.local`, pw);
    const { setDoc, doc, db } = globalThis._fs;
    const profile = {
      role: "employee",
      empId: existingEmp?.id || empId,
      ic: empId,
    };
    pendingUserProfile = { uid: cred.user.uid, profile };
    if (!existingEmp) {
      await setDoc(doc(db, "employees", empId), { name, desig, ic: empId, dept, branch, basic });
    }
    await setDoc(doc(db, "users", cred.user.uid), profile);
    ["regName", "regDesig", "regIC", "regBasic"].forEach((id) => {
      document.getElementById(id).value = "";
    });
    // onAuthStateChanged fires automatically
  } catch (err) {
    const code = err.code || "";
    if (code === "auth/configuration-not-found") {
      try {
        const { setDoc, doc, db } = globalThis._fs;
        if (!existingEmp) {
          await setDoc(doc(db, "employees", empId), { name, desig, ic: empId, dept, branch, basic });
        }
        const users = _localUsers();
        users[`emp:${empId}`] = {
          password: "123456",
          profile: { role: "employee", empId: existingEmp?.id || empId, ic: empId },
        };
        _saveLocalUsers(users);
        ["regName", "regDesig", "regIC", "regBasic"].forEach((id) => {
          document.getElementById(id).value = "";
        });
        startLocalSession(users[`emp:${empId}`].profile);
        return;
      } catch (saveErr) {
        errEl.textContent = "নিবন্ধন সংরক্ষণ ব্যর্থ: " + (saveErr.code || saveErr.message);
        return;
      }
    }
    errEl.textContent =
      code === "auth/email-already-in-use"
        ? "এই IC নম্বরে ইতিমধ্যে লগইন আছে"
        : "নিবন্ধন ব্যর্থ: " + (code || err.message);
  }
}

async function doLogout() {
  try {
    localStorage.removeItem("mpa_admin_session");
    localStorage.removeItem(LOCAL_SESSION_KEY);
    const { auth, signOut } = globalThis._auth || {};
    if (auth) await signOut(auth);
  } catch {}
  currentUserProfile = null;
  isAdmin = false;
  showLoginScreen();
  updateRoleUi();
  // onAuthStateChanged → showLoginScreen()
}

function openEmpChangePw() {
  ["empCurPw","empNewPw","empNewPw2"].forEach(id => { document.getElementById(id).value = ""; });
  document.getElementById("empPwError").textContent = "";
  document.getElementById("empChangePwOverlay").classList.add("open");
}
function closeEmpChangePw() {
  document.getElementById("empChangePwOverlay").classList.remove("open");
}
async function doEmpChangePw() {
  const cur = document.getElementById("empCurPw").value;
  const nw  = document.getElementById("empNewPw").value;
  const nw2 = document.getElementById("empNewPw2").value;
  const errEl = document.getElementById("empPwError");
  if (!cur || !nw || !nw2) { errEl.textContent = "সব ঘর পূরণ করুন"; return; }
  if (nw !== nw2)           { errEl.textContent = "নতুন পাসওয়ার্ড মিলছে না"; return; }
  if (nw.length < 6)        { errEl.textContent = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর"; return; }
  const localSession = localStorage.getItem(LOCAL_SESSION_KEY);
  if (localSession || !globalThis._auth?.auth?.currentUser) {
    const users = _localUsers();
    const key = isAdmin ? "admin" : `emp:${currentUserProfile?.ic}`;
    const user = users[key] || (isAdmin
      ? { password: ADMIN_LOGIN_PASSWORD, profile: { role: "admin" } }
      : null);
    if (!user) { errEl.textContent = "লোকাল অ্যাকাউন্ট পাওয়া যায়নি"; return; }
    if (user.password !== cur) { errEl.textContent = "বর্তমান পাসওয়ার্ড ভুল"; return; }
    user.password = nw;
    users[key] = user;
    _saveLocalUsers(users);
    closeEmpChangePw();
    toast("পাসওয়ার্ড পরিবর্তন হয়েছে ✓", "ok");
    return;
  }
  try {
    const { auth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } = globalThis._auth;
    const user = auth.currentUser;
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, cur));
    await updatePassword(user, nw);
    closeEmpChangePw();
    toast("পাসওয়ার্ড পরিবর্তন হয়েছে ✓", "ok");
  } catch (err) {
    const code = err.code || "";
    errEl.textContent =
      code === "auth/wrong-password" || code === "auth/invalid-credential"
        ? "বর্তমান পাসওয়ার্ড ভুল"
        : "পরিবর্তন ব্যর্থ: " + (code || err.message);
  }
}

/* ===================================================
   ROLE HELPERS
=================================================== */
let isAdmin = false;

function updateRoleUi() {
  document.querySelectorAll(".admin-only").forEach((el) => {
    el.style.display = isAdmin ? "" : "none";
  });
}

/* ===================================================
   EMPLOYEE CRUD
=================================================== */
let editEmpId = null;

function canEditEmp(id) {
  return isAdmin || (_isEmployee() && id === _myEmpId());
}

function openEmpModal(id) {
  if (!id && !isAdmin) {
    toast("শুধু Admin নতুন কর্মচারী যোগ করতে পারবেন", "er");
    return;
  }
  if (id && !canEditEmp(id)) {
    toast("আপনি শুধু নিজের তথ্য সম্পাদনা করতে পারবেন", "er");
    return;
  }
  editEmpId = id || null;
  const modal = document.getElementById("empOverlay");
  modal.classList.add("open");
  if (id) {
    const e = DB.emps().find((x) => x.id === id);
    if (!e) return;
    document.getElementById("empModalTitle").textContent = "কর্মচারী সম্পাদনা";
    document.getElementById("ef-name").value = e.name;
    document.getElementById("ef-desig").value = e.desig;
    document.getElementById("ef-ic").value = e.ic;
    document.getElementById("ef-dept").value = e.dept;
    document.getElementById("ef-branch").value = e.branch;
    document.getElementById("ef-basic").value = e.basic;
    updateHourlyHint();
  } else {
    document.getElementById("empModalTitle").textContent = "কর্মচারী যোগ";
    ["ef-name", "ef-desig", "ef-ic", "ef-basic"].forEach(
      (fid) => (document.getElementById(fid).value = ""),
    );
    document.getElementById("ef-dept").value = "ট্রাফিক";
    document.getElementById("ef-branch").value = "রাজস্ব ও রিটার্ন";
    document.getElementById("hourly-hint").textContent = "—";
  }
  document.getElementById("ef-ic").readOnly = !isAdmin;
}

function closeEmpModal() {
  document.getElementById("empOverlay").classList.remove("open");
}

function updateHourlyHint() {
  const v = +document.getElementById("ef-basic").value || 0;
  document.getElementById("hourly-hint").textContent = v
    ? bn(hourlyRate(v)) + " টাকা"
    : "—";
}

async function saveEmp() {
  const name = document.getElementById("ef-name").value.trim();
  const desig = document.getElementById("ef-desig").value.trim();
  const ic = document.getElementById("ef-ic").value.trim();
  const dept = document.getElementById("ef-dept").value.trim();
  const branch = document.getElementById("ef-branch").value.trim();
  const basic = +document.getElementById("ef-basic").value || 0;
  const empId = _icKey(ic);
  if (!editEmpId && !isAdmin) {
    toast("শুধু Admin নতুন কর্মচারী যোগ করতে পারবেন", "er");
    return;
  }
  if (editEmpId && !canEditEmp(editEmpId)) {
    toast("আপনি শুধু নিজের তথ্য সম্পাদনা করতে পারবেন", "er");
    return;
  }
  if (!name || !desig || !empId || !basic) {
    toast("নাম, পদবী, IC ও মূল বেতন আবশ্যক", "er");
    return;
  }
  if (!editEmpId && _emps.some(e => _icKey(e.ic) === empId || e.id === empId)) {
    toast("এই IC নম্বরে কর্মচারী আগে থেকেই আছে", "er");
    return;
  }
  const original = editEmpId ? _emps.find((e) => e.id === editEmpId) : null;
  const data = {
    name,
    desig,
    ic: isAdmin ? ic : (original?.ic || ic),
    dept,
    branch,
    basic,
  };
  try {
    if (editEmpId) {
      await DB.updateEmp(editEmpId, data);
      toast("কর্মচারী আপডেট ✓");
    } else {
      await DB.addEmp(data);
      toast("কর্মচারী যোগ ✓");
    }
    closeEmpModal();
  } catch {}
}

async function delEmp(id) {
  if (!isAdmin) {
    toast("শুধু Admin মুছতে পারবেন", "er");
    return;
  }
  if (!confirm("এই কর্মচারী মুছবেন?")) return;
  if (selEmpId === id) deselectEmp();
  try {
    await DB.deleteEmp(id);
    toast("মুছে ফেলা হয়েছে");
  } catch {}
}

function adminResetEmpPassword(id) {
  if (!isAdmin) {
    toast("শুধু Admin পাসওয়ার্ড পরিবর্তন করতে পারবেন", "er");
    return;
  }
  const emp = _emps.find((e) => e.id === id);
  if (!emp) {
    toast("কর্মচারী পাওয়া যায়নি", "er");
    return;
  }
  const empId = _icKey(emp.ic) || id;
  const next = prompt(`${emp.name} - নতুন পাসওয়ার্ড দিন`, "123456");
  if (next === null) return;
  if (next.length < 6) {
    toast("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর", "er");
    return;
  }
  const users = _localUsers();
  users[`emp:${empId}`] = {
    password: next,
    profile: { role: "employee", empId: emp.id, ic: empId },
  };
  _saveLocalUsers(users);
  toast("পাসওয়ার্ড পরিবর্তন হয়েছে ✓", "ok");
}

function _icToNum(ic) {
  if (!ic) return Infinity;
  const s = String(ic).replace(/[০-৯]/g, (d) =>
    String("০১২৩৪৫৬৭৮৯".indexOf(d)),
  );
  return Math.ceil(Number.parseFloat(s)) || Infinity;
}

function _normIC(ic) {
  if (!ic) return "—";
  const s = String(ic).replace(/[০-৯]/g, (d) =>
    String("০১২৩৪৫৬৭৮৯".indexOf(d)),
  );
  const n = Number.parseFloat(s);
  return Number.isNaN(n) ? String(ic) : bn(Math.ceil(n));
}

function _oldIcKeyDraft(ic) {
  /*
  const s = String(ic || "")
    .replace(/[০-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/\D/g, "");
  return s.replace(/^0+/, "") || "";
  */
}

function _icKey(ic) {
  return String(ic || "")
    .replace(/./g, (ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 0x09e6 && code <= 0x09ef) return String(code - 0x09e6);
      if (code >= 48 && code <= 57) return ch;
      return "";
    })
    .replace(/^0+/, "");
}

function _sortEmps(arr) {
  return [...arr].sort((a, b) => {
    const d = (a.dept || "").localeCompare(b.dept || "", "bn");
    if (d !== 0) return d;
    const br = (a.branch || "").localeCompare(b.branch || "", "bn");
    if (br !== 0) return br;
    return _icToNum(a.ic) - _icToNum(b.ic);
  });
}

function renderEmpTable() {
  const emps = _sortEmps(_visibleEmps());
  const tbody = document.getElementById("emp-tbody");
  if (!emps.length) {
    tbody.innerHTML =
      '<tr><td colspan="8"><div class="empty"><div class="empty-ico">👤</div><p>কোনো কর্মচারী নেই</p></div></td></tr>';
    return;
  }

  const groups = {};
  emps.forEach((e) => {
    const dk = e.dept || "—";
    const bk = e.branch || "—";
    if (!groups[dk]) groups[dk] = {};
    if (!groups[dk][bk]) groups[dk][bk] = [];
    groups[dk][bk].push(e);
  });

  let html = "";
  let di = 0;
  for (const dept of Object.keys(groups)) {
    const branches = groups[dept];
    const total = Object.values(branches).reduce((s, a) => s + a.length, 0);
    const dk = `et${di++}`;

    html += `<tr class="acc-tbl-dept" onclick="_accToggleDept('${dk}')">
      <td colspan="8">
        <span class="acc-arrow" id="${dk}a">▼</span>
        <strong style="color:var(--gold2);margin-left:6px">${dept}</strong>
        <span class="acc-count">${bn(total)} জন</span>
      </td>
    </tr>`;

    let bi = 0;
    for (const branch of Object.keys(branches)) {
      const bk = `${dk}_${bi++}`;
      const bEmps = branches[branch];

      html += `<tr class="acc-tbl-branch acc-tbl-dept-${dk}" data-dk="${dk}" data-bk="${bk}"
        onclick="_accToggleBranch('${dk}','${bk}')">
        <td colspan="8">
          <span class="acc-arrow acc-arrow-sm" id="${bk}a">▼</span>
          <span style="color:var(--text-secondary);margin-left:6px">${branch}</span>
          <span class="acc-count">${bn(bEmps.length)} জন</span>
        </td>
      </tr>`;

      bEmps.forEach((e) => {
        html += `<tr class="acc-tbl-emp acc-tbl-dept-${dk} acc-tbl-branch-${bk}" data-dk="${dk}" data-bk="${bk}">
          <td><strong>${e.name}</strong></td>
          <td><span class="badge badge-blue">${e.desig}</span></td>
          <td>${e.dept}</td>
          <td>${e.branch}</td>
          <td><span class="text-gold">৳ ${(+e.basic).toLocaleString("en-IN")}</span></td>
          <td>${_normIC(e.ic)}</td>
          <td><span class="badge badge-gold">${bn(hourlyRate(e.basic))} টাকা</span></td>
          <td>
            <div class="flex gap-2">
              ${
                canEditEmp(e.id)
                  ? `<button class="btn btn-outline btn-xs" onclick="openEmpModal('${e.id}')">✏️</button>
                   ${isAdmin ? `<button class="btn btn-outline btn-xs" onclick="adminResetEmpPassword('${e.id}')">🔑</button>` : ""}
                   ${isAdmin ? `<button class="btn btn-danger btn-xs" onclick="delEmp('${e.id}')">🗑️</button>` : ""}`
                  : '<span class="text-muted text-xs">—</span>'
              }
            </div>
          </td>
        </tr>`;
      });
    }
  }

  tbody.innerHTML = html;
}

/* ===================================================
   EMPLOYEE SELECTOR (New Bill)
=================================================== */
let selEmpId = null;

function renderEmpGrid() {
  const emps = _sortEmps(_visibleEmps());
  const container = document.getElementById("empGrid");
  const empty = document.getElementById("empEmpty");
  if (!emps.length) {
    container.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  const groups = {};
  emps.forEach((e) => {
    const dk = e.dept || "—";
    const bk = e.branch || "—";
    if (!groups[dk]) groups[dk] = {};
    if (!groups[dk][bk]) groups[dk][bk] = [];
    groups[dk][bk].push(e);
  });

  let html = "";
  let di = 0;
  for (const dept of Object.keys(groups)) {
    const branches = groups[dept];
    const total = Object.values(branches).reduce((s, a) => s + a.length, 0);
    const dk = `eg${di++}`;

    html += `<div class="acc-dept">
      <div class="acc-dept-hd" onclick="_accToggle('${dk}b','${dk}a')">
        <span class="acc-arrow" id="${dk}a">▼</span>
        <span class="acc-dept-name">${dept}</span>
        <span class="acc-count">${bn(total)} জন</span>
      </div>
      <div class="acc-dept-bd" id="${dk}b">`;

    let bi = 0;
    for (const branch of Object.keys(branches)) {
      const bk = `${dk}_${bi++}`;
      const bEmps = branches[branch];

      html += `<div class="acc-branch">
        <div class="acc-branch-hd" onclick="_accToggle('${bk}b','${bk}a')">
          <span class="acc-arrow acc-arrow-sm" id="${bk}a">▼</span>
          <span class="acc-branch-name">${branch}</span>
          <span class="acc-count">${bn(bEmps.length)} জন</span>
        </div>
        <div class="acc-branch-bd" id="${bk}b">
          <div class="acc-emp-inner">`;

      bEmps.forEach((e) => {
        html += `<div class="emp-card ${selEmpId === e.id ? "selected" : ""}" id="ec-${e.id}">
          <div class="emp-acts">
            ${
              canEditEmp(e.id)
                ? `<button class="btn btn-outline btn-xs" onclick="event.stopPropagation();openEmpModal('${e.id}')">✏️</button>
                 ${isAdmin ? `<button class="btn btn-outline btn-xs" onclick="event.stopPropagation();adminResetEmpPassword('${e.id}')">🔑</button>` : ""}
                 ${isAdmin ? `<button class="btn btn-danger btn-xs" onclick="event.stopPropagation();delEmp('${e.id}')">🗑️</button>` : ""}`
                : ""
            }
          </div>
          <div class="emp-card-body" onclick="selectEmp('${e.id}')">
            <div class="emp-name">${e.name}</div>
            <div class="emp-meta">${e.desig} · IC: ${_normIC(e.ic)}<br>বেতন: ৳ ${(+e.basic).toLocaleString("en-IN")}<br>হার: ${bn(hourlyRate(e.basic))} টাকা/ঘন্টা</div>
          </div>
        </div>`;
      });

      html += `</div></div></div>`;
    }
    html += `</div></div>`;
  }

  container.innerHTML = html;
}

function _accToggle(bodyId, arrowId) {
  const body = document.getElementById(bodyId);
  const arrow = document.getElementById(arrowId);
  if (!body) return;
  const isOpen = body.style.display !== "none";
  body.style.display = isOpen ? "none" : "";
  if (arrow) arrow.textContent = isOpen ? "▶" : "▼";
}

function _accToggleDept(dk) {
  const arrow = document.getElementById(dk + "a");
  const isOpen = arrow?.textContent === "▼";
  if (arrow) arrow.textContent = isOpen ? "▶" : "▼";
  document
    .querySelectorAll(`.acc-tbl-dept-${dk}`)
    .forEach((r) => (r.style.display = isOpen ? "none" : ""));
  if (!isOpen) {
    // Re-expanding: restore each branch to its own collapse state
    document
      .querySelectorAll(`.acc-tbl-branch[data-dk="${dk}"]`)
      .forEach((br) => {
        br.style.display = "";
        const bk = br.dataset.bk;
        const ba = document.getElementById(bk + "a");
        if (ba?.textContent === "▶") {
          document
            .querySelectorAll(`.acc-tbl-branch-${bk}`)
            .forEach((er) => (er.style.display = "none"));
        }
      });
  }
}

function _accToggleBranch(dk, bk) {
  const arrow = document.getElementById(bk + "a");
  const isOpen = arrow?.textContent === "▼";
  if (arrow) arrow.textContent = isOpen ? "▶" : "▼";
  document
    .querySelectorAll(`.acc-tbl-branch-${bk}`)
    .forEach((r) => (r.style.display = isOpen ? "none" : ""));
}

async function selectEmp(id) {
  if (_isEmployee() && id !== _myEmpId()) {
    toast("আপনি শুধু নিজের তথ্য ব্যবহার করতে পারবেন", "er");
    return;
  }
  selEmpId = id;
  const emp = DB.emps().find((e) => e.id === id);
  if (!emp) return;
  document.getElementById("step2EmpName").textContent = emp.name;
  document.getElementById("step2EmpMeta").textContent =
    `${emp.desig} | ${emp.dept} | ${emp.branch} | IC: ${_normIC(emp.ic)}`;
  document.getElementById("billBasic").value = emp.basic;
  const now = new Date();
  const defMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  document.getElementById("billMonth").value = defMonth;
  document.getElementById("card-step2").style.display = "block";
  _loadBillDescCard(emp.branch);
  generateRows(defMonth);
  recalc();
  renderEmpGrid();
  document.getElementById("card-step2").scrollIntoView({ behavior: "smooth" });
}

function deselectEmp() {
  selEmpId = null;
  document.getElementById("card-step2").style.display = "none";
  const dc = document.getElementById("card-bill-desc");
  if (dc) dc.style.display = "none";
  document.getElementById("otTbody").innerHTML = "";
  renderEmpGrid();
}

function onMonthChange() {
  const m = document.getElementById("billMonth").value;
  if (m) generateRows(m);
}

/* ===================================================
   TIME SELECTS
=================================================== */
function buildTimeOpts(sel) {
  let html = "";
  for (let h = 0; h < 24; h++) {
    for (let min of [0, 30]) {
      const hh = String(h).padStart(2, "0"),
        mm = String(min).padStart(2, "0");
      const val = `${hh}:${mm}`;
      const lbl = bn(hh) + ":" + bn(mm);
      html += `<option value="${val}"${val === sel ? " selected" : ""}>${lbl}</option>`;
    }
  }
  html += `<option value="24:00"${"24:00" === sel ? " selected" : ""}>${bn("24")}:${bn("00")}</option>`;
  return html;
}

function initDefaultSelects() {
  document.getElementById("defFrom").innerHTML = buildTimeOpts("16:00");
  document.getElementById("defTo").innerHTML = buildTimeOpts("21:00");
}

function applyDefTime() {
  onDefTimeChange();
}

function updateCheckedRowsDefTime(from, to) {
  document.querySelectorAll("#otTbody tr").forEach((tr) => {
    const d = +tr.dataset.d;
    const cb = document.getElementById(`cb-${d}`);
    if (cb?.checked) {
      const fs = document.getElementById(`from-${d}`);
      const ts = document.getElementById(`to-${d}`);
      if (fs) fs.value = from;
      if (ts) ts.value = to;
      calcRowHrs(d);
    }
  });
}

function adjustTime(id, delta) {
  const sel = document.getElementById(id);
  const opts = Array.from(sel.options);
  const currentIdx = sel.selectedIndex;
  const newIdx = Math.max(0, Math.min(opts.length - 1, currentIdx + delta));
  sel.selectedIndex = newIdx;
  onDefTimeChange();
}

function onDefTimeChange() {
  // Update all checked rows with new default times
  const from = document.getElementById("defFrom").value;
  const to = document.getElementById("defTo").value;
  updateCheckedRowsDefTime(from, to);
  recalc();
}

/* ===================================================
   FULL MONTH ROWS
=================================================== */
const BN_DAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];
const BN_MONTHS_S = [
  "জানু",
  "ফেব্রু",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টে",
  "অক্টো",
  "নভে",
  "ডিসে",
];

function daysInMonth(ym) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

function hrsFromTime(from, to) {
  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);
  const diff = th * 60 + tm - (fh * 60 + fm);
  return diff > 0 ? Number.parseFloat((diff / 60).toFixed(1)) : 0;
}

function generateRows(ym) {
  const [y, m] = ym.split("-").map(Number);
  const days = daysInMonth(ym);
  const defFrom = document.getElementById("defFrom").value || "16:00";
  const defTo = document.getElementById("defTo").value || "21:00";
  const bnM = BN_MONTHS_S[m - 1];
  let html = "";
  for (let d = 1; d <= days; d++) {
    const dow = new Date(y, m - 1, d).getDay();
    const isFri = dow === 5;
    const isSat = dow === 6;
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    let dayCls = "";
    if (isFri) dayCls = "is-fri";
    else if (isSat) dayCls = "is-sat";
    html += `<tr class="row-off ${dayCls}" id="otr-${d}" data-d="${d}" data-date="${dateStr}">
      <td><input type="checkbox" class="ot-cb" id="cb-${d}" onchange="toggleRow(${d})"></td>
      <td style="color:var(--muted);font-size:12px" id="sn-${d}">—</td>
      <td class="dc" style="font-weight:600;color:var(--white)">${bn(d)} ${bnM} ${bn(y)}</td>
      <td class="dc">${BN_DAYS[dow]}</td>
      <td><select id="from-${d}" disabled onchange="calcRowHrs(${d})">${buildTimeOpts(defFrom)}</select></td>
      <td><select id="to-${d}" disabled onchange="calcRowHrs(${d})">${buildTimeOpts(defTo)}</select></td>
      <td class="hc" id="h-${d}">—</td>
    </tr>`;
  }
  document.getElementById("otTbody").innerHTML = html;
  document.getElementById("cbAll").checked = false;
  recalc();
}

function toggleRow(d) {
  const cb = document.getElementById(`cb-${d}`);
  const row = document.getElementById(`otr-${d}`);
  const fs = document.getElementById(`from-${d}`);
  const ts = document.getElementById(`to-${d}`);
  const hc = document.getElementById(`h-${d}`);
  if (cb.checked) {
    row.classList.replace("row-off", "row-on");
    fs.disabled = false;
    ts.disabled = false;
    hc.textContent = bn(hrsFromTime(fs.value, ts.value));
  } else {
    row.classList.replace("row-on", "row-off");
    fs.disabled = true;
    ts.disabled = true;
    hc.textContent = "—";
  }
  recalc();
}

function calcRowHrs(d) {
  const fs = document.getElementById(`from-${d}`);
  const ts = document.getElementById(`to-${d}`);
  const hc = document.getElementById(`h-${d}`);
  if (fs && ts && hc) hc.textContent = bn(hrsFromTime(fs.value, ts.value));
  recalc();
}

function selectAll(checked) {
  document.querySelectorAll("#otTbody tr").forEach((tr) => {
    const d = +tr.dataset.d;
    const cb = document.getElementById(`cb-${d}`);
    if (!cb) return;
    const isFriSat =
      tr.classList.contains("is-fri") || tr.classList.contains("is-sat");
    if (checked && isFriSat) return; // skip weekends when selecting all
    if (cb.checked !== checked) {
      cb.checked = checked;
      toggleRow(d);
    }
  });
}

function recalc() {
  let totHrs = 0,
    selDays = 0,
    serial = 1;
  document.querySelectorAll("#otTbody tr").forEach((tr) => {
    const d = +tr.dataset.d;
    const cb = document.getElementById(`cb-${d}`);
    const sn = document.getElementById(`sn-${d}`);
    if (cb?.checked) {
      const raw = document.getElementById(`h-${d}`)?.textContent || "0";
      const h =
        Number.parseFloat(
          raw.replace(/[০-৯]/g, (c) => "০১২৩৪৫৬৭৮৯".indexOf(c)),
        ) || 0;
      totHrs += h;
      selDays++;
      if (sn) sn.textContent = bn(serial++);
    } else if (sn) {
      sn.textContent = "—";
    }
  });
  const basic = +document.getElementById("billBasic").value || 0;
  const rate = hourlyRate(basic);
  const amt = Math.ceil(totHrs * rate);
  document.getElementById("selDays").textContent = bn(selDays);
  document.getElementById("totHrsCell").textContent = bn(totHrs);
  document.getElementById("sm-hrs").textContent = bn(totHrs) + " ঘন্টা";
  document.getElementById("sm-rate").textContent = bn(rate) + " টাকা/ঘন্টা";
  document.getElementById("sm-total").textContent =
    "৳ " + bn(amt.toLocaleString("en-IN"));
  document.getElementById("sm-words").textContent =
    amt > 0 ? "কথায়ঃ " + bnWords(amt) + " টাকা মাত্র।" : "—";
}

function getCheckedRows() {
  const rows = [];
  document.querySelectorAll("#otTbody tr").forEach((tr) => {
    const d = +tr.dataset.d;
    const cb = document.getElementById(`cb-${d}`);
    if (!cb?.checked) return;
    const fs = document.getElementById(`from-${d}`)?.value || "16:00";
    const ts = document.getElementById(`to-${d}`)?.value || "21:00";
    const raw = document.getElementById(`h-${d}`)?.textContent || "0";
    const h =
      Number.parseFloat(
        raw.replace(/[০-৯]/g, (c) => "০১২৩৪৫৬৭৮৯".indexOf(c)),
      ) || 0;
    rows.push({
      date: tr.dataset.date,
      from: fs.replace(":", ""),
      to: ts.replace(":", ""),
      hours: h,
    });
  });
  return rows;
}

/* ===================================================
   SAVE BILL
=================================================== */
async function saveBill() {
  if (!selEmpId) {
    toast("কর্মচারী নির্বাচন করুন", "er");
    return;
  }
  const rows = getCheckedRows();
  if (!rows.length) {
    toast("কমপক্ষে একটি তারিখ নির্বাচন করুন", "er");
    return;
  }
  const basic = +document.getElementById("billBasic").value || 0;
  if (!basic) {
    toast("মূল বেতন দিন", "er");
    return;
  }
  const rate = hourlyRate(basic);
  const totHrs = rows.reduce((s, r) => s + r.hours, 0);
  const totalAmt = Math.ceil(totHrs * rate);
  const bill = {
    id: uid(),
    empId: selEmpId,
    month: document.getElementById("billMonth").value,
    basic,
    rate,
    entries: rows,
    totalHours: totHrs,
    totalAmt,
    note: document.getElementById("billNote").value,
    billDesc: document.getElementById("billDescInput").value.trim(),
    supComment: document.getElementById("supCommentInput").value.trim(),
    createdAt: new Date().toISOString(),
  };
  try {
    await DB.addBill(bill);
    toast("বিল সংরক্ষণ হয়েছে ✓");
  } catch {}
}

/* ===================================================
   ALL BILLS
=================================================== */
function renderBills(filter) {
  filter = (filter || "").toLowerCase();
  const bills = _visibleBills();
  const emps  = _visibleEmps();
  const tbody = document.getElementById("bills-tbody");
  let list = [...bills].reverse();
  if (filter)
    list = list.filter((b) => {
      const emp = emps.find((e) => e.id === b.empId) || {};
      return (
        (emp.name || "").toLowerCase().includes(filter) ||
        (b.month || "").includes(filter)
      );
    });
  if (!list.length) {
    tbody.innerHTML =
      '<tr><td colspan="9"><div class="empty"><div class="empty-ico">📋</div><p>কোনো বিল নেই</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = list
    .map((b) => {
      const emp = emps.find((e) => e.id === b.empId) || {};
      return `<tr>
      <td><strong>${emp.name || "—"}</strong></td>
      <td><span class="badge badge-blue">${emp.desig || "—"}</span></td>
      <td>${_normIC(emp.ic)}</td>
      <td>${fmtMonthBn(b.month)}</td>
      <td style="text-align:center">${bn(b.entries?.length || 0)}</td>
      <td><span class="badge badge-gold">${bn(b.totalHours || 0)} ঘন্টা</span></td>
      <td>${bn(b.rate || 0)} টাকা</td>
      <td><span class="text-gold bold">৳ ${bn((b.totalAmt || 0).toLocaleString("en-IN"))}</span></td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-xs" onclick="printBill('${b.id}')">🖨️</button>
          ${isAdmin ? `<button class="btn btn-danger btn-xs" onclick="delBill('${b.id}')">🗑️</button>` : ""}
        </div>
      </td>
    </tr>`;
    })
    .join("");
}

function filterBills(v) {
  renderBills(v);
}

async function delBill(id) {
  if (!isAdmin) {
    toast("শুধু Admin মুছতে পারবেন", "er");
    return;
  }
  if (!confirm("এই বিল মুছবেন?")) return;
  try {
    await DB.deleteBill(id);
    toast("বিল মুছে ফেলা হয়েছে");
  } catch {}
}

/* ===================================================
   PRINT — A4 GENERATION
=================================================== */
const RAJOSBO_BRANCH = "রাজস্ব ও রিটার্ন";
const BILL_DESC =
  "উল্লেখিত তারিখে অফিস সময়ের পরে বন্দর মাশুল আদায়ের এ্যাসেসমেন্ট প্রস্তুত, বিল আদায়, ব্যাংকে জমা দান, রাজস্ব আয়ের হিসাব এবং মালামাল হ্যান্ডলিং এর প্রতিবেদন প্রস্তুত সহ অন্যান্য দাপ্তরিক জরুরী কাজ করিয়াছি।";
const SUP_COMMENT =
  "এই মর্মে প্রত্যায়ন করা যাইতেছে যে, সে উল্লেখিত দিনগুলি অফিস সময়ের পরে অবস্থান করিয়া বন্দর মাশুল আদায়ের এ্যাসেসমেন্ট প্রস্তুত, বিল আদায়, ব্যাংকে জমা দান, রাজস্ব আয়ের হিসাব এবং মালামাল হ্যান্ডলিং এর প্রতিবেদন প্রস্তুত সহ অন্যান্য দাপ্তরিক জরুরী কাজ করিয়াছে।";

async function _getBranchDescs() {
  if (_fsReady) {
    try {
      const { getDoc, doc, db } = globalThis._fs;
      const snap = await getDoc(doc(db, "settings", "branchDescs"));
      if (snap.exists()) return snap.data();
    } catch {}
  }
  try { return JSON.parse(localStorage.getItem("otb_branch_descs") || "{}"); }
  catch { return {}; }
}

async function _saveBranchDescs(descs) {
  localStorage.setItem("otb_branch_descs", JSON.stringify(descs));
  if (_fsReady) {
    try {
      const { setDoc, doc, db } = globalThis._fs;
      await setDoc(doc(db, "settings", "branchDescs"), descs);
    } catch (err) {
      toast("Firebase সংরক্ষণ ব্যর্থ: " + (err.code || err.message), "er");
    }
  }
}

async function _loadBillDescCard(branch) {
  const card = document.getElementById("card-bill-desc");
  if (!card) return;
  const saved = (await _getBranchDescs())[branch] || {};
  const defaultDesc = branch === RAJOSBO_BRANCH ? BILL_DESC : "";
  const defaultSup  = branch === RAJOSBO_BRANCH ? SUP_COMMENT : "";
  document.getElementById("billDescInput").value = saved.billDesc ?? defaultDesc;
  document.getElementById("supCommentInput").value = saved.supComment ?? defaultSup;
  card.style.display = "block";
}

async function saveBranchDescTemplate() {
  const emp = DB.emps().find((e) => e.id === selEmpId);
  if (!emp) return;
  const descs = await _getBranchDescs();
  descs[emp.branch] = {
    billDesc: document.getElementById("billDescInput").value.trim(),
    supComment: document.getElementById("supCommentInput").value.trim(),
  };
  await _saveBranchDescs(descs);
  toast("'" + emp.branch + "' শাখার টেমপ্লেট সংরক্ষিত হয়েছে ✓");
}

function fmtDate(ds) {
  const [y, m, d] = ds.split("-");
  return bn(d.padStart(2, "0") + "/" + m.padStart(2, "0") + "/" + y);
}

function fmtTime4(t) {
  // t = "1600" or "16:00"
  return bn((t || "").replace(":", "").padStart(4, "0"));
}

function fmtHrs(h) {
  const n = Number.parseFloat(h) || 0;
  const i = Math.floor(n);
  const d = String(Math.ceil((n - i) * 100)).padStart(2, "0");
  return bn(i) + "." + bn(d);
}

function buildA4(bill, emp) {
  const entries = bill.entries || [];
  const totHrs = bill.totalHours || 0;
  const rate = bill.rate || 0;
  const amt = bill.totalAmt || 0;
  const amtWords = bnWords(amt);
  const rowspan = entries.length + 1; // data rows + total row
  const bnSalary = bn(bill.basic || 0);
  const bnRate = bn(rate);
  const bnHrs = bn(totHrs);
  const bnAmt = bn(amt.toLocaleString("en-IN"));

  let trs = "";
  entries.forEach((e, i) => {
    if (i === 0) {
      trs += `<tr>
        <td>${fmtDate(e.date)}</td>
        <td>${fmtTime4(e.from)}</td>
        <td>${fmtTime4(e.to)}</td>
        <td>${fmtHrs(e.hours)} ঘন্টা</td>
        <td class="dc-cell" rowspan="${rowspan}">${bill.billDesc || BILL_DESC}</td>
        <td class="dc-cell" rowspan="${rowspan}">${bill.supComment || SUP_COMMENT}</td>
      </tr>`;
    } else {
      trs += `<tr>
        <td>${fmtDate(e.date)}</td>
        <td>${fmtTime4(e.from)}</td>
        <td>${fmtTime4(e.to)}</td>
        <td>${fmtHrs(e.hours)} ঘন্টা</td>
      </tr>`;
    }
  });
  // Total row
  trs += `<tr class="total-row">
    <td colspan="3" style="text-align:right;vertical-align:middle;padding:2px 7px;">মোট অতিরিক্ত কর্মঘন্টা</td>
    <td>${bnHrs} ঘন্টা</td>
  </tr>`;

  return `<div class="a4">
  <div class="a4-head-org">মোংলা বন্দর কর্তৃপক্ষ</div>
  <div class="a4-head-addr">মোংলা, বাগেরহাট।</div>
  <div class="a4-head-form">অতিরিক্ত কাজের বিল ফরম।</div>

  <table class="a4-emp-tbl">
    <tbody><tr>
      <td class="al" style="padding-top: 1.21806px; padding-bottom: 1.21806px;">নামঃ</td><td style="padding-top: 1.21806px; padding-bottom: 1.21806px;">${emp.name || ""}</td>
      <td style="width: 20px; padding-top: 1.21806px; padding-right:150px; padding-bottom: 1.21806px;"></td>
      <td class="al" style="padding-top: 1.21806px; padding-bottom: 1.21806px;">পদবীঃ</td><td style="padding-top: 1.21806px; padding-bottom: 1.21806px;">${emp.desig || ""}</td>
    </tr>
    <tr>
      <td class="al" style="padding-top: 1.21806px; padding-bottom: 1.21806px;">বিভাগঃ</td><td style="padding-top: 1.21806px; padding-bottom: 1.21806px;">${emp.dept || "ট্রাফিক"}</td>
      <td style="padding-top: 1.21806px; padding-right:150px; padding-bottom: 1.21806px;"></td>
      <td class="al" style="padding-top: 1.21806px; padding-bottom: 1.21806px;">শাখাঃ</td><td style="padding-top: 1.21806px; padding-bottom: 1.21806px;">${emp.branch || "রাজস্ব ও রিটার্ন"}</td>
    </tr>
    <tr>
      <td class="al" style="padding-top: 1.21806px; padding-bottom: 1.21806px;">মূল বেতনঃ</td><td style="padding-top: 1.21806px; padding-bottom: 1.21806px;">${bnSalary}</td>
      <td style="padding-top: 1.21806px; padding-right:150px; padding-bottom: 1.21806px;"></td>
      <td class="al" style="padding-top: 1.21806px; padding-bottom: 1.21806px;">আই,সি, নং-</td><td style="padding-top: 1.21806px; padding-bottom: 1.21806px;">${emp.ic ? _normIC(emp.ic) : ""}</td>
    </tr>
  </tbody></table>

  <table class="a4-ot-tbl">
    <colgroup>
      <col style="width:16%"><col style="width:8%"><col style="width:8%">
      <col style="width:11%"><col style="width:28.5%"><col style="width:28.5%">
    </colgroup>
    <thead><tr>
      <th>তারিখ</th><th>হইতে</th><th>পর্যন্ত</th>
      <th>মোট ঘন্টা</th><th>অতিরিক্ত কাজের বিবরন</th><th>সুপারভাইজারী কর্মকর্তার মন্তব্য</th>
    </tr></thead>
    <tbody>${trs}</tbody>
  </table>

  <div class="a4-summary">
    মোটঃ <strong>${bnHrs}</strong> ঘন্টা অতিরিক্ত কাজের জন্য, <strong>${bnSalary}</strong> টাকা মূল বেতনে, প্রতি ঘন্টা <strong>${bnRate}</strong> টাকা হিসাবে <strong>${bnAmt} টাকা</strong> (কথায়ঃ <strong>${amtWords} টাকা</strong>) মাত্র। এর জন্য আবেদন করিতেছি।
  </div>

  <div class="a4-verify">পরীক্ষা করিলাম সঠিক আছে।</div>

  <table class="a4-ti-tbl" style="margin-top: 9px; margin-bottom: 5px;">
    <tbody><tr>
      <td style="width:50%">টি আই/শাখা প্রধান</td>
      <td style="width:50%;padding-left:25%">আবেদনকারীর স্বাক্ষর<br>তারিখঃ</td>
    </tr>
  </tbody></table>

  <div class="a4-approval" style="margin-top:8px;">
    <div style="display:flex;align-items:flex-end;gap:2px;">
      <span style="white-space:nowrap;">সর্বমোট ..................... ঘন্টায় ..................... টাকা (কথায়ঃ</span>
      <span style="flex:1;overflow:hidden;letter-spacing:2px;margin-bottom:1px;min-width:20px;">............................................................................................................................................................................................................</span>
      <span style="white-space:nowrap;">)</span>
    </div>
    <div>এর অনুমোদন দেয়া যায়।</div>
  </div>

  <div class="a4-sigs">
    <div class="a4-sig-col">ট্রাফিক অফিসার</div>
    <div class="a4-sig-col">সহকারী ট্রাফিক ম্যানেজার</div>
    <div class="a4-sig-col">অনুমোদনকারী কর্মকর্তা</div>
  </div>
</div>`;
}

/* ===================================================
   FIT TO A4 — Phase1: compress gaps; Phase2: table font only
=================================================== */
function normalizeA4PageMargins(page) {
  page.querySelectorAll("*").forEach((el) => {
    if (getComputedStyle(el).marginTop === "auto") el.style.marginTop = "0";
  });
}

function compressA4PageSpacing(page, ratio) {
  page.querySelectorAll(".a4-ot-tbl td, .a4-ot-tbl th").forEach((el) => {
    const cs = getComputedStyle(el);
    const pt = Number.parseFloat(cs.paddingTop) || 0;
    const pb = Number.parseFloat(cs.paddingBottom) || 0;
    const lh = Number.parseFloat(cs.lineHeight) || 18;
    el.style.paddingTop = Math.max(1, pt * ratio) + "px";
    el.style.paddingBottom = Math.max(1, pb * ratio) + "px";
    el.style.lineHeight = Math.max(1, lh * ratio) + "px";
  });

  page.querySelectorAll("*").forEach((el) => {
    const cs = getComputedStyle(el);
    ["marginTop", "marginBottom", "paddingTop", "paddingBottom"].forEach(
      (p) => {
        const v = Number.parseFloat(cs[p]) || 0;
        if (v > 1) el.style[p] = Math.max(0, v * ratio) + "px";
      },
    );
  });

  const pp = Number.parseFloat(getComputedStyle(page).paddingTop) || 0;
  if (pp > 2) page.style.paddingTop = Math.max(2, pp * ratio) + "px";
}

function compressA4TableFont(tbl, ratio) {
  tbl.querySelectorAll("td, th").forEach((el) => {
    const fs = Number.parseFloat(getComputedStyle(el).fontSize) || 14;
    const lh = Number.parseFloat(getComputedStyle(el).lineHeight) || 18;
    el.style.fontSize = Math.max(9, fs * ratio) + "px";
    el.style.lineHeight = Math.max(1, lh * ratio) + "px";
  });
}

function fitToA4(page) {
  const A4_H = 1122; // 297mm @ 96dpi

  const origOverflow = page.style.overflow;
  const origHeight = page.style.height;
  page.style.overflow = "visible";
  page.style.height = "auto";

  if (page.scrollHeight <= A4_H) {
    page.style.overflow = origOverflow || "hidden";
    page.style.height = origHeight || "297mm";
    return;
  }

  normalizeA4PageMargins(page);

  for (let pass = 0; pass < 25 && page.scrollHeight > A4_H; pass++) {
    const ratio = A4_H / page.scrollHeight;
    compressA4PageSpacing(page, ratio);
  }

  if (page.scrollHeight > A4_H) {
    const tbl = page.querySelector(".a4-ot-tbl");
    if (tbl) {
      for (let pass = 0; pass < 20 && page.scrollHeight > A4_H; pass++) {
        const ratio = A4_H / page.scrollHeight;
        compressA4TableFont(tbl, ratio);
      }
    }
  }

  page.style.overflow = origOverflow || "hidden";
  page.style.height = origHeight || "297mm";
}

/* ===================================================
   PRINT MODAL
=================================================== */
function doPreviewPrint() {
  if (!selEmpId) {
    toast("কর্মচারী নির্বাচন করুন", "er");
    return;
  }
  const rows = getCheckedRows();
  if (!rows.length) {
    toast("কমপক্ষে একটি তারিখ নির্বাচন করুন", "er");
    return;
  }
  const basic = +document.getElementById("billBasic").value || 0;
  if (!basic) {
    toast("মূল বেতন দিন", "er");
    return;
  }
  const rate = hourlyRate(basic);
  const totHrs = rows.reduce((s, r) => s + r.hours, 0);
  const emp = DB.emps().find((e) => e.id === selEmpId) || {};
  const bill = {
    empId: selEmpId,
    month: document.getElementById("billMonth").value,
    basic,
    rate,
    entries: rows,
    totalHours: totHrs,
    totalAmt: Math.ceil(totHrs * rate),
    billDesc: document.getElementById("billDescInput").value.trim(),
    supComment: document.getElementById("supCommentInput").value.trim(),
  };
  showPrintModal(bill, emp);
}

function printBill(id) {
  const bill = DB.bills().find((b) => b.id === id);
  if (!bill) {
    toast("বিল পাওয়া যায়নি", "er");
    return;
  }
  const emp = DB.emps().find((e) => e.id === bill.empId) || {};
  showPrintModal(bill, emp);
}

function showPrintModal(bill, emp) {
  const html = buildA4(bill, emp);

  // Show preview
  document.getElementById("printPreview").innerHTML =
    `<div style="background:white;">${html}</div>`;
  document.getElementById("printOverlay").classList.add("open");

  // Render printArea off-screen for measurement
  const pa = document.getElementById("printArea");
  pa.innerHTML = html;
  pa.style.cssText =
    "position:fixed;left:-9999px;top:0;display:block;visibility:hidden;pointer-events:none;";

  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const previewPage = document.querySelector("#printPreview .a4");
      if (previewPage) fitToA4(previewPage);
      const printPage = pa.querySelector(".a4");
      if (printPage) fitToA4(printPage);
      pa.style.cssText = "display:none;";
    }),
  );
}

function closePrint() {
  document.getElementById("printOverlay").classList.remove("open");
}

function doPrint() {
  const pa = document.getElementById("printArea");
  pa.style.cssText =
    "position:fixed;left:-9999px;top:0;display:block;visibility:hidden;pointer-events:none;";
  const style = document.createElement("style");
  style.id = "ps";
  style.textContent = `
    @page { size: A4 portrait; margin: 0; }
    @media print {
      body > * { display: none !important; }
      body > #printArea {
        display: block !important;
        visibility: visible !important;
        position: static !important;
        left: auto !important;
      }
      #printArea .a4 {
        width: 210mm !important;
        height: 297mm !important;
        background: white !important;
        overflow: hidden !important;
        font-family: 'Nikosh', 'Times New Roman', serif !important;
        display: flex !important;
        flex-direction: column !important;
        box-sizing: border-box !important;
      }
    }`;
  document.head.appendChild(style);
  const cleanupPrint = () => {
    document.getElementById("ps")?.remove();
    pa.style.cssText = "display:none;";
    globalThis.removeEventListener("afterprint", cleanupPrint);
  };
  globalThis.addEventListener("afterprint", cleanupPrint);
  globalThis.print();
}

/* ===================================================
   CLOSE OVERLAYS ON OUTSIDE CLICK
=================================================== */
document.getElementById("empOverlay").addEventListener("click", function (e) {
  if (e.target === this) closeEmpModal();
});
document.getElementById("printOverlay").addEventListener("click", function (e) {
  if (e.target === this) closePrint();
});
document.getElementById("empChangePwOverlay").addEventListener("click", function (e) {
  if (e.target === this) closeEmpChangePw();
});

/* ===================================================
   INIT
=================================================== */
initDefaultSelects();
document.getElementById("cpYear").textContent = new Date().getFullYear();
// Firebase listeners will call renderAll() once data loads
// If offline, the 3s timeout will load from localStorage
