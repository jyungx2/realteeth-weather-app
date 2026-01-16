import type { HourlyForecast } from "@/shared/model/weather";
import Layout from "@/widgets/layout/ui";
import { useLocation, useNavigate } from "react-router-dom";

export default function Detail() {
  const navigate = useNavigate();
  const location = useLocation();
  const favorite = location.state?.favorite;

  return (
    <Layout
      background="bg-sunny"
      rightSlot={
        <button className="cursor-pointer" onClick={() => navigate(-1)}>
          <span className="text-white font-medium text-[1.8rem]">취소</span>
        </button>
      }
      mainCN="pt-[6rem] items-center gap-[2rem]"
    >
      {/* 현재 날씨 */}
      <div className="flex flex-col gap-8 text-center text-white mb-12">
        <h1 className="text-[1.4rem] mobile:text-[2rem] tablet:text-[3rem] desktop:text-[4rem] font-light mb-4 opacity-90">
          {favorite.name}
        </h1>
        <div className="text-8xl font-extralight mb-6">
          {favorite.currentTemp}°
        </div>
        <p className="mb-3 opacity-90">{favorite.condition}</p>
        <div className="opacity-75">
          <span>최고:{favorite.highTemp}°</span>
          <span>최저:{favorite.lowTemp}°</span>
        </div>
      </div>

      {/* 시간대별 날씨 카드 */}
      <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 text-white mx-auto mobile:w-[310px] tablet:w-[640px] desktop:w-[800px] flex flex-col gap-4">
        <p className="text-[1.4rem] mb-6 opacity-90">
          낮은 체감 온도입니다. 따뜻한 옷을 챙겨 입으세요.
        </p>

        {/* 시간대별 온도 */}
        <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
          <div className="flex mobile:gap-6 tablet:gap-8 desktop:gap-10 pb-2">
            {favorite.hourlyForecast.map(
              (hour: HourlyForecast, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-3 min-w-[4.8rem]"
                >
                  <span className="text-sm opacity-80">{hour.time}</span>
                  <div className="text-4xl">{hour.icon}</div>
                  <span className="text-xl font-medium">{hour.temp}°</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
