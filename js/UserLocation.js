class UserLocation {
    constructor(apiLocation,locationOption) {
        this.apiLocation = apiLocation;
        this.locationOption = locationOption;
    }
    async getLocation() {
        try {
            const cord = await this.getCurrentPosition();
            const lat  = cord.coords.latitude;
            const lon = cord.coords.longitude;
            return {lat, lon};
        } catch(e) {
            const cord = await this.getLocationIp();
            return cord;
        }
    }
    async getLocationIp() {
        try {
            const cord = await this.apiLocation();
            return cord;
        } catch(e) {
            return e;
        }
    }
    async getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, this.locationOption);
        });
    }
}