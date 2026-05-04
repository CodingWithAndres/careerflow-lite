const form = document.getElementById("appForm");
const list = document.getElementById("appList");
const emptyMessage = document.getElementById("emptyMessage");
const clearAllBtn = document.getElementById("clearAllBtn");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");

let applications = JSON.parse(localStorage.getItem("apps")) || [];
let currentFilter = "All";
let editingIndex = null;
let searchQuery = "";

// Format text (Title Case)
function formatText(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function saveApps() {
  localStorage.setItem("apps", JSON.stringify(applications));
}

function updateDashboard() {
  document.getElementById("total-count").textContent = applications.length;
  document.getElementById("applied-count").textContent =
    applications.filter(a => a.status === "Applied").length;
  document.getElementById("interview-count").textContent =
    applications.filter(a => a.status === "Interview").length;
  document.getElementById("offer-count").textContent =
    applications.filter(a => a.status === "Offer").length;
  document.getElementById("rejected-count").textContent =
    applications.filter(a => a.status === "Rejected").length;
}

function renderApps() {
  list.innerHTML = "";

  const filtered = applications.filter(app =>
    (currentFilter === "All" || app.status === currentFilter) &&
    (
      app.company.toLowerCase().includes(searchQuery) ||
      app.role.toLowerCase().includes(searchQuery)
    )
  );

  emptyMessage.style.display = filtered.length ? "none" : "block";

  filtered.forEach(app => {
    const index = applications.indexOf(app);
    const isEditing = editingIndex === index;

    list.innerHTML += `
      <tr class="app-row">
        <td>${isEditing
          ? `<input id="company-${index}" value="${app.company}" />`
          : app.company}</td>

        <td>${isEditing
          ? `<input id="role-${index}" value="${app.role}" />`
          : app.role}</td>

        <td>${isEditing
          ? `<input type="date" id="date-${index}" value="${app.date}" />`
          : app.date}</td>

        <td>
          ${isEditing
            ? `<select id="status-${index}">
                <option ${app.status==="Applied"?"selected":""}>Applied</option>
                <option ${app.status==="Interview"?"selected":""}>Interview</option>
                <option ${app.status==="Offer"?"selected":""}>Offer</option>
                <option ${app.status==="Rejected"?"selected":""}>Rejected</option>
              </select>`
            : `<select onchange="updateStatus(${index}, this.value)">
                <option ${app.status==="Applied"?"selected":""}>Applied</option>
                <option ${app.status==="Interview"?"selected":""}>Interview</option>
                <option ${app.status==="Offer"?"selected":""}>Offer</option>
                <option ${app.status==="Rejected"?"selected":""}>Rejected</option>
              </select>`
          }
        </td>

        <td>
          ${isEditing
            ? `<button onclick="saveEdit(${index})">Save</button>
               <button onclick="cancelEdit()">Cancel</button>`
            : `<button onclick="startEdit(${index})">Edit</button>`
          }
          <button class="delete-btn" onclick="deleteApp(${index})">Delete</button>
        </td>
      </tr>
    `;
  });

  updateDashboard();
}

function startEdit(i){ editingIndex = i; renderApps(); }
function cancelEdit(){ editingIndex = null; renderApps(); }

function saveEdit(i){
  applications[i].company = formatText(document.getElementById(`company-${i}`).value);
  applications[i].role = formatText(document.getElementById(`role-${i}`).value);
  applications[i].date = document.getElementById(`date-${i}`).value;
  applications[i].status = document.getElementById(`status-${i}`).value;

  editingIndex = null;
  saveApps();
  renderApps();
}

function updateStatus(i, val){
  applications[i].status = val;
  saveApps();
  renderApps();
}

function deleteApp(i){
  applications.splice(i,1);
  saveApps();
  renderApps();
}

form.addEventListener("submit", e=>{
  e.preventDefault();

  applications.push({
    company: formatText(document.getElementById("company").value),
    role: formatText(document.getElementById("role").value),
    date: document.getElementById("date").value,
    status: document.getElementById("status").value
  });

  form.reset();
  saveApps();
  renderApps();
});

filterButtons.forEach(btn=>{
  btn.onclick = ()=>{
    filterButtons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderApps();
  };
});

searchInput.oninput = e=>{
  searchQuery = e.target.value.toLowerCase();
  renderApps();
};

clearAllBtn.onclick = ()=>{
  applications = [];
  saveApps();
  renderApps();
};

renderApps();