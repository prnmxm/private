const config = {
    locationOption: {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
    },
    weather: {
        baseUrl: 'https://api.openweathermap.org/data/2.5/',
        apiKey: '0442627eac0a6f3797762c0eaa3b2cfb'
    }
}
const form = document.querySelector('#formSearch');
const cityName = document.querySelector('#cityName');
const time = document.querySelector('#time');
const divCurrentDay = document.querySelector('.app__currentDay');
const divNextDays = document.querySelector('.app__nextDays');
const api = new Api(config.weather,lang);
const userLocation = new UserLocation(api.getLocationIp, config.locationOption);
const getWeather = new GetWeather(api);
const render = new Render(form,lang,getWeather,cityName,time,divCurrentDay,divNextDays);
(async function() {
    render.loading('Загрузка...');
    const cord = await userLocation.getLocation();
    render.render(cord)
    render.updateWeather();
})()