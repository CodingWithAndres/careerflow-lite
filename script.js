const form = document.getElementById("appForm");
const list = document.getElementById("appList");
const emptyMessage = document.getElementById("emptyMessage");
const clearAllBtn = document.getElementById("clearAllBtn");
const filterButtons = document.querySelectorAll(".filter-btn");

let applications = JSON.parse(localStorage.getItem("apps")) || [];
let currentFilter = "All";
let editingIndex = null;

function saveApps() {
  localStorage.setItem("apps", JSON.stringify(applications));
}

function updateDashboard() {
  document.getElementById("total-count").textContent = applications.length;
  document.getElementById("applied-count").textContent =
    applications.filter(app => app.status === "Applied").length;
  document.getElementById("interview-count").textContent =
    applications.filter(app => app.status === "Interview").length;
  document.getElementById("offer-count").textContent =
    applications.filter(app => app.status === "Offer").length;
  document.getElementById("rejected-count").textContent =
    applications.filter(app => app.status === "Rejected").length;
}

function renderApps() {
  list.innerHTML = "";

  const filteredApps =
    currentFilter === "All"
      ? applications
      : applications.filter(app => app.status === currentFilter);

  emptyMessage.style.display = filteredApps.length === 0 ? "block" : "none";

  filteredApps.forEach((app) => {
    const index = applications.indexOf(app);
    const isEditing = editingIndex === index;

    const row = `
      <tr class="app-row">
        <td>
          ${
            isEditing
              ? `<input class="edit-input" id="company-${index}" value="${app.company}" />`
              : app.company
          }
        </td>

        <td>
          ${
            isEditing
              ? `<input class="edit-input" id="role-${index}" value="${app.role}" />`
              : app.role
          }
        </td>

        <td>
          ${
            isEditing
              ? `<input class="edit-input" type="date" id="date-${index}" value="${app.date}" />`
              : app.date
          }
        </td>

        <td>
          <select class="status-select" onchange="updateStatus(${index}, this.value)">
            <option value="Applied" ${app.status === "Applied" ? "selected" : ""}>Applied</option>
            <option value="Interview" ${app.status === "Interview" ? "selected" : ""}>Interview</option>
            <option value="Offer" ${app.status === "Offer" ? "selected" : ""}>Offer</option>
            <option value="Rejected" ${app.status === "Rejected" ? "selected" : ""}>Rejected</option>
          </select>
        </td>

        <td class="action-buttons">
          ${
            isEditing
              ? `
                <button onclick="saveEdit(${index})">Save</button>
                <button class="secondary-btn" onclick="cancelEdit()">Cancel</button>
              `
              : `<button onclick="startEdit(${index})">Edit</button>`
          }

          <button class="delete-btn" onclick="deleteApp(${index})">Delete</button>
        </td>
      </tr>
    `;

    list.innerHTML += row;
  });

  updateDashboard();
}

function startEdit(index) {
  editingIndex = index;
  renderApps();
}

function cancelEdit() {
  editingIndex = null;
  renderApps();
}

function saveEdit(index) {
  const updatedCompany = document.getElementById(`company-${index}`).value.trim();
  const updatedRole = document.getElementById(`role-${index}`).value.trim();
  const updatedDate = document.getElementById(`date-${index}`).value;

  if (!updatedCompany || !updatedRole || !updatedDate) {
    alert("Please complete all fields before saving.");
    return;
  }

  applications[index].company = updatedCompany;
  applications[index].role = updatedRole;
  applications[index].date = updatedDate;

  editingIndex = null;
  saveApps();
  renderApps();
}

function updateStatus(index, newStatus) {
  applications[index].status = newStatus;
  saveApps();
  renderApps();
}

function deleteApp(index) {
  applications.splice(index, 1);

  if (editingIndex === index) {
    editingIndex = null;
  }

  saveApps();
  renderApps();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newApp = {
    company: document.getElementById("company").value.trim(),
    role: document.getElementById("role").value.trim(),
    date: document.getElementById("date").value,
    status: document.getElementById("status").value
  };

  applications.push(newApp);
  saveApps();

  form.reset();
  renderApps();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    currentFilter = button.dataset.filter;
    editingIndex = null;
    renderApps();
  });
});

clearAllBtn.addEventListener("click", () => {
  applications = [];
  editingIndex = null;
  saveApps();
  renderApps();
});

renderApps();