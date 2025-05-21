const task1CheckBtn = document.getElementById("task-1-check-btn");
const task2CheckBtn = document.getElementById("task-2-check-btn");
const result1 = document.getElementById("result-1");
const result2 = document.getElementById("result-2");
const batchSize = document.getElementById("batch-size");

task1CheckBtn.onclick = checkTask1;
task2CheckBtn.onclick = checkTask2;

const backend_url = "http://localhost:3000";

async function checkTask1() {
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
        result1.innerHTML = "Interval Server Error!";
    }
}

async function checkTask2() {
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
        console.log("Task1 Error => ", error);
        result2.innerHTML = "Interval Server Error!";
    }
}
