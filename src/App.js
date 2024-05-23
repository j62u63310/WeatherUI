import React, { useState } from 'react';
import axios from 'axios';

const City = () => {
    const [selectedCity, setSelectedCity] = useState('');
    const [weatherInfo, setWeatherInfo] = useState({
        location: '',
        forecast: []
    });
    const [selectedType, setSelectedType] = useState('');

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    const city_weather = async () => {
        if (selectedCity === '') {
            alert('請選擇城市');
            return;
        }
        try {
            const response = await axios.get('http://127.0.0.1:8080/api/weather', {
                params: {
                    city: selectedCity
                },
                withCredentials: true
            });

            const weatherData = response.data;
            const location = weatherData.records.location[0].locationName;
            const forecast = weatherData.records.location[0].weatherElement.map((element) => ({
                elementName: element.elementName,
                time: element.time.map((time) => ({
                    startTime: time.startTime,
                    endTime: time.endTime,
                    parameter: time.parameter
                }))
            }));

            setWeatherInfo({ location, forecast });

            console.log('成功:', weatherData);
        } catch (error) {
            console.error('失败：', error);
        }
    };

    const formatDate = (time) => {
        const date = new Date(time);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        return `${month}/${day} ${hour}點`;
    };

    const getDayPeriod = (startTime, endTime) => {
        const start = formatDate(startTime);
        const end = formatDate(endTime);
        return `${start} ~ ${end}`;
    };

    const renderForecast = () => {
        if (selectedType === '') return null;
        const MaxT = weatherInfo.forecast.find((item) => item.elementName === "MaxT");
        const MinT = weatherInfo.forecast.find((item) => item.elementName === "MinT");
        const Wx = weatherInfo.forecast.find((item) => item.elementName === "Wx");
        const CI = weatherInfo.forecast.find((item) => item.elementName === "CI");
        const PoP = weatherInfo.forecast.find((item) => item.elementName === "PoP");

        const timeList = MaxT?.time || MinT?.time || Wx?.time || CI?.time || PoP?.time || [];

        return (
            <div>
                <ul>
                    {timeList.map((time, index) => (
                        <li key={`forecast_${index}`}>
                            <p>時段: {getDayPeriod(time.startTime, time.endTime)}</p>
                            {selectedType === "溫度" && (
                                <>
                                    <p>最高溫度: {MaxT?.time.find((t) => t.startTime === time.startTime)?.parameter.parameterName}°C</p>
                                    <p>最低溫度: {MinT?.time.find((t) => t.startTime === time.startTime)?.parameter.parameterName}°C</p>
                                </>
                            )}
                            {selectedType === "天氣狀態" && (
                                <>
                                    <p>天氣狀態: {Wx?.time.find((t) => t.startTime === time.startTime)?.parameter.parameterName}</p>
                                    <p>舒適度: {CI?.time.find((t) => t.startTime === time.startTime)?.parameter.parameterName}</p>
                                </>
                            )}
                            {selectedType === "降雨機率" && (
                                <p>降雨機率: {PoP?.time.find((t) => t.startTime === time.startTime)?.parameter.parameterName}%</p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div>
            <h2>選擇地區</h2>
            <p>来源：<a href="https://www.cwa.gov.tw/V8/C/">中央氣象局</a></p>
            <div>
                <select id="citySelect" value={selectedCity} onChange={handleCityChange}>
                    <option value="">請選擇城市</option>
                    <option value="基隆市">基隆市</option>
                    <option value="新北市">新北市</option>
                    <option value="臺北市">臺北市</option>
                    <option value="桃園市">桃園市</option>
                    <option value="新竹縣">新竹縣</option>
                    <option value="苗栗縣">苗栗縣</option>
                    <option value="臺中市">臺中市</option>
                    <option value="南投縣">南投縣</option>
                    <option value="雲林縣">雲林縣</option>
                    <option value="嘉義縣">嘉義縣</option>
                    <option value="臺南市">臺南市</option>
                    <option value="高雄市">高雄市</option>
                    <option value="屏東縣">屏東縣</option>
                    <option value="宜蘭縣">宜蘭縣</option>
                    <option value="花蓮縣">花蓮縣</option>
                    <option value="臺東縣">臺東縣</option>
                    <option value="澎湖縣">澎湖縣</option>
                    <option value="金門縣">金門縣</option>
                    <option value="連江縣">連江縣</option>
                </select>
            </div>
            <button onClick={city_weather}>查看天氣</button>
            <div>
                <h2>天氣訊息</h2>
                <p>城市: {weatherInfo.location}</p>
                <select id="typeSelect" value={selectedType} onChange={handleTypeChange}>
                    <option value="">請選擇天氣類型</option>
                    <option value="溫度">溫度</option>
                    <option value="天氣狀態">天氣狀態</option>
                    <option value="降雨機率">降雨機率</option>
                </select>
                {renderForecast()}
            </div>
        </div>
    );
};

export default City;
