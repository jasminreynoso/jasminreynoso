let timeLeft = 25 * 60;
let isRunning = false;
let isWorkSession = true;
let intervalId = null;
let workTime = 25;
let breakTime = 5;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('sessionType').textContent = 
        isWorkSession ? 'Work Session' : 'Break Time';
}

function startTimer() {
    if (intervalId) return;
    
    isRunning = true;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    
    intervalId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            isWorkSession = !isWorkSession;
            timeLeft = (isWorkSession ? workTime : breakTime) * 60;
            updateDisplay();
            alert(isWorkSession ? 'Break over! Time to work!' : 'Work session complete! Take a break!');
            isRunning = false;
            document.getElementById('startBtn').disabled = false;
            document.getElementById('pauseBtn').disabled = true;
        }
    }, 1000);
}

function pauseTimer() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        isRunning = false;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
    }
}

function resetTimer() {
    pauseTimer();
    workTime = parseInt(document.getElementById('workTime').value);
    breakTime = parseInt(document.getElementById('breakTime').value);
    isWorkSession = true;
    timeLeft = workTime * 60;
    updateDisplay();
}

document.getElementById('workTime').addEventListener('change', () => {
    if (!isRunning && isWorkSession) {
        workTime = parseInt(document.getElementById('workTime').value);
        timeLeft = workTime * 60;
        updateDisplay();
    }
});

document.getElementById('breakTime').addEventListener('change', () => {
    breakTime = parseInt(document.getElementById('breakTime').value);
});

updateDisplay();

