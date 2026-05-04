const form = document.getElementById("appForm");
const list = document.getElementById("appList");
const emptyMessage = document.getElementById("emptyMessage");
const clearAllBtn = document.getElementById("clearAllBtn");
const filterButtons = document.querySelectorAll(".filter-btn");

let applications = JSON.parse(localStorage.getItem("apps")) || [];
let currentFilter = "All";

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

    const row = `
      <tr>
        <td><input value="${app.company}" id="company-${index}" /></td>
        <td><input value="${app.role}" id="role-${index}" /></td>
        <td><input type="date" value="${app.date}" id="date-${index}" /></td>
        <td>
          <select onchange="updateStatus(${index}, this.value)">
            <option value="Applied" ${app.status === "Applied" ? "selected" : ""}>Applied</option>
            <option value="Interview" ${app.status === "Interview" ? "selected" : ""}>Interview</option>
            <option value="Offer" ${app.status === "Offer" ? "selected" : ""}>Offer</option>
            <option value="Rejected" ${app.status === "Rejected" ? "selected" : ""}>Rejected</option>
          </select>
        </td>
        <td>
          <button onclick="saveEdit(${index})">Save</button>
          <button class="delete-btn" onclick="deleteApp(${index})">Delete</button>
        </td>
      </tr>
    `;

    list.innerHTML += row;
  });

  updateDashboard();
}

function saveEdit(index) {
  applications[index].company = document.getElementById(`company-${index}`).value;
  applications[index].role = document.getElementById(`role-${index}`).value;
  applications[index].date = document.getElementById(`date-${index}`).value;

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
    renderApps();
  });
});

clearAllBtn.addEventListener("click", () => {
  applications = [];
  saveApps();
  renderApps();
});

renderApps();