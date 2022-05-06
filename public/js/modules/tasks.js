import axios from "axios";
import Swal from "sweetalert2";
import { updateProgress } from "../functions/progress";

const tasks = document.querySelector(".listado-pendientes");

if (tasks) {
  tasks.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-check-circle")) {
      const icon = e.target;
      const taskId = icon.parentElement.parentElement.dataset.task;
      const url = `${location.origin}/tasks/${taskId}`;
      axios.patch(url, { taskId }).then((response) => {
        if (response.status === 200) {
          icon.classList.toggle("completo");
          updateProgress();
        }
      });
    }
    if (e.target.classList.contains("fa-trash")) {
      const taskHTML = e.target.parentElement.parentElement;
      const icon = e.target;
      const taskId = icon.parentElement.parentElement.dataset.task;
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const url = `${location.origin}/tasks/${taskId}`;
          axios
            .delete(url, {
              params: { taskId },
            })
            .then((response) => {
              if (response.status === 200) {
                taskHTML.parentElement.removeChild(taskHTML);
                Swal.fire("Task successfully deleted", response.data);
                updateProgress();
              }
            });
        }
      });
    }
  });
}
