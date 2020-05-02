function pickColorByTheme(lightThemeColor: string, darkThemeColor: string): string {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return darkThemeColor;
    } else {
        return lightThemeColor;
    }
}

function createPlot(
    rows: number[][],
    index: number,
    hoursStep: number,
    radiusStep: number,
    radiusSuffix: string,
    canvas: HTMLCanvasElement
) {
    const vals = rows.map(r => r[index]),
        min: number = Math.min.apply(null, vals),
        max: number = Math.max.apply(null, vals),
        overallRadius = Math.min(canvas.width, canvas.height) / 2,
        ctx = canvas.getContext('2d');

    let mouseX = 0, mouseY = 0;

    const fakeCanvas = document.createElement('canvas');
    fakeCanvas.width = canvas.width;
    fakeCanvas.height = canvas.height;
    const fakeCtx = fakeCanvas.getContext('2d');

    const tooltip = document.createElement('div'),
        timeDisplay = document.createElement('h1'),
        valuesDisplay = document.createElement('ul'),
        averageDisplay = document.createElement('li');

    tooltip.classList.add('tooltip');
    tooltip.appendChild(timeDisplay);
    averageDisplay.appendChild(document.createElement('strong'));
    valuesDisplay.appendChild(averageDisplay);
    tooltip.appendChild(valuesDisplay);
    document.body.appendChild(tooltip);

    function getCoords(t: number, val: number): [number, number] {
        const rad = (val - min) / (max - min) * overallRadius / 2 + overallRadius / 2,
            angle = t / (24 * 60 * 60 * 1000) * 2 * Math.PI;

        return [overallRadius + Math.cos(angle) * rad, overallRadius + Math.sin(angle) * rad];
    }

    function render() {
        fakeCtx.clearRect(0, 0, fakeCanvas.width, fakeCanvas.height);
        fakeCtx.lineWidth = 1;
        fakeCtx.strokeStyle = pickColorByTheme('#00000040', '#ffffff40');
        fakeCtx.fillStyle = pickColorByTheme('black', 'white');
        fakeCtx.font = 'bold 12px Inter';
        fakeCtx.textAlign = 'right';

        for (let val = Math.floor(min / radiusStep) * radiusStep; val <= Math.ceil(max / radiusStep) * radiusStep; val += radiusStep) {
            const rad = (val - min) / (max - min) * overallRadius / 2 + overallRadius / 2;
            if (rad >= overallRadius) continue;
            fakeCtx.beginPath();
            fakeCtx.arc(overallRadius, overallRadius, rad, 0, 2 * Math.PI);
            fakeCtx.stroke();
            fakeCtx.closePath();
            fakeCtx.fillText(`${val}${radiusSuffix}`, overallRadius + rad, overallRadius);
        }

        fakeCtx.textBaseline = 'top';
        fakeCtx.textAlign = 'center';

        for (let hours = 0; hours < 24; hours += hoursStep) {
            const angle = (hours / 24) * 2 * Math.PI;
            fakeCtx.beginPath();
            fakeCtx.moveTo(overallRadius + overallRadius * Math.cos(angle), overallRadius + overallRadius * Math.sin(angle));
            fakeCtx.lineTo(overallRadius, overallRadius);
            fakeCtx.stroke();
            fakeCtx.closePath();
            fakeCtx.fillText(`${hours}:00`, overallRadius + 100 * Math.cos(angle), overallRadius + 100 * Math.sin(angle));
        }

        fakeCtx.strokeStyle = pickColorByTheme('black', 'white');

        fakeCtx.beginPath();
        fakeCtx.moveTo(...getCoords(rows[0][0], vals[0]));
        for (let i = 1; i < rows.length; i++) {
            fakeCtx.lineTo(...getCoords(rows[i][0], vals[i]));
        }
        fakeCtx.stroke();
        fakeCtx.closePath();

        ctx.drawImage(fakeCanvas, 0, 0);
    }

    function highlightPoints() {
        let angle = Math.atan2(mouseY - overallRadius, mouseX - overallRadius);
        if (angle < 0) angle += 2 * Math.PI;
        const ms = angle / (2 * Math.PI) * 24 * 3600 * 1000;

        ctx.strokeStyle = pickColorByTheme('#80000080', '#ffff8080');
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(overallRadius, overallRadius);
        ctx.lineTo(overallRadius + overallRadius * Math.cos(angle), overallRadius + overallRadius * Math.sin(angle));
        ctx.stroke();
        ctx.closePath();

        const pointsHighlighted = [];

        for (let i = 0; i < rows.length - 1; i++) {
            const t1 = rows[i][0] % (24 * 3600 * 1000), t2 = rows[i + 1][0] % (24 * 3600 * 1000);
            // borders the target time?
            if (t1 <= ms && t2 >= ms) {
                let t, val;
                // use closer one
                if ((ms - t1) < (t2 - ms)) {
                    t = t1;
                    val = vals[i];
                } else {
                    t = t2;
                    val = vals[i + 1];
                }

                pointsHighlighted.push([t, val]);

                ctx.fillStyle = pickColorByTheme('#800000', '#ffff80');
                ctx.strokeStyle = pickColorByTheme('#ffffff', '#222222');
                ctx.lineWidth = 3;
                ctx.beginPath();
                const [x, y] = getCoords(t, val);
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
        }

        const minutes = Math.floor(ms / 60000) % 60,
            hours = Math.floor(ms / 3600000);
        timeDisplay.textContent = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        tooltip.classList.add('visible');

        while (valuesDisplay.lastChild != averageDisplay) {
            valuesDisplay.removeChild(valuesDisplay.lastChild);
        }

        const average = pointsHighlighted.reduce((a, b) => a + b[1], 0) / pointsHighlighted.length,
            averageText = `Average: ${Math.round(average * 100) / 100}${radiusSuffix}`;
        averageDisplay.firstChild.textContent = averageText;

        for (let i = pointsHighlighted.length - 1; i >= 0; i--) {
            const li = document.createElement('li');
            li.textContent = pointsHighlighted[i][1] + radiusSuffix;
            valuesDisplay.appendChild(li);
        }
    }

    render();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => render());

    function mouseEnterOrMove(e: MouseEvent) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(fakeCanvas, 0, 0);
        mouseX = e.pageX - canvas.offsetLeft;
        mouseY = e.pageY - canvas.offsetTop;
        highlightPoints();
        tooltip.style.left = `${e.pageX}px`;
        tooltip.style.top = `${e.pageY}px`;
    }

    function mouseLeave() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(fakeCanvas, 0, 0);
        tooltip.classList.remove('visible');
    }

    canvas.addEventListener('mouseenter', mouseEnterOrMove);
    canvas.addEventListener('mousemove', mouseEnterOrMove);
    canvas.addEventListener('mouseleave', mouseLeave);
}

import('./data.json').then(({ default: { data: rows } }) => {
    createPlot(rows, 1, 3, 2, '°C', document.getElementById('temp') as HTMLCanvasElement);
    createPlot(rows, 2, 3, 5, '%', document.getElementById('humidity') as HTMLCanvasElement);
});
