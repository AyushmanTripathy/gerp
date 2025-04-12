const form = document.querySelector("form");
const displayIncharges = document.getElementById("selectedIncharges");
const selectCourse = document.getElementById("selectCourse");
const selectProctor = document.getElementById("selectProctor");
const selectFaculty = document.getElementById("selectFaculty");

const incharges = [];

function getSelectedOption(e) {
  const option = e.options[e.selectedIndex];
  return option;
}

function addCourseIncharge() {
  const course = getSelectedOption(selectCourse);
  const faculty = getSelectedOption(selectFaculty);

  console.log(course, faculty)
  if (!course.value || !faculty.value) {
    alert("Course and Faculty both are required")
    return;
  }

  const isDuplicate = (v) => incharges.flat().includes(v);
  if (isDuplicate(course.value)) {
    alert(`course is duplicated`)
    return;
  }
  if (isDuplicate(faculty.value)) {
    alert(`faculty is duplicated`)
    return;
  }

  selectCourse.options[0].selected = true;
  selectFaculty.options[0].selected = true;

  incharges.push([course.value, faculty.value]);

  const courseName = document.createElement("p");
  courseName.innerText = course.innerText;
  displayIncharges.appendChild(courseName);

  const facultyName = document.createElement("p");
  facultyName.innerText = faculty.innerText;
  displayIncharges.appendChild(facultyName);

  displayIncharges.style.display = "grid";
}

form.onsubmit = async (e) => {
  e.preventDefault();
  console.log("submitted");

  initLoading();

  try {
    const res = await fetch(`/admin/section/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: document.getElementById("name").value,
        proctorId: document.getElementById("proctor").value,
        incharges
      }),
    });

    if (res.ok)
      finishLoading(
        "Successfully Added",
        "Back",
        () => (location.href = "/admin")
      );
    else finishLoading("Failed to Add", "Retry", () => cancelLoading());
  } catch (e) {
    finishLoading("Failed to Add", "Retry", () => cancelLoading());
  }
};
