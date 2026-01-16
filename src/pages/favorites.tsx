import Layout from "@/widgets/layout/ui";
import { useSearch } from "@/widgets/search-overlay/model/searchContext";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FavoriteWithWeather } from "@/features/favorites/model/types";
import { fetchWeatherData } from "@/shared/api/weather";
import { useFavoritesStore } from "@/features/favorites/model/useFavoritesStore";

export default function Favorites() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleSearch } = useSearch();
  const [favoritesWithWeather, setFavoritesWithWeather] = useState<
    FavoriteWithWeather[]
  >([]);
  const { favorites, removeFavorite } = useFavoritesStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavoritesWithWeather = async () => {
      setIsLoading(true);

      // 각 즐겨찾기 위치의 날씨 가져오기
      const weatherPromises = favorites.map(async (favorite) => {
        try {
          const weather = await fetchWeatherData({
            latitude: favorite.lat,
            longitude: favorite.lng,
          });
          return {
            ...favorite,
            currentTemp: weather.currentTemp,
            highTemp: weather.highTemp,
            lowTemp: weather.lowTemp,
            condition: weather.condition,
            hourlyForecast: weather.hourlyForecast,
            isLoading: false,
          };
        } catch (error) {
          console.error(`날씨 로드 실패 (${favorite.name}):`, error);
          return {
            ...favorite,
            isLoading: false,
          };
        }
      });

      const results = await Promise.all(weatherPromises);
      setFavoritesWithWeather(results);
      setIsLoading(false);
    };

    loadFavoritesWithWeather();
  }, [favorites]);

  return (
    <Layout
      background="bg-black"
      leftSlot={
        <button className="cursor-pointer" onClick={() => navigate(-1)}>
          <img src="/back.svg" alt="뒤로가기" />
        </button>
      }
      middleSlot={
        <h2 className="mobile:text-[2rem] tablet:text-[2.4rem] desktop:text-[2.8rem] font-semibold text-white">
          즐겨찾기
        </h2>
      }
      mainCN="pt-[4rem]"
    >
      <div className="flex items-center gap-3 bg-dark-overlay rounded-3xl px-4 py-4 flex-1 mb-10">
        <Search size={20} className="text-grey shrink-0" />

        <input
          type="text"
          placeholder="위치를 검색하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-white outline-none placeholder-grey"
          onClick={() => toggleSearch()}
        />

        <button
          onClick={() => setSearchQuery("")}
          className={
            searchQuery ? "opacity-100 visible" : "opacity-0 invisible"
          }
          disabled={!searchQuery}
          aria-label="입력 지우기"
        >
          <X size={18} className="text-grey" />
        </button>
      </div>
      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6 auto-rows-fr">
        {isLoading
          ? // 스켈레톤 카드
            favorites.map((fav) => (
              <div
                key={fav.id}
                className="relative bg-dark-card/90 rounded-3xl p-6 tablet:p-[2.2rem] desktop:p-[2.4rem] animate-pulse"
              >
                <div className="pr-10">
                  <div className="h-8 bg-grey/20 rounded-lg mb-4 w-3/4" />
                  <div className="h-10 bg-grey/20 rounded-lg mb-3 w-1/2" />
                  <div className="h-6 bg-grey/20 rounded-lg w-2/3" />
                </div>
              </div>
            ))
          : // 실제 카드
            favoritesWithWeather.map((favorite) => (
              <div
                key={favorite.id}
                className="relative bg-dark-card/90 rounded-3xl p-6 tablet:p-[2.2rem] desktop:p-[2.4rem] text-white hover:bg-dark-card transition-colors cursor-pointer"
                onClick={() => navigate("/detail", { state: { favorite } })}
              >
                {/* 삭제 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(favorite.id);
                  }}
                  className="absolute top-4 right-4 p-3 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="삭제"
                >
                  <img src="/bin.svg" alt="삭제" className="w-8" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-4 right-18 p-3 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="수정"
                >
                  <img src="/pencil.svg" alt="수정" className="w-8" />
                </button>

                {/* 카드 내용 */}
                <div className="pr-10">
                  <h3 className="text-[2rem] tablet:text-[2.4rem] desktop:text-[2.6rem] font-medium mb-4">
                    {
                      favorite.name.split(" ")[
                        favorite.name.split(" ").length - 1
                      ]
                    }
                  </h3>
                  <div className="text-[2.2rem] tablet:text-[2.4rem] desktop:text-[3rem] font-light mb-3">
                    {favorite.currentTemp}°
                  </div>
                  <div className="text-[1.2rem] tablet:text-[1.4rem] desktop:text-[1.8rem] text-grey">
                    최고: {favorite.highTemp}° 최저: {favorite.lowTemp}°
                  </div>
                </div>
              </div>
            ))}
      </div>
    </Layout>
  );
}
