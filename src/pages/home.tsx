import Layout from "@/widgets/layout/ui";
import { useSearch } from "@/widgets/search-overlay/model/searchContext";
import { useNavigate } from "react-router-dom";
import { useWeather } from "@/features/weather/useWeather";

export default function Home() {
  const navigate = useNavigate();
  const { toggleSearch } = useSearch();
  const { weatherData, isLoading, error, refetch } = useWeather();

  // 렌더링할 컨텐츠 결정
  const renderContent = () => {
    if (isLoading) {
      return <p className="text-white text-2xl">날씨 정보를 불러오는 중...</p>;
    }

    if (error) {
      return (
        <div className="text-white text-center">
          <p className="text-2xl mb-4">😔</p>
          <p className="text-xl">
            {error instanceof Error
              ? error.message
              : "날씨 정보를 불러올 수 없습니다."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-6 px-6 py-3 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition"
          >
            다시 시도
          </button>
        </div>
      );
    }

    if (!weatherData) {
      return null;
    }

    // 정상 날씨 UI
    return (
      <>
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
            <span className="ml-4">최저:{weatherData.lowTemp}°</span>
          </div>
        </div>

        {/* 시간대별 날씨 카드 */}
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 text-white mx-auto w-[296px] mobile:w-[360px] tablet:w-[640px] desktop:w-[800px] flex flex-col gap-4">
          <p className="text-[1.4rem] opacity-90">시간별 일기예보</p>

          {/* 시간대별 온도 */}
          <div className="overflow-x-auto scrollbar-hide px-2 border-t-[0.5px] border-white/30 pt-6">
            <div className="flex mobile:gap-6 tablet:gap-8 desktop:gap-10 pb-2">
              {weatherData?.hourlyForecast?.map((hour, idx) => (
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
      </>
    );
  };

  return (
    <Layout
      background="bg-sunny"
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
      {renderContent()}
    </Layout>
  );
}
