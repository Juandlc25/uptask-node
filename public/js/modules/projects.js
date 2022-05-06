import Swal from "sweetalert2";
import axios from "axios";
// const tasks = document.querySelector(".listado-pendientes");

// if (tasks) {
//   tasks.addEventListener("click", (e) => {
//     console.log(e.target.classList);
//   });
// }

const btnDelete = document.querySelector("#eliminar-proyecto");
if (btnDelete)
  btnDelete.addEventListener("click", (e) => {
    const urlProject = e.target.dataset.proyectoUrl;
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
        const url = `${location.origin}/projects/${urlProject}`;
        axios
          .delete(url, {
            params: { urlProject },
          })
          .then((response) => {
            Swal.fire("Deleted!", response.data, "success");
            setTimeout(() => {
              window.location.href = "/";
            }, 3000);
          })
          .catch(() => {
            Swal.fire({
              type: "error",
              title: "There was an error",
              text: "Can't delete project",
            });
          });
      }
    });
  });
