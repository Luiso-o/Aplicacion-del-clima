const API_KEY = '77bbeb5891aeaad2a5e59dcb00d8dd2e';

const fetchData = async position => {
    const { latitude, longitude } = position.coords;
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
        const data = await response.json();
        setWeatherData(data);
        console.log(data);
    } catch (error) {
        showError('Hubo un error al obtener los datos meteorológicos:', error);
    }
};

const getCurrentTimeEmoji = () => {
    const hours = new Date().getHours();
    const greeting = document.getElementById('greeting');

    if (hours >= 6 && hours < 12) {
        greeting.textContent = '🌅 Good Morning! ☕'; 
    } else if (hours >= 12 && hours < 18) {
        greeting.textContent =  '🌞 Good Afternoon! 😎'; 
    } else if (hours >= 18 && hours < 22) {
        greeting.textContent =  '🌆 Good Evening! 😊'; 
    } else {
        greeting.textContent = '🌙 Good Night! 😴'; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getCurrentTimeEmoji();
    setInterval(getCurrentTimeEmoji, 60000);
});

const getWeatherDescriptionWithEmoji = (description) => {
    const emojiMap = {
        'Clear': '☀️ Sunny',
        'Clouds': '☁️ Cloudy',
        'Rain': '🌧️ Rainy',
        'Drizzle': '🌦️ Drizzly',
        'Thunderstorm': '⛈️ Thunderstorm',
        'Snow': '❄️ Snowy',
    };
    return emojiMap[description] || description;
};

const setWeatherData = (data) => {
    const weatherData = {
        location: `📍 ${data.name}`,
        description: data.weather[0].main,
        temperature: `🌡️ ${data.main.temp} °C`,
        feelsLike: `🥵🥶 Sensación térmica: ${data.main.feels_like} °C`,
        humidity: `💧 Humedad: ${data.main.humidity}%`,
        pressure: `🔵 Presión: ${data.main.pressure} hPa`,
        tempMax: `🔺 Temp. Máxima: ${data.main.temp_max} °C`,
        tempMin: `🔻 Temp. Mínima: ${data.main.temp_min} °C`,
        windSpeed: `🌬️ Velocidad del viento: ${data.wind.speed} m/s`,
        date: getDate(),
    };

    Object.keys(weatherData).forEach((key) => {
        const element = document.getElementById(key);
        if (element) {
            if (key === 'description') {
                element.textContent = getWeatherDescriptionWithEmoji(weatherData[key]);
            } else {
                element.textContent = weatherData[key];
            }
        }
    });
    updateWeatherGif(data.main.temp);
    cleanUp();
};

const cleanUp = () => {
    let container = document.getElementById('container');
    let loader = document.getElementById('loader');

    loader.style.display = 'none';
    container.style.display = 'flex';
}

const getDate = () => {
    let date = new Date();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();
    
    const monthEmojis = {
        '01': '🌟', // Enero
        '02': '❄️', // Febrero
        '03': '🌸', // Marzo
        '04': '🌼', // Abril
        '05': '🌷', // Mayo
        '06': '🌞', // Junio
        '07': '🌻', // Julio
        '08': '🌾', // Agosto
        '09': '🍂', // Septiembre
        '10': '🎃', // Octubre
        '11': '🍁', // Noviembre
        '12': '⛄' // Diciembre
    };

    const monthEmoji = monthEmojis[month] || '';
    return `${monthEmoji} ${day}-${month}-${year}`;
}


const onLoad = () => {
    getSeason();
    navigator.geolocation.getCurrentPosition(fetchData, showError);
}

const showError = (message, error) => {
    console.error(message, error);

    if (error && error.code === error.PERMISSION_DENIED) {
        const errorMessage = 'Se ha denegado el permiso de geolocalización. Por favor, permita el acceso a su ubicación para ver los datos meteorológicos.';
        alert(errorMessage); 
    } else {
        const errorMessage = 'Hubo un error al obtener los datos meteorológicos. Por favor, inténtelo de nuevo más tarde.';
        alert(errorMessage); 
    }
}

function getSeason() {
    const body = document.querySelector('body'); 
    const month = new Date().getMonth() + 1;
 
    if (month >= 3 && month <= 5) {
        body.style.background = 'url(images/spring.jpg) no-repeat center center/cover';
    } else if (month >= 6 && month <= 8) {
        body.style.background = 'url(images/summer.jpg) no-repeat center center/cover';
    } else if (month >= 9 && month <= 11) {
        body.style.background = 'url(images/autumn.jpg) no-repeat center center/cover';
    } else {
        body.style.background = 'url(images/winter.jpg) no-repeat center center/cover';
    }
}

function updateWeatherGif(temperature) {
    const gif = document.getElementById('gif');
    
    if (temperature < 10) {
        gif.src = 'images/frio.gif';
    } else if (temperature >= 10 && temperature <= 25) {
        gif.src = 'images/buenDia.gif';
    } else {
        gif.src = 'images/calor.gif';
    }
}
