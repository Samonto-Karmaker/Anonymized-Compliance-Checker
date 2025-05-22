const task1CheckBtn = document.getElementById("task-1-check-btn");
const task2CheckBtn = document.getElementById("task-2-check-btn");
const result1 = document.getElementById("result-1");
const result2 = document.getElementById("result-2");
const batchSize = document.getElementById("batch-size");

task1CheckBtn.onclick = checkTask1;
task2CheckBtn.onclick = checkTask2;

const backend_url = "http://localhost:3000";

const loadingSpinner = `<div class="spinner-border spinner-border-sm m-1" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`

async function checkTask1() {
    task1CheckBtn.disabled = true;
    task1CheckBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Checking...
    `;
    try {
        const response = await fetch(`${backend_url}/task1/check-compliance`);
        const data = await response.json();
        console.log("Task1 Data => ", data);
        if (data.code == 200) {
            result1.innerHTML = `<b>Result: </b><span class="text-success">${data.msg}</span>`;
        } else {
            result1.innerHTML = `<b>Result: </b><span class="text-danger">${data.msg}</span>`;
        }
    } catch (error) {
        console.log("Task1 Error => ", error);
        result1.innerHTML = "Internal Server Error!";
    } finally {
        task1CheckBtn.disabled = false;
        task1CheckBtn.innerHTML = "Check";
    }
    task1CheckBtn.innerHTML = "Check";
}


async function checkTask2() {
    task2CheckBtn.disabled = true;
    task2CheckBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Checking...
    `;
    try {
        const batchSize = parseInt(
            document.getElementById("batch-size").value || 5,
            10
        );
        const response = await fetch(`${backend_url}/task2/batches/${batchSize}`);
        const data = await response.json();
        console.log("Task2 Data => ", data);
        if (data.code == 200) {
            result2.innerHTML = `<b>Result: </b><span class="text-success">${data.msg}</span>`;
        } else {
            result2.innerHTML = `<b>Result: </b><span class="text-danger">${data.msg}</span>`;
        }
    } catch (error) {
        console.log("Task2 Error => ", error);
        result2.innerHTML = "Internal Server Error!";
    } finally {
        task2CheckBtn.disabled = false;
        task2CheckBtn.innerHTML = "Check";
    }
}
