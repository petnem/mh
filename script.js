document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('examClock');
    if (!canvas.getContext) {
        alert('Canvas není podporován vaším prohlížečem, prosím aktualizujte ho.');
        return;
    }
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height + 60; // Zvětšení pro text pod ciferníkem
    canvas.height = height;
    const centerX = width / 2;
    const centerY = (height - 60) / 2; // Upraveno pro vykreslení textu pod ciferníkem
    const radius = Math.min(width, height) / 3;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    let paused = true;
    let elapsedSeconds = 0;
    let currentSectionIndex = 0;
    let sectionStartTime = new Date(); // Initialize with the current time at the start

    const sections = [
        { name: "Úvod", duration: 0.5 * 60, color: "#FFD700" },
        { name: "1. část", duration: 2.5 * 60, color: "#FF6347" },
        { name: "Popis", duration: 1.5 * 60, color: "#90EE90" },
        { name: "Porovnání", duration: 1 * 60, color: "#6495ED" },
        { name: "Otázky", duration: 1.5 * 60, color: "#FFA07A" },
        { name: "Odbornost", duration: 5 * 60, color: "#B0C4DE" },
        { name: "Rozhovor", duration: 3 * 60, color: "#D8BFD8" }
    ];
    let totalDuration = sections.reduce((total, section) => total + section.duration, 0);

    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
  


function drawClock() {
    ctx.clearRect(0, 0, width, height);

        // Total and remaining time above the clock
        ctx.font = "16px Arial";
        ctx.fillStyle = "#000";
        let timeInfo = `Celkový čas zkoušky: ${formatTime(totalDuration)} | Čas do konce: ${formatTime(totalDuration - elapsedSeconds)}`;
        let textWidth = ctx.measureText(timeInfo).width;
        ctx.fillText(timeInfo, (width - textWidth) / 2, 30);

        let startAngle = -0.5 * Math.PI;
        sections.forEach((section, index) => {
            const sectionDuration = section.duration;
            const sectionAngle = (sectionDuration / totalDuration) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sectionAngle, false);
            ctx.closePath();
            ctx.fillStyle = section.color;
            ctx.fill();

            // Drawing section labels
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + sectionAngle / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#000";
            ctx.font = "16px Arial";
            ctx.fillText(section.name, radius - 10, 5);
            ctx.restore();

            startAngle += sectionAngle;
        });

        // Aktualizace indexu aktuálního úseku a výpočet uplynulého času v něm
    let sectionStartSeconds = sections.slice(0, currentSectionIndex).reduce((acc, section) => acc + section.duration, 0);
    let currentSectionElapsed = elapsedSeconds - sectionStartSeconds;
    let currentSectionRemaining = sections[currentSectionIndex].duration - currentSectionElapsed;

    // Ošetření případu, kdy by výpočet mohl vést k zápornému času
    if (currentSectionRemaining < 0) {
        currentSectionRemaining = 0;
    }
    
 

             // Inside your setInterval function
if (currentSectionRemaining <= 10) {
    document.body.classList.add('blinking-warning');
} else {
    document.body.classList.remove('blinking-warning');
}
 
    
    // Vykreslení zbývajícího času aktuálního úseku pod ciferníkem
    ctx.font = "18px Arial";
    ctx.fillStyle = "#000000"; // Zlatá barva pro zvýraznění
   let remainingTimeText = `Celkový čas úseku: ${formatTime(sections[currentSectionIndex].duration)} | Zbývající čas: ${formatTime(currentSectionRemaining)}`;
    ctx.fillText(remainingTimeText, centerX - (ctx.measureText(remainingTimeText).width / 2), height - 28);
    ctx.fillText("©Petr Němec", centerX - (ctx.measureText("©Petr Němec").width / 2), height - 5);


        // Draw the hand
        const handAngle = (-0.5 + (elapsedSeconds / totalDuration) * 2) * Math.PI;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + radius * 0.9 * Math.cos(handAngle), centerY + radius * 0.9 * Math.sin(handAngle));
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Event listeners for control buttons
    document.getElementById('startButton').addEventListener('click', () => {
        if (paused) {
            paused = false;
            timer = setInterval(() => {
                
    elapsedSeconds++;
    if (elapsedSeconds > totalDuration) {
        clearInterval(timer);
        return;
    }


    // Right before incrementing currentSectionIndex
document.body.classList.remove('blinking-warning');

    // Calculate the elapsed time for the current section
    let sectionElapsed = elapsedSeconds - sections.slice(0, currentSectionIndex).reduce((total, section) => total + section.duration, 0);
    // Check if we need to move to the next section
    if (sectionElapsed >= sections[currentSectionIndex].duration) {
        currentSectionIndex++;
        // Ensure we do not exceed the sections array
        if (currentSectionIndex >= sections.length) {
            clearInterval(timer);
            return;
        }
    }

    drawClock();
}, 1000);

        }
    });

    document.getElementById('pauseButton').addEventListener('click', () => {
        if (!paused) {
            clearInterval(timer);
            paused = true;
        }
    });

    document.getElementById('resetButton').addEventListener('click', () => {
        clearInterval(timer);
        elapsedSeconds = 0;
        currentSectionIndex = 0;
        paused = true;
        drawClock();
    });

    drawClock(); // Initial drawing of the clock
});

