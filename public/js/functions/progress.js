import Swal from "sweetalert2";

export const updateProgress = () => {
  const tasks = document.querySelectorAll("li.tarea");
  if (tasks.length) {
    const completedTask = document.querySelectorAll("i.completo");
    const progress = Math.round((completedTask.length / tasks.length) * 100);
    const percentage = document.querySelector("#porcentaje");
    percentage.style.width = progress + "%";
    if (progress === 100) {
      Swal.fire("You completed the project", "Congrats");
    }
  }
};
