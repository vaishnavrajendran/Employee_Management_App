(async () => {
  let employeeList = document.querySelector(".employee__names--list");
  let employeeInfo = document.querySelector(".employee__single--info");
  let editEmployeeInfo = document.querySelector(".employee__single--edit");
  let openAddModal = document.querySelector(".addEmployee");
  let openEditModal = document.querySelector(".editEmployee");
  const addEmployee = document.querySelector(".createEmployee");
  const employeeForm = document.querySelector(".addEmployee_create");
  const editEmployeeForm = document.querySelector(".editEmployee_data");
  const dobInput = document.querySelector(".addEmployee_create--dob");
  const editEmployee = document.querySelector(".employee__single--edit");

  let response = await fetch("./data.json");
  let employeeData = await response.json();
  let selectedEmployee = employeeData[0];
  let selectedEmployeeId = employeeData[0].id;

  // Set Employee age to be entered minimum 18 years
  dobInput.max = `${new Date().getFullYear() - 18}-${new Date()
    .toISOString()
    .slice(5, 10)}`;

  addEmployee.addEventListener("click", () => {
    openAddModal.style.display = "flex";
  });

  editEmployeeInfo.addEventListener("click", () => {
    openEditModal.style.display = "flex";
  });

  openAddModal.addEventListener("click", (e) => {
    if (e.target.className === "addEmployee") {
      openAddModal.style.display = "none";
    }
  });

  openEditModal.addEventListener("click", (e) => {
    if (e.target.className === "editEmployee") {
      openEditModal.style.display = "none";
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
    openAddModal.style.display = "none";
    selectedEmployee = employeeData[employeeData.length - 1];
    selectedEmployeeId = employeeData[employeeData.length - 1].id;
    renderEmployees();
    renderSingleEmployees();
  });

  editEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(editEmployeeForm);
    const editedEmployee = {};
    formData.forEach((value, key) => {
      editedEmployee[key] = value;
    });
    const splitted = editedEmployee.dob.split("-");
    const formattedDob = `${splitted[2]}/${splitted[1]}/${splitted[0]}`;
    editEmployee.dob = formattedDob;
    editedEmployee.age =
      new Date().getFullYear() - parseInt(editedEmployee.dob.slice(0, 4), 10);
    editedEmployee.id = employeeData[employeeData.length - 1].id + 1;

    const updatedEmployeeArray = employeeData.map((employee) => {
      if (employee.id === selectedEmployeeId) {
        return {
          ...employee,
          ...editedEmployee,
        };
      }
      return employee;
    });

    employeeData = updatedEmployeeArray;
    selectedEmployee = updatedEmployeeArray[0];
    selectedEmployeeId = updatedEmployeeArray[0].id;
    renderEmployees();
    renderSingleEmployees();
    editEmployeeForm.reset();
    openEditModal.style.display = "none";
  });

  const getFormattedDate = (dob) => {
    const parts = dob.split("/");
    const day = parts[0].toString().padStart(2, "0");
    const month = parts[1].toString().padStart(2, "0");
    const year = parts[2].toString().padStart(4, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  editEmployee.addEventListener("click", () => {
    const editEmployeeForm = document.querySelector(".editEmployee_data");
    // Accessing the input fields by their name attribute
    const firstNameInput = editEmployeeForm.querySelector('[name="firstName"]');
    const lastNameInput = editEmployeeForm.querySelector('[name="lastName"]');
    const imageUrlInput = editEmployeeForm.querySelector('[name="imageUrl"]');
    const emailInput = editEmployeeForm.querySelector('[name="email"]');
    const contactNumberInput = editEmployeeForm.querySelector(
      '[name="contactNumber"]'
    );
    const salaryInput = editEmployeeForm.querySelector('[name="salary"]');
    const addressInput = editEmployeeForm.querySelector('[name="address"]');
    const dobInput = editEmployeeForm.querySelector('[name="dob"]');

    firstNameInput.value = selectedEmployee.firstName;
    lastNameInput.value = selectedEmployee.lastName;
    imageUrlInput.value = selectedEmployee.imageUrl;
    emailInput.value = selectedEmployee.email;
    contactNumberInput.value = selectedEmployee.contactNumber;
    salaryInput.value = selectedEmployee.salary;
    addressInput.value = selectedEmployee.address;
    dobInput.value = getFormattedDate(selectedEmployee.dob);
  });

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
})();
