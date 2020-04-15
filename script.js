const config = {
    locationOption: {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
    },
    weather: {
        baseUrl: 'http://api.openweathermap.org/data/2.5/',
        apiKey: '0442627eac0a6f3797762c0eaa3b2cfb'
    }
}
const form = document.querySelector('#formSearch');
const api = new Api(config.weather,lang);
const userLocation = new UserLocation(api.getLocationIp, config.locationOption);
const render = new Render(api,form,lang);
(async function() {
    render.loading();
    const cord = await userLocation.getLocation();
    render.render(cord)
    render.updateWeather();
})()