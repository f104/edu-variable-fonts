import '../scss/app.scss'

class App {

    constructor() {
        this.initFonts()
    }

    initFonts() {
        this.font = document.querySelector('.js-font')
        const inputWeight = document.querySelector('.js-weight-input')
        const infoWeight = document.querySelector('.js-weight-info')
        const inputWidth = document.querySelector('.js-width-input')
        const infoWidth = document.querySelector('.js-width-info')
        const btnReset = document.querySelector('.js-btn')

        this.defaultWeight = inputWeight.value
        this.setFontWeight(this.defaultWeight)
        inputWeight.addEventListener('input', () => {
            infoWeight.innerHTML = inputWeight.value
            this.setFontWeight(inputWeight.value)
        })

        this.defaultWidth = inputWidth.value
        this.setFontWidth(this.defaultWidth)
        inputWidth.addEventListener('input', () => {
            infoWidth.innerHTML = inputWidth.value
            this.setFontWidth(inputWidth.value)
        })

        btnReset.addEventListener('click', () => {
            inputWeight.value = this.defaultWeight
            infoWeight.innerHTML = this.defaultWeight
            this.setFontWeight(this.defaultWeight)
            inputWidth.value = this.defaultWidth
            infoWidth.innerHTML = this.defaultWidth
            this.setFontWidth(this.defaultWidth)
        })
    }

    setFontWeight(weight) {
        this.font.style.fontWeight = weight
    }

    setFontWidth(width) {
        this.font.style.fontStretch = `${width}%`
    }
}
new App()
