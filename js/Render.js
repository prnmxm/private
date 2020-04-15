class Render {
    constructor(form,lang,getWeather,city,time) {
        this.form = form;
        this.lang = lang;
        this.getWeather = getWeather;
        this.city = city;
        this.time = time;
        this.offsetTime = '';
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
        this.time.textContent = `${h}:${m}`;
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
        console.log(this.city)
        this.offsetTime = data.timezone;
        this.city.textContent = data.name;
        this.renderTime()
        console.log(data);
        // Вывод
    }
    async renderNextDays() {
        const data = await  this.getWeather.getNextDays(this.cord);
        if(!!data.error) {
            return this.error(data.error);
        }
        console.log(data);
        // Вывод
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
        if(!icons[key]) {
            return icons['01']
        }
        return icons[key];
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