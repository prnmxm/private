class Render {
    constructor(api, form,lang) {
        this.api = api;
        this.cord = {};
        this.form = form;
        this.lang = lang;
    }
    async render(cord) {
        this.cord = {...cord}
        this.renderErrorSearch();
        await Promise.all([this.renderCurrentDay(),this.renderNextDays()]);
        this.loading()
    }
    loading(){
        const load = document.body.querySelector('.app__bg');
        if(load.style.display == 'flex') {
            load.style.display = '';
            return;
        }
        load.style.display = 'flex';

    }
    async renderCurrentDay() {
        try {
            const {data,error} = await this.api.getCurrentDay(this.cord);
            // Сетевая ошибка
            if(error) {
                return this.errorNetwork("Ошибка подключения. Попробуйте позже.");
            }
            // Ошибка в запросе
            if(data.cod >= 404) {
                return this.error(data.message);
            }
            const obj = {
                'weather': {
                    'main': data.weather[0].main,
                    'description': data.weather[0].description,
                    'icon': data.weather[0].icon
                },
                'main': {...data.main},
                'wind': {...data.wind},
                'data': data.dt,
                'name': data.name
            }
        } catch(e) {
            console.log('error1')
        }
    }
    async renderNextDays() {
        try {
            const {data,error} = await this.api.getNextDays(this.cord);
            // Сетевая ошибка
            if(error) {
                return this.errorNetwork("Ошибка подключения. Попробуйте позже.");
            }
            // Ошибка в запросе
            if(data.cod >= 404) {
                return this.error(data.message);
            }
            const obj = {};
            data.list.forEach(e=> {
                const key = (e.dt_txt).split(' ');
                if(key[1] === '09:00:00') {
                    obj[key[0]] = {
                        weather: {
                            main: e.weather[0].main,
                            description: e.weather[0].description,
                            icon: e.weather[0].icon
                        },
                        main: {...e.main},
                        wind: {...e.wind},
                        data: e.dt
                    }
                }
            })
        } catch(e) {
            console.log('error1')
        }
    }
    error() {
        const errors = {
            'ru': 'Город не найден, попробуйте другой.',
            'en': 'City not found, try another.'
        }
        this.renderErrorSearch(errors[this.lang])
    }
    errorNetwork(error) {
        console.log(error)
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
            this.loading()
            this.render({'city':e.target.app__search.value});
            e.target.reset();
        });
    }
}