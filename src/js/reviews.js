class SlideShow {
    constructor(selector, config = {}) {
        this.target = document.querySelector(selector)
        this.content = this.target.querySelector('[data-show-content]')
        this.items = Array.from(this.content.children)
        this.nav = this.target.querySelector('[data-show-nav]') 

        this.setPositionItems()
        this.setAnimation(config.animate)
        this.setActiveSlide(config.active)  

        this.nav.addEventListener('click', (event) => {
            event.preventDefault()

            const currentNav = event.target.closest('[data-show-link]')

            if (currentNav) {
                this.setActiveSlide(parseInt(currentNav.dataset.showLink))
            }
        })
    }

    setAnimation(config = {}) {
        this.items.forEach((item) => {
            item.style.transition = `opacity ${config.time || 1}s ${config.mode || 'ease'}`
        })
    }

    setPositionItems() {
        this.content.style.position = 'relative'

        for (const item of this.items) {
            item.style.position = 'absolute'
            item.style.top = 0
            item.style.opacity = 0
        }
    }

    setActiveSlide(index = 1) {
        this.items.forEach((item, i) => {
            if (index === i + 1) {
                item.style.position = 'relative'
                item.style.opacity = 1
                item.style.zIndex = 20
            } else {
                item.style.position = 'absolute'
                item.style.opacity = 0
                item.style.zIndex = 0
            }
        }) 

        this.setActiveNav(index)
    } 

    setActiveNav(index) {
        for (const nav of this.nav.children) {
            if (nav === this.nav.children[index - 1]) {
                nav.classList.add(`${nav.classList[0]}--active`)
            } else {
                nav.classList.remove(`${nav.classList[0]}--active`)
            }  
        }
    }   

}

const slide = new SlideShow('.slide-show', {
    active: 1,
    animate: {
        time: 2,
        mode: 'ease-in'
    }
})
  
//console.log(slide)

/* setTimeout(() => {
    slide.setActiveSlide(3)
}, 3000) */
