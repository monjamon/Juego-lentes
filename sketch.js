
const canvas = document.getElementById('opticsCanvas');
const ctx = canvas.getContext('2d');

// Configuración inicial
canvas.width = 800;
canvas.height = 400;

let focalLength = 150; // Distancia focal en píxeles
let isConvergent = true;
let mousePos = { x: 50, y: 200 };

// Eventos de botones
document.getElementById('btnConv').onclick = (e) => {
    isConvergent = true;
    updateButtons(e.target);
};
document.getElementById('btnDiv').onclick = (e) => {
    isConvergent = false;
    updateButtons(e.target);
};

function updateButtons(activeBtn) {
    document.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Seguimiento del mouse
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 1. Dibujar Eje Óptico
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#aaa';
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Dibujar Lente
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX, 50);
    ctx.lineTo(centerX, 350);
    ctx.stroke();

    // Dibujar flechas de la lente (indicando tipo)
    if (isConvergent) {
        drawArrow(centerX, 50, 0); // Flecha arriba
        drawArrow(centerX, 350, Math.PI); // Flecha abajo
    } else {
        drawArrow(centerX, 50, Math.PI); // Flecha invertida
        drawArrow(centerX, 350, 0); 
    }

    // 3. Dibujar Rayo de Luz
    const rayStartY = mousePos.y;
    const rayStartX = 0;
    
    ctx.strokeStyle = '#ff4757';
    ctx.lineWidth = 2;

    // Rayo incidente (horizontal hasta la lente)
    ctx.beginPath();
    ctx.moveTo(rayStartX, rayStartY);
    ctx.lineTo(centerX, rayStartY);
    ctx.stroke();

    // Rayo refractado
    ctx.beginPath();
    ctx.moveTo(centerX, rayStartY);

    let f = isConvergent ? focalLength : -focalLength;
    
    // El rayo que viene paralelo al eje sale pasando por el foco
    // Calculamos el punto de destino basado en la dirección hacia el foco (F)
    const focusX = centerX + f;
    const focusY = centerY;

    // Vector de dirección desde el punto de impacto en la lente hacia el foco
    let dx = focusX - centerX;
    let dy = focusY - rayStartY;
    
    // Extendemos el rayo hasta el final del canvas
    let targetX = canvas.width;
    let targetY = rayStartY + (dy / dx) * (targetX - centerX);

    ctx.lineTo(targetX, targetY);
    ctx.stroke();

    // Dibujar Focos (F)
    ctx.fillStyle = '#2ed573';
    ctx.beginPath();
    ctx.arc(centerX + focalLength, centerY, 4, 0, Math.PI * 2);
    ctx.arc(centerX - focalLength, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(draw);
}

function drawArrow(x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-10, 10);
    ctx.lineTo(0, 0);
    ctx.lineTo(10, 10);
    ctx.stroke();
    ctx.restore();
}

draw();
