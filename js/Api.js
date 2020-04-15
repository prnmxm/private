class Api {
    constructor(weatherConfig,lang) {
        this.weatherConfig = weatherConfig;
        this.lang = lang;
    }
    async getLocationIp() {
        try {
            const getIp = await fetch('https://api.ipify.org/?format=json');
            const ip = await getIp.json();
            const getInfo = await fetch(`http://ip-api.com/json/${ip.ip}`);
            const cord = await getInfo.json();
            return {
                'lat': cord.lat,
                'lon': cord.lon,
            };
        } catch (e) {
            console.log(e);
        }
    }
    async currentDay(dataInfo) {
        try {
            console.log(dataInfo.lat, dataInfo.lon)
            const response = await fetch(`${this.weatherConfig.baseUrl}weather${dataInfo.city ?  `?q=${dataInfo.city}`:`?lat=${dataInfo.lat}&lon=${dataInfo.lon}`}&appid=${this.weatherConfig.apiKey}&units=metric&lang=${this.lang}`);
            const data = await response.json();
            return {data};
        } catch(error) {
            return {error:error};
        }
    }
    async nextDays(dataInfo) {
        try {
            const get = await fetch(`${this.weatherConfig.baseUrl}forecast${dataInfo.city ?  `?q=${dataInfo.city}`:`?lat=${dataInfo.lat}&lon=${dataInfo.lon}`}&appid=${this.weatherConfig.apiKey}&&units=metric&lang=${this.lang}`)
            const data = await get.json();
            return {data};
        } catch(error) {
            return {error:error};
        }
    }
}