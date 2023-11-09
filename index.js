(async () => {
  let employeeList = document.querySelector(".employee__names--list");
  let employeeInfo = document.querySelector(".employee__single--info");
  let openModal = document.querySelector(".addEmployee");
  const addEmployee = document.querySelector(".createEmployee");
  const employeeForm = document.querySelector(".addEmployee_create");
  const dobInput = document.querySelector(".addEmployee_create--dob");

  let response = await fetch("./data.json");
  let employeeData = await response.json();
  let selectedEmployee = employeeData[0];
  let selectedEmployeeId = employeeData[0].id;

  // Set Employee age to be entered minimum 18 years
  dobInput.max = `${new Date().getFullYear() - 18}-${new Date()
    .toISOString()
    .slice(5, 10)}`;

  addEmployee.addEventListener("click", () => {
    openModal.style.display = "flex";
  });

  openModal.addEventListener("click", (e) => {
    if (e.target.className === "addEmployee") {
      openModal.style.display = "none";
    }
  });

  employeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(employeeForm);
    const newEmployee = {};
    formData.forEach((value, key) => {
      newEmployee[key] = value;
    });
    newEmployee.age =
      new Date().getFullYear() - parseInt(newEmployee.dob.slice(0, 4), 10);
    newEmployee.id = employeeData[employeeData.length - 1].id + 1;
    employeeData.push(newEmployee);
    employeeForm.reset();
    openModal.style.display = "none";
    selectedEmployee = employeeData[employeeData.length - 1];
    selectedEmployeeId = employeeData[employeeData.length - 1].id;
    renderEmployees();
    renderSingleEmployees();
  });

  const renderEmployees = () => {
    employeeList.innerHTML = "";
    employeeData.forEach((employee) => {
      const spanElement = document.createElement("span");
      spanElement.classList.add("employee__names--item");
      if (parseInt(selectedEmployeeId, 10) === employee.id) {
        spanElement.classList.add("selected");
        selectedEmployee = employee;
      }
      spanElement.setAttribute("id", employee.id);
      spanElement.innerHTML = `${employee.firstName} ${employee.lastName} <i class="employeeDelete">❌</i>`;
      employeeList.append(spanElement);
    });
  };
  renderEmployees();
  const renderSingleEmployees = () => {
    employeeInfo.innerHTML = `
    <img src="${selectedEmployee.imageUrl}" />
    <span class="employees__single--heading">
    ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
    </span>
    <span>${selectedEmployee.address}</span>
    <span>${selectedEmployee.email}</span>
    <span>Mobile - ${selectedEmployee.contactNumber}</span>
    <span>DOB - ${selectedEmployee.dob}</span>
    `;
  };
  renderSingleEmployees();
  employeeList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
      selectedEmployeeId = e.target.id;
      renderEmployees();
      renderSingleEmployees();
    }
    if (e.target.tagName === "I") {
      const data = employeeData.filter(
        (employee) => String(employee.id) !== e.target.parentNode.id
      );
      employeeData = data;
      selectedEmployee = data[0];
      selectedEmployeeId = data[0].id;
      renderEmployees();
      renderSingleEmployees();
    }
  });
})();
