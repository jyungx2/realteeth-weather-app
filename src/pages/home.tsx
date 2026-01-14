import Layout from "@/widgets/layout/ui";
import { useSearch } from "@/widgets/search-overlay/model/searchContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { toggleSearch } = useSearch();

  // 임시 날씨 데이터
  const weatherData = {
    location: "부산광역시",
    currentTemp: 7,
    condition: "맑음",
    highTemp: 7,
    lowTemp: -1,
    hourlyForecast: [
      { time: "5시", temp: 6, icon: "☀️" },
      { time: "6시", temp: 6, icon: "☀️" },
      { time: "7시", temp: 6, icon: "☀️" },
      { time: "8시", temp: 6, icon: "☀️" },
      { time: "9시", temp: 6, icon: "☀️" },
      { time: "10시", temp: 5, icon: "☀️" },
      { time: "11시", temp: 3, icon: "☀️" },
      { time: "12시", temp: 2, icon: "☀️" },
      { time: "13시", temp: 1, icon: "☀️" },
      { time: "14시", temp: 0, icon: "☀️" },
      { time: "15시", temp: 7, icon: "☀️" },
      { time: "16시", temp: 6, icon: "☀️" },
      { time: "17시", temp: 5, icon: "☀️" },
      { time: "18시", temp: 3, icon: "☀️" },
      { time: "19시", temp: 2, icon: "☀️" },
      { time: "20시", temp: 1, icon: "☀️" },
      { time: "21시", temp: 0, icon: "☀️" },
      { time: "22시", temp: 0, icon: "☀️" },
      { time: "23시", temp: 0, icon: "☀️" },
      { time: "24시", temp: 0, icon: "☀️" },
    ],
  };

  return (
    <Layout
      background="bg-sunny"
      leftSlot={
        <button className="cursor-pointer">
          <img src="/menu.svg" alt="메뉴" />
        </button>
      }
      rightSlot={
        <div className="right-section flex gap-14">
          <button className="cursor-pointer" onClick={() => toggleSearch()}>
            <img src="/search.svg" alt="검색" />
          </button>
          <button
            className="cursor-pointer"
            onClick={() => navigate("/favorites")}
          >
            <img src="/star.svg" alt="즐겨찾기" />
          </button>
        </div>
      }
      mainCN="pt-[6rem] items-center gap-[2rem]"
    >
      {/* 현재 날씨 */}
      <div className="flex flex-col gap-8 text-center text-white mb-12">
        <h1 className="text-[1.4rem] mobile:text-[2rem] tablet:text-[3rem] desktop:text-[4rem] font-light mb-4 opacity-90">
          {weatherData.location}
        </h1>
        <div className="text-8xl font-extralight mb-6">
          {weatherData.currentTemp}°
        </div>
        <p className="mb-3 opacity-90">{weatherData.condition}</p>
        <div className="opacity-75">
          <span>최고:{weatherData.highTemp}°</span>
          <span>최저:{weatherData.lowTemp}°</span>
        </div>
      </div>

      {/* 시간대별 날씨 카드 */}
      <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 text-white mx-auto w-[296px] mobile:w-[360px] tablet:w-[640px] desktop:w-[800px] flex flex-col gap-4">
        <p className="text-[1.4rem] mb-6 opacity-90">
          낮은 체감 온도입니다. 따뜻한 옷을 챙겨 입으세요.
        </p>

        {/* 시간대별 온도 */}
        <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
          <div className="flex mobile:gap-6 tablet:gap-8 desktop:gap-10 pb-2">
            {weatherData.hourlyForecast.map((hour, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-3 min-w-[4.8rem]"
              >
                <span className="text-sm opacity-80">{hour.time}</span>
                <div className="text-4xl">{hour.icon}</div>
                <span className="text-xl font-medium">{hour.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
