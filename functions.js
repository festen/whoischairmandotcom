const user = 'festen'
const token = 'hufceH-dasmes-herxy4'
const delay = 500

const loadImageUrl = (img, url, timeout = 3000) => new Promise((resolve, reject) => {
    const timeoutToken = setTimeout(reject, timeout)
    img.onload = () => {
        clearTimeout(timeoutToken)
        resolve();
    }
    img.src = url
})

const week = () => {
    const now = new Date()
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const  dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};

window.getIndex = week

window.after = (delay, fn = () => {}) => new Promise((resolve) => setTimeout(() => {
    fn()
    resolve()
}, delay))

window.r = (lower, upper) => {
    if (upper === undefined) {
        upper = lower
        lower = 0
    }
    return Math.random() * (upper - lower) + lower
}

window.load = async (name, meme) => {
    document.body.innerHTML = ''
    try {
        const text0 = (meme.text0 ?? meme.default ?? '').replaceAll('{{name}}', name)
        const text1 = (meme.text1 ?? name ?? '').replaceAll('{{name}}', name)
        const response = await fetch(`https://api.imgflip.com/caption_image?text0=${text0}&text1=${text1}&username=${user}&password=${token}&template_id=${meme.id}`, {
            method: 'POST',
        })

        const result = await response.json()
        const title = document.createElement('p')
        title.style.opacity = '0'
        document.body.appendChild(title)

        const content = document.createElement('img')
        content.style.opacity = '0'
        document.body.appendChild(content)

        await loadImageUrl(content, result.data.url)
        title.innerHTML = `And our lucky chairman of the week is &nbsp;&nbsp;&nbsp;`
        title.style.opacity = '100'

        await after(delay, () => title.innerHTML = `And our lucky chairman of the week is .&nbsp;&nbsp;`)
        await after(delay, () => title.innerHTML = `And our lucky chairman of the week is ..&nbsp;`)
        await after(delay, () => title.innerHTML = `And our lucky chairman of the week is ...`)
        await after(delay, () => {
            content.style.opacity = '100'
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
