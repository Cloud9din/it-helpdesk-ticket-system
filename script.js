const ticketForm = document.getElementById("ticketForm");
const ticketsContainer = document.getElementById("tickets");
const statusFilter = document.getElementById("statusFilter");

const totalTickets = document.getElementById("totalTickets");
const openTickets = document.getElementById("openTickets");
const progressTickets = document.getElementById("progressTickets");
const resolvedTickets = document.getElementById("resolvedTickets");

let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

function saveTickets() {
  localStorage.setItem("tickets", JSON.stringify(tickets));
}

function updateStats() {
  totalTickets.textContent = tickets.length;

  openTickets.textContent = tickets.filter(
    ticket => ticket.status === "Open"
  ).length;

  progressTickets.textContent = tickets.filter(
    ticket => ticket.status === "In Progress"
  ).length;

  resolvedTickets.textContent = tickets.filter(
    ticket => ticket.status === "Resolved"
  ).length;
}

function getPriorityClass(priority) {
  if (priority === "Low") return "priority-low";
  if (priority === "Medium") return "priority-medium";
  if (priority === "High") return "priority-high";
  return "";
}

function getStatusClass(status) {
  if (status === "Open") return "status-open";
  if (status === "In Progress") return "status-progress";
  if (status === "Resolved") return "status-resolved";
  return "";
}

function displayTickets() {
  const selectedStatus = statusFilter.value;

  ticketsContainer.innerHTML = "";

  const filteredTickets =
    selectedStatus === "All"
      ? tickets
      : tickets.filter(ticket => ticket.status === selectedStatus);

  if (filteredTickets.length === 0) {
    ticketsContainer.innerHTML = `
      <div class="empty-state">
        <p>No tickets found.</p>
      </div>
    `;
    return;
  }

  filteredTickets.forEach(ticket => {
    const ticketIndex = tickets.findIndex(
      item => item.id === ticket.id
    );

    const ticketCard = document.createElement("div");
    ticketCard.classList.add("ticket-card");

    ticketCard.innerHTML = `
      <div class="ticket-top">
        <div>
          <h3>Ticket #${ticket.id}</h3>
          <p>${ticket.createdAt}</p>
        </div>

        <div>
          <span class="badge ${getPriorityClass(ticket.priority)}">
            ${ticket.priority}
          </span>
        </div>
      </div>

      <p><strong>User:</strong> ${ticket.name}</p>

      <p>
        <strong>Category:</strong>
        ${ticket.category}
      </p>

      <p>
        <strong>Description:</strong>
        ${ticket.description}
      </p>

      <p>
        <strong>Status:</strong>
        <span class="badge ${getStatusClass(ticket.status)}">
          ${ticket.status}
        </span>
      </p>

      <div class="ticket-actions">

        ${
          ticket.status === "Open"
            ? `
              <button onclick="setInProgress(${ticketIndex})">
                Start Work
              </button>
            `
            : ""
        }

        ${
          ticket.status !== "Resolved"
            ? `
              <button onclick="resolveTicket(${ticketIndex})">
                Resolve
              </button>
            `
            : ""
        }

        <button
          class="delete-btn"
          onclick="deleteTicket(${ticketIndex})"
        >
          Delete
        </button>

      </div>
    `;

    ticketsContainer.appendChild(ticketCard);
  });
}

ticketForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  const description = document
    .getElementById("description")
    .value
    .trim();

  const newTicket = {
    id: tickets.length > 0
  ? Math.max(...tickets.map(ticket => ticket.id || 1000)) + 1
  : 1001,
    name,
    category,
    priority,
    description,
    status: "Open",
    createdAt: new Date().toLocaleString()
  };

  tickets.unshift(newTicket);

  saveTickets();

  ticketForm.reset();

  updateStats();
  displayTickets();
});

function setInProgress(index) {
  tickets[index].status = "In Progress";

  saveTickets();

  updateStats();
  displayTickets();
}

function resolveTicket(index) {
  tickets[index].status = "Resolved";

  saveTickets();

  updateStats();
  displayTickets();
}

function deleteTicket(index) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this ticket?"
  );

  if (!confirmDelete) {
    return;
  }

  tickets.splice(index, 1);

  saveTickets();

  updateStats();
  displayTickets();
}

statusFilter.addEventListener("change", displayTickets);

updateStats();
displayTickets();
