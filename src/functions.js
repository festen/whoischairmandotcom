///////////////
//// UTILS ////
///////////////
window.getWeek = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

window.dateOfWeek = (week, year = 2021) => {
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = simple.getDay();
    const ISOWeekStart = simple;
    if (dow <= 4) ISOWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else ISOWeekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOWeekStart;
}

window.weekToRange = (week) => {
    const start = dateOfWeek(week)
    const stop = new Date(start)
    stop.setDate(stop.getDate() + 4)
    return [start, stop]
}

window.after = (delay = 500) => new Promise(resolve => setTimeout(resolve, delay))

window.loadImage = (img, url, timeout) => new Promise(resolve => {
    const timeoutToken = setTimeout(() => img.src = url, timeout)
    img.onload = () => {
        clearTimeout(timeoutToken)
        resolve();
    }
    img.src = url
})

//////////////////////
//// CREATE STUFF ////
//////////////////////
window.createTableData = (index, count) => {
    const fmt = new Intl.DateTimeFormat('en', {dateStyle: 'long'}).format

    const data = new Array(count).fill(0).map((_, i) => {
        const [from, to] = window.weekToRange(i + index)
        return [fmt(from), '-', fmt(to), window.names[(i + index - window.namesOffset) % window.names.length]]
    })
    const alignment = ['right', 'center', 'right', 'left']
    return [data, alignment]
}

window.createTable = async (data, align = []) => {
    const table = document.createElement('table')
    table.style.opacity = '0'
    for (let i = 0; i < data.length; i++) {
        const row = document.createElement('tr')
        row.style.opacity = i === 0 ? '1' : '0.5'
        for (let j = 0; j < data[i].length; j++) {
            const element = document.createElement('td')
            element.innerText = data[i][j]
            element.style.textAlign = align[j] ?? 'left'
            row.appendChild(element)
        }
        table.appendChild(row)
    }
    document.body.appendChild(table)
    after(5000).then(() => table.style.opacity = '1')
}

window.createHeroBanner = async (index) => {
    try {
        const name = window.names[(index - window.namesOffset) % window.names.length]
        const meme = window.memes[(index - window.memesOffset) % window.memes.length]
        const text0 = (meme.text0 ?? '').replaceAll('{{name}}', name)
        const text1 = (meme.text1 ?? '').replaceAll('{{name}}', name)
        const response = await fetch(`https://api.imgflip.com/caption_image?text0=${text0}&text1=${text1}&username=festen&password=hufceH-dasmes-herxy4&template_id=${meme.id}`, {
            method: 'POST',
        })

        const result = await response.json()
        const container = document.createElement('div')
        document.body.appendChild(container)

        const title = document.createElement('p')
        title.style.opacity = '0'
        container.appendChild(title)

        const content = document.createElement('img')
        content.style.opacity = '0'
        container.appendChild(content)

        await loadImage(content, result.data.url, 3000)
        title.innerHTML = `And our lucky chairman of the week is &nbsp;&nbsp;&nbsp;`
        title.style.opacity = '1'

        Promise.resolve()
            .then(() => after(500))
            .then(() => title.innerHTML = `And our lucky chairman of the week is .&nbsp;&nbsp;`)
            .then(() => after(500))
            .then(() => title.innerHTML = `And our lucky chairman of the week is ..&nbsp;`)
            .then(() => after(500))
            .then(() => title.innerHTML = `And our lucky chairman of the week is ...`)
            .then(() => after(500))
            .then(() => {
                content.style.opacity = '1'
                title.innerHTML = `And our lucky chairman of the week is <strong>${name}</strong>`
            })
    } catch (e) {
        console.error(e)
        const content1 = document.createElement('p')
        content1.innerHTML = "<strong>Oh no!</strong> something went wrong...."
        const content2 = document.createElement('p')
        content2.innerHTML = "We have no idea who is chairman, <strong>what do we do now?</strong>"
        document.body.appendChild(content1)
        document.body.appendChild(content2)
        throw e
    }
}

//////////////////
//// Sparkles ////
//////////////////
window.sparkles = async () => {
    const r = (lower, upper) => Math.random() * (upper - lower) + lower
    const times = 10
    for (let i = 0; i < times; i++) {
        await window.after(r(250,1750))
        confetti({
            spread: r(30, 150),
            particleCount: r(50, 100),
            origin: {
                x: r(0.3, 0.7),
                y: r(0.3, 0.6),
            },
            ticks: r(150, 400)
        })
    }
}
