import Layout from "@/widgets/layout/ui";
import { useSearch } from "@/widgets/search-overlay/model/searchContext";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAll } from "@/features/favorites/api";
import type { FavoriteWithWeather } from "@/features/favorites/model/types";
import { fetchWeatherData } from "@/shared/api/weather";

export default function Favorites() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleSearch } = useSearch();
  const [favoritesWithWeather, setFavoritesWithWeather] = useState<
    FavoriteWithWeather[]
  >([]);

  useEffect(() => {
    const loadFavoritesWithWeather = async () => {
      const favoritesList = getAll();

      // 초기 데이터 (로딩 상태)
      const initialData: FavoriteWithWeather[] = favoritesList.map((fav) => ({
        ...fav,
        isLoading: true,
      }));
      setFavoritesWithWeather(initialData);

      // 각 즐겨찾기 위치의 날씨 가져오기
      const weatherPromises = favoritesList.map(async (favorite) => {
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
    };

    loadFavoritesWithWeather();
  }, []);

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
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6 auto-rows-fr ">
        {/* 날씨 카드들 */}
        {favoritesWithWeather.map((favorite) => (
          <div
            key={favorite.id}
            className="relative bg-dark-card/90 rounded-3xl p-6 tablet:p-[2.2rem] desktop:p-[2.4rem] text-white hover:bg-dark-card transition-colors "
            onClick={() => navigate("/detail", { state: { id: favorite.id } })}
          >
            {/* 삭제 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // handleRemove(favorite.id);
              }}
              className="absolute top-4 right-4 p-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="삭제"
            >
              <img src="/bin.svg" alt="삭제" className="w-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="absolute top-4 right-18 p-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="수정"
            >
              <img src="/pencil.svg" alt="수정" className="w-8" />
            </button>

            {/* 카드 내용 */}
            <div className="pr-10">
              <h3 className="text-[2rem] tablet:text-[2.4rem] desktop:text-[2.6rem] font-medium mb-4">
                {favorite.name.split(" ")[favorite.name.split(" ").length - 1]}
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
