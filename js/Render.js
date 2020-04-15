class Render {
    constructor(form,lang,getWeather,city,time,divCurrentDay,divNextDays) {
        this.form = form;
        this.lang = lang;
        this.getWeather = getWeather;
        this.city = city;
        this.time = time;
        this.offsetTime = '';
        this.divCurrentDay = divCurrentDay;
        this.divNextDays = divNextDays;
        this.date = new Date();
    }
    async render(cord) {
        this.getWeather.setCord(cord)
        this.renderErrorSearch();
        await Promise.all([this.renderCurrentDay(),this.renderNextDays()]);
        this.loading()
    }
    renderTime = () => {
        const date = new Date();
        const h = date.getUTCHours() + (this.offsetTime/60/60);
        const m = date.getUTCMinutes();
        this.time.textContent = `${h}:${m < 10 ? '0' + m : m}`;
        setTimeout(this.renderTime, 1000)
    }
    loading(text = 'Загрузка...'){
        const load = document.body.querySelector('.app__bg');
        const loadText = document.body.querySelector('.app__bg p');
        if(load.style.display == 'flex') {
            load.style.display = '';
            loadText.textContent = '';
            return;
        }
        loadText.textContent = text;
        load.style.display = 'flex';

    }
    async renderCurrentDay() {
        const data = await this.getWeather.getCurrentDay(this.cord);
        if(!!data.error) {
            return this.error(data.error);
        }
        this.offsetTime = data.timezone;
        this.city.textContent = data.name;
        this.renderTime()
        this.divCurrentDay.innerHTML = '';
        this.divCurrentDay.insertAdjacentHTML('beforeend', this.templateCurrent(data))
    }
    weekDays = (timestamp) =>{
        this.date.setTime(timestamp * 1000);
        const days = {
            en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
        }
        return days[this.lang || 'en'][this.date.getDay()];
    }
    templateCurrent(data) {
        return `
        <div class="app__text  app__text_big">${Math.round(data.main.temp)}</div>
        <div class="badge">${this.weekDays(data.data)}</div>
        <div class="break-column"></div>
        <div class="icon icon_big ${this.getIcon(data.weather.icon)}"></div>
        <div class="app__text app__wind">${data.wind.speed}mph/${data.wind.deg}</div>
    `
    }

    async renderNextDays() {
        const data = await  this.getWeather.getNextDays(this.cord);
        if(!!data.error) {
            return this.error(data.error);
        }
        this.divNextDays.innerHTML = '';
        const template = data.forEach(e=> {
            this.divNextDays.insertAdjacentHTML('beforeend', this.templateDays(e));
        })
    }
    templateDays(data) {
        return `<div class="app__day">
        <span class="badge">${this.weekDays(data.data)}</span>
        <div class="icon icon_medium ${this.getIcon(data.weather.icon)}"></div>
        <p class="app__text">${Math.round(data.main.temp)}</p>
    </div>`
    }
    error(type) {
        const errors = {
            "Error Connection": {
                'ru': 'Ошибка подключения. Попробуйте позже.',
                'en': 'Connection error. Try later.'
            },
            "Not found": {
                'ru': 'Город не найден, попробуйте другой.',
                'en': 'City not found, try another.'
            }
        }
        return this.renderErrorSearch(errors[type][this.lang])
    }

    renderErrorSearch(text) {
        const span = this.form.querySelector('.app__form-error');
        span.textContent = '';
        span.style.display = 'none'

        if(text) {
            span.textContent = text;
            span.style.display = 'block'
        }
    }
    getIcon(key) {
        const item = key.slice(0,2)
        const icons = {
            '01': 'fas fa-sun',
            '02': 'fas fa-cloud-sun',
            '03': 'fas fa-cloud',
            '04': 'fas fa-cloud',
            '09': 'fas fa-cloud-showers-heavy',
            '10': 'fas fa-cloud-rain',
            '11': 'fas fa-poo-storm',
            '13': 'fas fa-snowflake',
            '50': 'fas fa-cloud'
        }
        if(!icons[item]) {
            return icons['01']
        }
        return icons[item];
    }
    updateWeather(){
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.loading('Загрузка...')
            this.render({'city':e.target.app__search.value});
            e.target.reset();
        });
    }
}