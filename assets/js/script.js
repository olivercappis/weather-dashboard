

const key = '2c373f310dd0cd87b16c9a0fe8fdd4e6'
const inputEl = $('input')
const searchButton = $('#search')
const history = $('#searchHistory')

const currentWeather = $('#currentContainer')
const currentWeatherHead = $('<h1>')
const currentTemp = $('<p>')
const currentWind = $('<p>')
const currentHumidity = $('<p>')

currentWeather.append(currentWeatherHead)
currentWeather.append(currentTemp)
currentWeather.append(currentWind)
currentWeather.append(currentHumidity)

const futureForecast = $('.futureForecast')



function collectInput(event) {
    event.preventDefault()
    localStorage.setItem('selection', null)

    let input = inputEl.val()

    if (input === '') {
        alert('Must input a city')
        return
    }
    let selection = input

    inputEl.val('')

    createButton(input)

    console.log(selection)
    call(selection)
}

function createButton(input) {
    const button = $('<button>')

    button.text(input)

    button.attr('class', 'btn btn-secondary city')

    history.append(button)
}

function call(selection, event) {

    let x = JSON.parse(localStorage.getItem('selection'))

    if (x !== null) {
        selection = x
    }



    let call = `https://api.openweathermap.org/data/2.5/forecast?q=${selection}&appid=2c373f310dd0cd87b16c9a0fe8fdd4e6&units=imperial`

    fetch(call)
        .then(function (response) {
            return response.json()
        })

        .then(function (data) {
            // console.log(data)
            // console.log(data.list[0].weather[0].icon)


            const city = data.city.name
            const date = dayjs(data.list[0].dt_txt).format('MM/D/YYYY')
            const temp = data.list[0].main.temp
            const wind = data.list[0].wind.speed
            const humidity = data.list[0].main.humidity + '%'

            currentWeatherHead.text(city + ' ' + date)
            currentTemp.text('Temp: ' + temp)
            currentWind.text('Wind: ' + wind)
            currentHumidity.text('Humidity: ' + humidity)


            if (futureForecast.length) {
                futureForecast.empty()
            }


            const list = data.list
            for (let i = 1; i < list.length; i += 8) {
                const day = $('<div>')
                const fDate = $('<h4>')
                const fTemp = $('<p>')
                const fWind = $('<p>')
                const fHumidity = $('<p>')

                day.attr('class', 'day')
                fDate.text(dayjs(data.list[i].dt_txt).format('MM/D/YYYY'))
                fTemp.text('Temp: ' + data.list[i].main.temp)
                fWind.text('Wind: ' + data.list[i].wind.speed)
                fHumidity.text('Humidity: ' + data.list[i].main.humidity)

                day.append(fDate)
                day.append(fTemp)
                day.append(fWind)
                day.append(fHumidity)
                futureForecast.append(day)
            }

        })





}

searchButton.on('click', collectInput)




$('#searchHistory').on('click', '.city', function (event) {
    localStorage.setItem('selection', JSON.stringify(event.target.innerHTML))
})

$('#searchHistory').on('click', '.city', call)

