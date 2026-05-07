/* ===================================================
   UTILITIES
=================================================== */
const bn = s => String(s).replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[d]);

function bnWords(n) {
  n = Math.round(n);
  if (n === 0) return 'শূন্য';
  const ones = ['','এক','দুই','তিন','চার','পাঁচ','ছয়','সাত','আট','নয়','দশ','এগারো','বারো','তেরো','চৌদ্দ','পনেরো','ষোলো','সতেরো','আঠারো','উনিশ','বিশ','একুশ','বাইশ','তেইশ','চব্বিশ','পঁচিশ','ছাব্বিশ','সাতাশ','আটাশ','ঊনত্রিশ','ত্রিশ','একত্রিশ','বত্রিশ','তেত্রিশ','চৌত্রিশ','পঁয়ত্রিশ','ছত্রিশ','সাতত্রিশ','আটত্রিশ','ঊনচল্লিশ','চল্লিশ','একচল্লিশ','বিয়াল্লিশ','তেতাল্লিশ','চৌচল্লিশ','পঁয়তাল্লিশ','ছেচল্লিশ','সাতচল্লিশ','আটচল্লিশ','ঊনপঞ্চাশ','পঞ্চাশ','একান্ন','বায়ান্ন','তিপান্ন','চুয়ান্ন','পঞ্চান্ন','ছাপান্ন','সাতান্ন','আটান্ন','ঊনষাট','ষাট','একষট্টি','বাষট্টি','তেষট্টি','চৌষট্টি','পঁয়ষট্টি','ছেষট্টি','সাতষট্টি','আটষট্টি','ঊনসত্তর','সত্তর','একাত্তর','বাহাত্তর','তিয়াত্তর','চুয়াত্তর','পঁচাত্তর','ছিয়াত্তর','সাতাত্তর','আটাত্তর','ঊনআশি','আশি','একাশি','বিরাশি','তিরাশি','চুরাশি','পঁচাশি','ছিয়াশি','সাতাশি','আটাশি','ঊননব্বই','নব্বই','একানব্বই','বিরানব্বই','তিরানব্বই','চুরানব্বই','পঁচানব্বই','ছিয়ানব্বই','সাতানব্বই','আটানব্বই','নিরানব্বই'];
  let r = '';
  if (n >= 10000000) { r += bnWords(Math.floor(n / 10000000)) + ' কোটি '; n %= 10000000; }
  if (n >= 100000)   { r += bnWords(Math.floor(n / 100000))   + ' লক্ষ '; n %= 100000; }
  if (n >= 1000)     { r += bnWords(Math.floor(n / 1000))     + ' হাজার '; n %= 1000; }
  if (n >= 100)      { r += ones[Math.floor(n / 100)] + ' শত '; n %= 100; }
  if (n > 0)         { r += ones[n]; }
  return r.trim();
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function fmtMonthBn(ym) {
  if (!ym) return '';
  const [y, m] = ym.split('-');
  const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  return months[+m - 1] + ' ' + bn(y);
}

function hourlyRate(basic) { return Math.round((+basic || 0) / 104); }

/* ===================================================
   FIREBASE DB — Firestore backend
   Falls back to localStorage if offline
=================================================== */
const SEED_EMPS = [
  { id: 'seed1', name: 'মোঃ এনামুল হক',            desig: 'এ টি আই',      dept: 'ট্রাফিক', branch: 'রাজস্ব ও রিটার্ন', basic: 27300, ic: '২৪৭২' },
  { id: 'seed2', name: 'মোঃ ইব্রাহীম খলিলূর রহমান', desig: 'এ টি আই',      dept: 'ট্রাফিক', branch: 'রাজস্ব ও রিটার্ন', basic: 24160, ic: '২৫০৬' },
  { id: 'seed3', name: 'মোঃ সামিউল আলম সুমেল',      desig: 'সিঃ আঃ এ্যাঃ', dept: 'ট্রাফিক', branch: 'রাজস্ব ও রিটার্ন', basic: 17680, ic: '২৯৩৫' },
  { id: 'seed4', name: 'মোঃ ইবনে হাসান',             desig: 'সিঃ আঃ এ্যাঃ', dept: 'ট্রাফিক', branch: 'রাজস্ব ও রিটার্ন', basic: 17680, ic: '২৯৩৩' },
  { id: 'seed5', name: 'মোঃ সাইদুল ইসলাম',          desig: 'জঃ আঃ এ্যাঃ',  dept: 'ট্রাফিক', branch: 'রাজস্ব ও রিটার্ন', basic: 9776,  ic: '৩৭৫৮' },
];

// In-memory cache (populated from Firestore via real-time listeners)
let _emps  = [];
let _bills = [];
let _fsReady = false;

const DB = {
  emps()  { return _emps; },
  bills() { return _bills; },

  async addEmp(data) {
    if (!_fsReady) { data.id = uid(); _emps.push(data); renderAll(); return; }
    const { addDoc, collection } = window._fs;
    const ref = await addDoc(collection('employees'), data);
    data.id = ref.id;
  },

  async updateEmp(id, data) {
    if (!_fsReady) {
      const i = _emps.findIndex(e => e.id === id);
      if (i > -1) _emps[i] = { ..._emps[i], ...data };
      renderAll(); return;
    }
    const { db, doc, setDoc } = window._fs;
    await setDoc(doc(db, 'employees', id), data);
  },

  async deleteEmp(id) {
    if (!_fsReady) { _emps = _emps.filter(e => e.id !== id); renderAll(); return; }
    const { db, doc, deleteDoc } = window._fs;
    await deleteDoc(doc(db, 'employees', id));
  },

  async addBill(data) {
    if (!_fsReady) { data.id = uid(); _bills.push(data); renderAll(); return; }
    const { addDoc, collection } = window._fs;
    const ref = await addDoc(collection('bills'), data);
    data.id = ref.id;
  },

  async deleteBill(id) {
    if (!_fsReady) { _bills = _bills.filter(b => b.id !== id); renderAll(); return; }
    const { db, doc, deleteDoc } = window._fs;
    await deleteDoc(doc(db, 'bills', id));
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
  const el = document.getElementById('fbStatus');
  if (!el) return;
  el.innerHTML = connected
    ? '<span style="color:#6ed4ae;font-size:12px;">🟢 Firebase</span>'
    : '<span style="color:#f5a742;font-size:12px;">🟡 Offline</span>';
}

// Setup real-time Firestore listeners
function setupListeners() {
  const { db, collection, onSnapshot, query, orderBy } = window._fs;

  // Employees listener
  onSnapshot(collection('employees'), snap => {
    _emps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderEmpTable();
    renderEmpGrid();
    renderDash();
    // Seed if empty
    if (_emps.length === 0) seedFirestore();
  }, err => { console.error('Emp listener:', err); });

  // Bills listener
  onSnapshot(collection('bills'), snap => {
    _bills = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    _bills.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
    renderBills();
    renderDash();
  }, err => { console.error('Bill listener:', err); });
}

async function seedFirestore() {
  const { addDoc, collection, doc, setDoc } = window._fs;
  for (const emp of SEED_EMPS) {
    const { id, ...data } = emp;
    await setDoc(doc(window._fs.db, 'employees', id), data);
  }
}

// Wait for Firebase module to load then start
window.addEventListener('firebaseReady', () => {
  _fsReady = true;
  setStatus(true);
  setupListeners();
  toast('☁️ Firebase সংযুক্ত হয়েছে', 'ok');
});

// Fallback: if Firebase doesn't load in 3s, use localStorage
setTimeout(() => {
  if (!_fsReady) {
    setStatus(false);
    try { _emps  = JSON.parse(localStorage.getItem('mpa_emps')  || '[]'); } catch { _emps  = []; }
    try { _bills = JSON.parse(localStorage.getItem('mpa_bills') || '[]'); } catch { _bills = []; }
    if (!_emps.length) { _emps = SEED_EMPS; localStorage.setItem('mpa_emps', JSON.stringify(_emps)); }
    renderAll();
    toast('⚠️ Offline mode — Firebase সংযুক্ত হয়নি', 'er');
  }
}, 3000);

/* ===================================================
   TOAST
=================================================== */
function toast(msg, type = 'ok') {
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.innerHTML = `<span>${type === 'ok' ? '✅' : '❌'}</span><span>${msg}</span>`;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), 3400);
}

/* ===================================================
   NAVIGATION
=================================================== */
const viewTitles = { 'dashboard': 'ড্যাশবোর্ড', 'new-bill': 'নতুন OT বিল', 'all-bills': 'সকল বিল', 'employees': 'কর্মচারী ডেটাবেস' };

function goView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const v = document.getElementById('view-' + name);
  if (v) v.classList.add('active');
  const ni = document.querySelector('[data-view="' + name + '"]');
  if (ni) ni.classList.add('active');
  document.getElementById('viewTitle').textContent = viewTitles[name] || name;
  if (name === 'dashboard')  renderDash();
  if (name === 'employees')  renderEmpTable();
  if (name === 'new-bill')   renderEmpGrid();
  if (name === 'all-bills')  renderBills();
}

/* ===================================================
   DASHBOARD
=================================================== */
function renderDash() {
  const emps = DB.emps(), bills = DB.bills();
  const totHrs = bills.reduce((s, b) => s + (b.totalHours || 0), 0);
  const totAmt = bills.reduce((s, b) => s + (b.totalAmt || 0), 0);
  document.getElementById('s-emp').textContent   = bn(emps.length);
  document.getElementById('s-bills').textContent = bn(bills.length);
  document.getElementById('s-hrs').textContent   = bn(totHrs);
  document.getElementById('s-amt').textContent   = bn(totAmt.toLocaleString('en-IN'));

  const tbody = document.getElementById('dash-tbody');
  const recent = [...bills].reverse().slice(0, 10);
  if (!recent.length) { tbody.innerHTML = '<tr><td colspan="6"><div class="empty"><div class="empty-ico">📋</div><p>কোনো বিল নেই</p></div></td></tr>'; return; }
  tbody.innerHTML = recent.map(b => {
    const emp = emps.find(e => e.id === b.empId) || {};
    return `<tr>
      <td><strong>${emp.name || '—'}</strong></td>
      <td><span class="badge badge-blue">${emp.desig || '—'}</span></td>
      <td>${fmtMonthBn(b.month)}</td>
      <td><span class="badge badge-gold">${bn(b.totalHours)} ঘন্টা</span></td>
      <td><span class="text-gold bold">৳ ${bn((b.totalAmt || 0).toLocaleString('en-IN'))}</span></td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-xs" onclick="printBill('${b.id}')">🖨️</button>
          <button class="btn btn-danger btn-xs" onclick="delBill('${b.id}')">🗑️</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

/* ===================================================
   ADMIN MODE — Secure password auth (SHA-256)
   Default password: MPA@2026
   Ctrl+Shift to open login / logout
=================================================== */
let isAdmin = false;

// SHA-256 hash of default password "MPA@2026"
const ADMIN_ID   = 'admin';
const ADMIN_HASH = 'b3172a1c080abf5ec4ee8a514506bd1f04d442804a691d9f9b19928360861560'; // sas@911225

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function tryAdminLogin() {
  const id = document.getElementById('adminIdInput').value.trim();
  const pw = document.getElementById('adminPwInput').value;
  if (!id || !pw) { showAdminError('ID এবং পাসওয়ার্ড দিন'); return; }
  if (id !== ADMIN_ID) { showAdminError('Admin ID ভুল!'); document.getElementById('adminIdInput').focus(); return; }
  const hash   = await sha256(pw);
  const stored = localStorage.getItem('mpa_admin_hash') || ADMIN_HASH;
  if (hash === stored) {
    closeAdminModal();
    setAdmin(true);
  } else {
    showAdminError('পাসওয়ার্ড ভুল!');
    document.getElementById('adminPwInput').value = '';
    document.getElementById('adminPwInput').focus();
  }
}

async function changeAdminPassword() {
  const cur  = document.getElementById('adminCurPw').value;
  const nw   = document.getElementById('adminNewPw').value;
  const nw2  = document.getElementById('adminNewPw2').value;
  if (!cur || !nw || !nw2) { showAdminError('সব ঘর পূরণ করুন'); return; }
  if (nw !== nw2) { showAdminError('নতুন পাসওয়ার্ড মিলছে না'); return; }
  if (nw.length < 6) { showAdminError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর'); return; }
  const curHash = await sha256(cur);
  const stored  = localStorage.getItem('mpa_admin_hash') || ADMIN_HASH;
  if (curHash !== stored) { showAdminError('বর্তমান পাসওয়ার্ড ভুল'); return; }
  const newHash = await sha256(nw);
  localStorage.setItem('mpa_admin_hash', newHash);
  document.getElementById('adminCurPw').value  = '';
  document.getElementById('adminNewPw').value  = '';
  document.getElementById('adminNewPw2').value = '';
  showAdminError('');
  toast('পাসওয়ার্ড পরিবর্তন হয়েছে ✓', 'ok');
  showAdminTab('login');
}

function showAdminError(msg) {
  const el1 = document.getElementById('adminError');
  const el2 = document.getElementById('adminErrorChange');
  if (el1) el1.textContent = msg;
  if (el2) el2.textContent = msg;
}

function showAdminTab(tab) {
  document.getElementById('adminLoginTab').style.display  = tab === 'login'  ? 'block' : 'none';
  document.getElementById('adminChangeTab').style.display = tab === 'change' ? 'block' : 'none';
  document.getElementById('adminTabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('adminTabChange').classList.toggle('active', tab === 'change');
  showAdminError('');
}

function openAdminModal() {
  if (isAdmin) {
    // Already admin — offer logout or change password
    document.getElementById('adminLogoutSection').style.display = 'flex';
    document.getElementById('adminLoginSection').style.display  = 'none';
  } else {
    document.getElementById('adminLogoutSection').style.display = 'none';
    document.getElementById('adminLoginSection').style.display  = 'block';
    showAdminTab('login');
  }
  document.getElementById('adminOverlay').classList.add('open');
  setTimeout(() => { document.getElementById('adminIdInput')?.focus(); }, 100);
}

function closeAdminModal() {
  document.getElementById('adminOverlay').classList.remove('open');
  const id = document.getElementById('adminIdInput');
  const pw = document.getElementById('adminPwInput');
  if (id) id.value = '';
  if (pw) pw.value = '';
  showAdminError('');
}

function setAdmin(val) {
  isAdmin = val;
  const badge = document.getElementById('adminBadge');
  if (isAdmin) {
    badge.style.display = 'inline-flex';
    toast('🔐 Admin Mode চালু', 'ok');
  } else {
    badge.style.display = 'none';
    toast('🔒 Admin Mode বন্ধ', 'ok');
  }
  renderEmpTable();
  renderEmpGrid();
}

function adminLogout() {
  closeAdminModal();
  setAdmin(false);
}

function openChangePwFromAdmin() {
  document.getElementById('adminLogoutSection').style.display = 'none';
  document.getElementById('adminLoginSection').style.display  = 'block';
  showAdminTab('change');
  ['adminCurPw','adminNewPw','adminNewPw2'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
}

document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.shiftKey && !e.key.match(/^[a-zA-Z]$/)) {
    e.preventDefault();
    openAdminModal();
  }
});

// Enter key in password field
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('adminPwInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') tryAdminLogin();
  });
});

/* ===================================================
   EMPLOYEE CRUD
=================================================== */
let editEmpId = null;

function openEmpModal(id) {
  if (id && !isAdmin) { toast('শুধু Admin সম্পাদনা করতে পারবেন', 'er'); return; }
  editEmpId = id || null;
  const modal = document.getElementById('empOverlay');
  modal.classList.add('open');
  if (id) {
    const e = DB.emps().find(x => x.id === id);
    if (!e) return;
    document.getElementById('empModalTitle').textContent = 'কর্মচারী সম্পাদনা';
    document.getElementById('ef-name').value   = e.name;
    document.getElementById('ef-desig').value  = e.desig;
    document.getElementById('ef-ic').value     = e.ic;
    document.getElementById('ef-dept').value   = e.dept;
    document.getElementById('ef-branch').value = e.branch;
    document.getElementById('ef-basic').value  = e.basic;
    updateHourlyHint();
  } else {
    document.getElementById('empModalTitle').textContent = 'কর্মচারী যোগ';
    ['ef-name','ef-desig','ef-ic','ef-basic'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('ef-dept').value   = 'ট্রাফিক';
    document.getElementById('ef-branch').value = 'রাজস্ব ও রিটার্ন';
    document.getElementById('hourly-hint').textContent = '—';
  }
}

function closeEmpModal() { document.getElementById('empOverlay').classList.remove('open'); }

function updateHourlyHint() {
  const v = +document.getElementById('ef-basic').value || 0;
  document.getElementById('hourly-hint').textContent = v ? bn(hourlyRate(v)) + ' টাকা' : '—';
}

async function saveEmp() {
  const name   = document.getElementById('ef-name').value.trim();
  const desig  = document.getElementById('ef-desig').value.trim();
  const ic     = document.getElementById('ef-ic').value.trim();
  const dept   = document.getElementById('ef-dept').value.trim();
  const branch = document.getElementById('ef-branch').value.trim();
  const basic  = +document.getElementById('ef-basic').value || 0;
  if (!name || !desig || !basic) { toast('নাম, পদবী ও মূল বেতন আবশ্যক', 'er'); return; }
  const data = { name, desig, ic, dept, branch, basic };
  if (editEmpId) {
    await DB.updateEmp(editEmpId, data);
    toast('কর্মচারী আপডেট ✓');
  } else {
    await DB.addEmp(data);
    toast('কর্মচারী যোগ ✓');
  }
  closeEmpModal();
}

async function delEmp(id) {
  if (!isAdmin) { toast('শুধু Admin মুছতে পারবেন', 'er'); return; }
  if (!confirm('এই কর্মচারী মুছবেন?')) return;
  if (selEmpId === id) deselectEmp();
  await DB.deleteEmp(id);
  toast('মুছে ফেলা হয়েছে');
}

function renderEmpTable() {
  const emps = DB.emps();
  const tbody = document.getElementById('emp-tbody');
  if (!emps.length) { tbody.innerHTML = '<tr><td colspan="8"><div class="empty"><div class="empty-ico">👤</div><p>কোনো কর্মচারী নেই</p></div></td></tr>'; return; }
  tbody.innerHTML = emps.map(e => `<tr>
    <td><strong>${e.name}</strong></td>
    <td><span class="badge badge-blue">${e.desig}</span></td>
    <td>${e.dept}</td>
    <td>${e.branch}</td>
    <td><span class="text-gold">৳ ${(+e.basic).toLocaleString('en-IN')}</span></td>
    <td>${e.ic || '—'}</td>
    <td><span class="badge badge-gold">${bn(hourlyRate(e.basic))} টাকা</span></td>
    <td>
      <div class="flex gap-2">
        ${isAdmin ? `<button class="btn btn-outline btn-xs" onclick="openEmpModal('${e.id}')">✏️</button>
        <button class="btn btn-danger btn-xs" onclick="delEmp('${e.id}')">🗑️</button>` : '<span class="text-muted text-xs">—</span>'}
      </div>
    </td>
  </tr>`).join('');
}

/* ===================================================
   EMPLOYEE SELECTOR (New Bill)
=================================================== */
let selEmpId = null;

function renderEmpGrid() {
  const emps = DB.emps();
  const grid = document.getElementById('empGrid');
  const empty = document.getElementById('empEmpty');
  if (!emps.length) { grid.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  grid.innerHTML = emps.map(e => `
    <div class="emp-card ${selEmpId === e.id ? 'selected' : ''}" id="ec-${e.id}">
      <div class="emp-acts">
        ${isAdmin ? `<button class="btn btn-outline btn-xs" onclick="event.stopPropagation();openEmpModal('${e.id}')">✏️</button>
        <button class="btn btn-danger btn-xs" onclick="event.stopPropagation();delEmp('${e.id}')">🗑️</button>` : ''}
      </div>
      <div class="emp-card-body" onclick="selectEmp('${e.id}')">
        <div class="emp-name">${e.name}</div>
        <div class="emp-meta">${e.desig} · IC: ${e.ic || '—'}<br>বেতন: ৳ ${(+e.basic).toLocaleString('en-IN')}<br>হার: ${bn(hourlyRate(e.basic))} টাকা/ঘন্টা</div>
      </div>
    </div>
  `).join('');
}

function selectEmp(id) {
  selEmpId = id;
  const emp = DB.emps().find(e => e.id === id);
  if (!emp) return;
  document.getElementById('step2EmpName').textContent = emp.name;
  document.getElementById('step2EmpMeta').textContent = `${emp.desig} | ${emp.dept} | ${emp.branch} | IC: ${emp.ic}`;
  document.getElementById('billBasic').value = emp.basic;
  const now = new Date();
  const defMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  document.getElementById('billMonth').value = defMonth;
  document.getElementById('card-step2').style.display = 'block';
  generateRows(defMonth);
  recalc();
  renderEmpGrid();
  document.getElementById('card-step2').scrollIntoView({ behavior: 'smooth' });
}

function deselectEmp() {
  selEmpId = null;
  document.getElementById('card-step2').style.display = 'none';
  document.getElementById('otTbody').innerHTML = '';
  renderEmpGrid();
}

function onMonthChange() {
  const m = document.getElementById('billMonth').value;
  if (m) generateRows(m);
}

/* ===================================================
   TIME SELECTS
=================================================== */
function buildTimeOpts(sel) {
  let html = '';
  for (let h = 0; h < 24; h++) {
    for (let min of [0, 30]) {
      const hh = String(h).padStart(2, '0'), mm = String(min).padStart(2, '0');
      const val = `${hh}:${mm}`;
      const lbl = bn(hh) + ':' + bn(mm);
      html += `<option value="${val}"${val === sel ? ' selected' : ''}>${lbl}</option>`;
    }
  }
  return html;
}

function initDefaultSelects() {
  document.getElementById('defFrom').innerHTML = buildTimeOpts('16:00');
  document.getElementById('defTo').innerHTML   = buildTimeOpts('21:00');
}

function applyDefTime() {
  const from = document.getElementById('defFrom').value;
  const to   = document.getElementById('defTo').value;
  document.querySelectorAll('#otTbody tr').forEach(tr => {
    const d = +tr.dataset.d;
    const cb = document.getElementById(`cb-${d}`);
    if (cb && cb.checked) {
      const fs = document.getElementById(`from-${d}`);
      const ts = document.getElementById(`to-${d}`);
      if (fs) fs.value = from;
      if (ts) ts.value = to;
      calcRowHrs(d);
    }
  });
  recalc();
}

/* ===================================================
   FULL MONTH ROWS
=================================================== */
const BN_DAYS = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];
const BN_MONTHS_S = ['জানু','ফেব্রু','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টে','অক্টো','নভে','ডিসে'];

function daysInMonth(ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

function hrsFromTime(from, to) {
  const [fh, fm] = from.split(':').map(Number);
  const [th, tm] = to.split(':').map(Number);
  const diff = (th * 60 + tm) - (fh * 60 + fm);
  return diff > 0 ? parseFloat((diff / 60).toFixed(1)) : 0;
}

function generateRows(ym) {
  const [y, m] = ym.split('-').map(Number);
  const days = daysInMonth(ym);
  const defFrom = document.getElementById('defFrom').value || '16:00';
  const defTo   = document.getElementById('defTo').value   || '21:00';
  const bnM = BN_MONTHS_S[m - 1];
  let html = '';
  for (let d = 1; d <= days; d++) {
    const dow = new Date(y, m - 1, d).getDay();
    const isFri = dow === 5, isSat = dow === 6;
    const dateStr = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayCls = isFri ? 'is-fri' : isSat ? 'is-sat' : '';
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
  document.getElementById('otTbody').innerHTML = html;
  document.getElementById('cbAll').checked = false;
  recalc();
}

function toggleRow(d) {
  const cb  = document.getElementById(`cb-${d}`);
  const row = document.getElementById(`otr-${d}`);
  const fs  = document.getElementById(`from-${d}`);
  const ts  = document.getElementById(`to-${d}`);
  const hc  = document.getElementById(`h-${d}`);
  if (cb.checked) {
    row.classList.replace('row-off', 'row-on');
    fs.disabled = false; ts.disabled = false;
    hc.textContent = bn(hrsFromTime(fs.value, ts.value));
  } else {
    row.classList.replace('row-on', 'row-off');
    fs.disabled = true; ts.disabled = true;
    hc.textContent = '—';
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
  document.querySelectorAll('#otTbody tr').forEach(tr => {
    const d = +tr.dataset.d;
    const cb = document.getElementById(`cb-${d}`);
    if (!cb) return;
    const isFriSat = tr.classList.contains('is-fri') || tr.classList.contains('is-sat');
    if (checked && isFriSat) return; // skip weekends when selecting all
    if (cb.checked !== checked) { cb.checked = checked; toggleRow(d); }
  });
}

function recalc() {
  let totHrs = 0, selDays = 0, serial = 1;
  document.querySelectorAll('#otTbody tr').forEach(tr => {
    const d = +tr.dataset.d;
    const cb = document.getElementById(`cb-${d}`);
    const sn = document.getElementById(`sn-${d}`);
    if (cb && cb.checked) {
      const raw = document.getElementById(`h-${d}`)?.textContent || '0';
      const h = parseFloat(raw.replace(/[০-৯]/g, c => '০১২৩৪৫৬৭৮৯'.indexOf(c))) || 0;
      totHrs += h; selDays++;
      if (sn) sn.textContent = bn(serial++);
    } else {
      if (sn) sn.textContent = '—';
    }
  });
  const basic = +document.getElementById('billBasic').value || 0;
  const rate  = hourlyRate(basic);
  const amt   = Math.round(totHrs * rate);
  document.getElementById('selDays').textContent    = bn(selDays);
  document.getElementById('totHrsCell').textContent = bn(totHrs);
  document.getElementById('sm-hrs').textContent     = bn(totHrs) + ' ঘন্টা';
  document.getElementById('sm-rate').textContent    = bn(rate) + ' টাকা/ঘন্টা';
  document.getElementById('sm-total').textContent   = '৳ ' + bn(amt.toLocaleString('en-IN'));
  document.getElementById('sm-words').textContent   = amt > 0 ? 'কথায়ঃ ' + bnWords(amt) + ' টাকা মাত্র।' : '—';
}

function getCheckedRows() {
  const rows = [];
  document.querySelectorAll('#otTbody tr').forEach(tr => {
    const d  = +tr.dataset.d;
    const cb = document.getElementById(`cb-${d}`);
    if (!cb || !cb.checked) return;
    const fs  = document.getElementById(`from-${d}`)?.value || '16:00';
    const ts  = document.getElementById(`to-${d}`)?.value   || '21:00';
    const raw = document.getElementById(`h-${d}`)?.textContent || '0';
    const h   = parseFloat(raw.replace(/[০-৯]/g, c => '০১২৩৪৫৬৭৮৯'.indexOf(c))) || 0;
    rows.push({ date: tr.dataset.date, from: fs.replace(':', ''), to: ts.replace(':', ''), hours: h });
  });
  return rows;
}

/* ===================================================
   SAVE BILL
=================================================== */
async function saveBill() {
  if (!selEmpId) { toast('কর্মচারী নির্বাচন করুন', 'er'); return; }
  const rows  = getCheckedRows();
  if (!rows.length) { toast('কমপক্ষে একটি তারিখ নির্বাচন করুন', 'er'); return; }
  const basic = +document.getElementById('billBasic').value || 0;
  if (!basic) { toast('মূল বেতন দিন', 'er'); return; }
  const rate     = hourlyRate(basic);
  const totHrs   = rows.reduce((s, r) => s + r.hours, 0);
  const totalAmt = Math.round(totHrs * rate);
  const bill = {
    id: uid(),
    empId: selEmpId,
    month: document.getElementById('billMonth').value,
    basic, rate, entries: rows, totalHours: totHrs, totalAmt,
    note: document.getElementById('billNote').value,
    createdAt: new Date().toISOString(),
  };
  await DB.addBill(bill);
  toast('বিল সংরক্ষণ হয়েছে ✓');
}

/* ===================================================
   ALL BILLS
=================================================== */
function renderBills(filter) {
  filter = (filter || '').toLowerCase();
  const bills = DB.bills();
  const emps  = DB.emps();
  const tbody = document.getElementById('bills-tbody');
  let list = [...bills].reverse();
  if (filter) list = list.filter(b => {
    const emp = emps.find(e => e.id === b.empId) || {};
    return (emp.name || '').toLowerCase().includes(filter) || (b.month || '').includes(filter);
  });
  if (!list.length) { tbody.innerHTML = '<tr><td colspan="9"><div class="empty"><div class="empty-ico">📋</div><p>কোনো বিল নেই</p></div></td></tr>'; return; }
  tbody.innerHTML = list.map(b => {
    const emp = emps.find(e => e.id === b.empId) || {};
    return `<tr>
      <td><strong>${emp.name || '—'}</strong></td>
      <td><span class="badge badge-blue">${emp.desig || '—'}</span></td>
      <td>${emp.ic || '—'}</td>
      <td>${fmtMonthBn(b.month)}</td>
      <td style="text-align:center">${bn(b.entries?.length || 0)}</td>
      <td><span class="badge badge-gold">${bn(b.totalHours || 0)} ঘন্টা</span></td>
      <td>${bn(b.rate || 0)} টাকা</td>
      <td><span class="text-gold bold">৳ ${bn((b.totalAmt || 0).toLocaleString('en-IN'))}</span></td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-xs" onclick="printBill('${b.id}')">🖨️</button>
          <button class="btn btn-danger btn-xs" onclick="delBill('${b.id}')">🗑️</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function filterBills(v) { renderBills(v); }

async function delBill(id) {
  if (!confirm('এই বিল মুছবেন?')) return;
  await DB.deleteBill(id);
  toast('বিল মুছে ফেলা হয়েছে');
}

/* ===================================================
   PRINT — A4 GENERATION
=================================================== */
const BILL_DESC = 'উল্লেখিত তারিখে অফিস সময়ের পরে বন্দর মাশুল আদায়ের এ্যাসেসমেন্ট প্রস্তুত, বিল আদায়, ব্যাংকে জমা দান, রাজস্ব আয়ের হিসাব এবং মালামাল হ্যান্ডলিং এর প্রতিবেদন প্রস্তুত সহ অন্যান্য দাপ্তরিক জরুরী কাজ করিয়াছি।';
const SUP_COMMENT = 'এই মর্মে প্রত্যায়ন করা যাইতেছে যে, সে উল্লেখিত দিনগুলি অফিস সময়ের পরে অবস্থান করিয়া বন্দর মাশুল আদায়ের এ্যাসেসমেন্ট প্রস্তুত, বিল আদায়, ব্যাংকে জমা দান, রাজস্ব আয়ের হিসাব এবং মালামাল হ্যান্ডলিং এর প্রতিবেদন প্রস্তুত সহ অন্যান্য দাপ্তরিক জরুরী কাজ করিয়াছে।';

function fmtDate(ds) {
  const [y, m, d] = ds.split('-');
  return bn(d.padStart(2,'0') + '/' + m.padStart(2,'0') + '/' + y);
}

function fmtTime4(t) {
  // t = "1600" or "16:00"
  return bn((t || '').replace(':', '').padStart(4, '0'));
}

function fmtHrs(h) {
  const n = parseFloat(h) || 0;
  const i = Math.floor(n);
  const d = String(Math.round((n - i) * 100)).padStart(2, '0');
  return bn(i) + '.' + bn(d);
}

function buildA4(bill, emp) {
  const entries   = bill.entries || [];
  const totHrs    = bill.totalHours || 0;
  const rate      = bill.rate || 0;
  const amt       = bill.totalAmt || 0;
  const amtWords  = bnWords(amt);
  const rowspan   = entries.length + 1; // data rows + total row
  const bnSalary  = bn(bill.basic || 0);
  const bnRate    = bn(rate);
  const bnHrs     = bn(totHrs);
  const bnAmt     = bn(amt.toLocaleString('en-IN'));

  let trs = '';
  entries.forEach((e, i) => {
    if (i === 0) {
      trs += `<tr>
        <td>${fmtDate(e.date)}</td>
        <td>${fmtTime4(e.from)}</td>
        <td>${fmtTime4(e.to)}</td>
        <td>${fmtHrs(e.hours)} ঘন্টা</td>
        <td class="dc-cell" rowspan="${rowspan}">${BILL_DESC}</td>
        <td class="dc-cell" rowspan="${rowspan}">${SUP_COMMENT}</td>
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
    <td colspan="3" style="text-align:right;padding:2px 7px;">মোট অতিরিক্ত কর্মঘন্টা</td>
    <td>${bnHrs} ঘন্টা</td>
  </tr>`;

  return `<div class="a4">
  <div class="a4-head-org">মোংলা বন্দর কর্তৃপক্ষ</div>
  <div class="a4-head-addr">মোংলা, বাগেরহাট।</div>
  <div class="a4-head-form">অতিরিক্ত কাজের বিল ফরম।</div>

  <table class="a4-emp-tbl">
    <tr>
      <td class="al">নামঃ</td><td>${emp.name || ''}</td>
      <td style="width:20px"></td>
      <td class="al">পদবীঃ</td><td>${emp.desig || ''}</td>
    </tr>
    <tr>
      <td class="al">বিভাগঃ</td><td>${emp.dept || 'ট্রাফিক'}</td>
      <td></td>
      <td class="al">শাখাঃ</td><td>${emp.branch || 'রাজস্ব ও রিটার্ন'}</td>
    </tr>
    <tr>
      <td class="al">মূল বেতনঃ</td><td>${bnSalary}</td>
      <td></td>
      <td class="al">আই,সি, নং-</td><td>${emp.ic || ''}</td>
    </tr>
  </table>

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

  <table class="a4-ti-tbl" style="margin-top:calc(48px - 5%);margin-bottom:5%">
    <tr>
      <td style="width:50%">টি আই/শাখা প্রধান</td>
      <td style="width:50%;padding-left:25%">আবেদনকারীর স্বাক্ষর<br>তারিখঃ</td>
    </tr>
  </table>

  <div class="a4-approval" style="margin-top:9px;">
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
function fitToA4(page) {
  const A4_H = 1122; // 297mm @ 96dpi

  // Temporarily remove overflow:hidden so scrollHeight reflects true content height
  const origOverflow = page.style.overflow;
  const origHeight   = page.style.height;
  page.style.overflow = 'visible';
  page.style.height   = 'auto';

  if (page.scrollHeight <= A4_H) {
    page.style.overflow = origOverflow || 'hidden';
    page.style.height   = origHeight   || '297mm';
    return;
  }

  // Phase 1: reduce gaps/padding/margin (up to 25 passes)
  for (let pass = 0; pass < 25; pass++) {
    if (page.scrollHeight <= A4_H) break;
    const ratio = A4_H / page.scrollHeight;

    // Table cell padding & line-height
    page.querySelectorAll('.a4-ot-tbl td, .a4-ot-tbl th').forEach(el => {
      const cs = getComputedStyle(el);
      const pt = parseFloat(cs.paddingTop) || 0;
      const pb = parseFloat(cs.paddingBottom) || 0;
      const lh = parseFloat(cs.lineHeight) || 18;
      el.style.paddingTop    = Math.max(0, pt * ratio) + 'px';
      el.style.paddingBottom = Math.max(0, pb * ratio) + 'px';
      el.style.lineHeight    = Math.max(1, lh * ratio) + 'px';
    });

    // All margins & paddings inside the page
    page.querySelectorAll('*').forEach(el => {
      const cs = getComputedStyle(el);
      ['marginTop','marginBottom','paddingTop','paddingBottom'].forEach(p => {
        const v = parseFloat(cs[p]) || 0;
        if (v > 1) el.style[p] = Math.max(0, v * ratio) + 'px';
      });
    });

    // Page own padding
    const pp = parseFloat(getComputedStyle(page).paddingTop) || 0;
    if (pp > 2) page.style.paddingTop = Math.max(2, pp * ratio) + 'px';
  }

  // Phase 2: still overflowing → reduce table font only (min 9px)
  if (page.scrollHeight > A4_H) {
    const tbl = page.querySelector('.a4-ot-tbl');
    if (tbl) {
      for (let pass = 0; pass < 20; pass++) {
        if (page.scrollHeight <= A4_H) break;
        const ratio = A4_H / page.scrollHeight;
        tbl.querySelectorAll('td, th').forEach(el => {
          const fs = parseFloat(getComputedStyle(el).fontSize) || 14;
          const lh = parseFloat(getComputedStyle(el).lineHeight) || 18;
          el.style.fontSize   = Math.max(9, fs * ratio) + 'px';
          el.style.lineHeight = Math.max(1, lh * ratio) + 'px';
        });
      }
    }
  }

  // Restore
  page.style.overflow = origOverflow || 'hidden';
  page.style.height   = origHeight   || '297mm';
}

/* ===================================================
   PRINT MODAL
=================================================== */
function doPreviewPrint() {
  if (!selEmpId) { toast('কর্মচারী নির্বাচন করুন', 'er'); return; }
  const rows = getCheckedRows();
  if (!rows.length) { toast('কমপক্ষে একটি তারিখ নির্বাচন করুন', 'er'); return; }
  const basic = +document.getElementById('billBasic').value || 0;
  if (!basic) { toast('মূল বেতন দিন', 'er'); return; }
  const rate   = hourlyRate(basic);
  const totHrs = rows.reduce((s, r) => s + r.hours, 0);
  const bill   = { empId: selEmpId, month: document.getElementById('billMonth').value, basic, rate, entries: rows, totalHours: totHrs, totalAmt: Math.round(totHrs * rate) };
  const emp    = DB.emps().find(e => e.id === selEmpId) || {};
  showPrintModal(bill, emp);
}

function printBill(id) {
  const bill = DB.bills().find(b => b.id === id);
  if (!bill) { toast('বিল পাওয়া যায়নি', 'er'); return; }
  const emp = DB.emps().find(e => e.id === bill.empId) || {};
  showPrintModal(bill, emp);
}

function showPrintModal(bill, emp) {
  const html = buildA4(bill, emp);

  // Show preview
  document.getElementById('printPreview').innerHTML = `<div style="background:white;">${html}</div>`;
  document.getElementById('printOverlay').classList.add('open');

  // Render printArea off-screen for measurement
  const pa = document.getElementById('printArea');
  pa.innerHTML = html;
  pa.style.cssText = 'position:fixed;left:-9999px;top:0;display:block;visibility:hidden;pointer-events:none;';

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const previewPage = document.querySelector('#printPreview .a4');
    if (previewPage) fitToA4(previewPage);
    const printPage = pa.querySelector('.a4');
    if (printPage) fitToA4(printPage);
    pa.style.cssText = 'display:none;';
  }));
}

function closePrint() { document.getElementById('printOverlay').classList.remove('open'); }

function doPrint() {
  const pa = document.getElementById('printArea');
  pa.style.cssText = 'position:fixed;left:-9999px;top:0;display:block;visibility:hidden;pointer-events:none;';
  const style = document.createElement('style');
  style.id = 'ps';
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
  window.print();
  setTimeout(() => {
    document.getElementById('ps')?.remove();
    pa.style.cssText = 'display:none;';
  }, 3000);
}

/* ===================================================
   CLOSE OVERLAYS ON OUTSIDE CLICK
=================================================== */
document.getElementById('empOverlay').addEventListener('click', function(e) { if (e.target === this) closeEmpModal(); });
document.getElementById('printOverlay').addEventListener('click', function(e) { if (e.target === this) closePrint(); });
document.getElementById('adminOverlay').addEventListener('click', function(e) { if (e.target === this) closeAdminModal(); });

/* ===================================================
   INIT
=================================================== */
initDefaultSelects();
// Firebase listeners will call renderAll() once data loads
// If offline, the 3s timeout will load from localStorage