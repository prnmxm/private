class GetWeather {
    constructor(api) {
        this.api = api;
        this.cord = {};
    }
    async getCurrentDay() {
        try {
            const {data,error} = await this.api.currentDay(this.cord);
            // Сетевая ошибка
            if(error) {
                return {"error": "Error Connection"}
            }
            // Ошибка в запросе
            if(data.cod >= 404) {
                return {'error': "Not found"};
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
                'name': data.name,
                'timezone': data.timezone
            }
            return obj;
        } catch(e) {
            return {e}
        }
    }
    async getNextDays() {
        try {
            const {data,error} = await this.api.nextDays(this.cord);
            // Сетевая ошибка
            if(error) {
                return {"error": "Error Connection"}
            }
            // Ошибка в запросе
            if(data.cod >= 404) {
                return {'error': "Not found"};
            }   
            const obj = new Map();
            data.list.forEach(e=> {
                const key = (e.dt_txt).split(' ');
                if(key[1] === '09:00:00') {
                    obj.set(key[0], {
                        weather: {
                            main: e.weather[0].main,
                            description: e.weather[0].description,
                            icon: e.weather[0].icon
                        },
                        main: {...e.main},
                        wind: {...e.wind},
                        data: e.dt
                    })
                }
            })
            return obj;
        } catch(e) {
            return {e}
        }
    }
    setCord(cord) {
        this.cord = {...cord};
    }
}