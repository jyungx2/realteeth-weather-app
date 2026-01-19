import Layout from "@/widgets/layout/ui";
import { useSearch } from "@/widgets/search-overlay/model/searchContext";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "@/features/favorites/model/useFavoritesStore";
import { useFavoritesWeather } from "@/features/weather/useFavoritesWeather";

export default function Favorites() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleSearch } = useSearch();
  const { favorites, removeFavorite, updateFavoriteName } = useFavoritesStore();

  // 편집 상태 관리
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const { favoritesWithWeather, isLoading } = useFavoritesWeather(favorites);

  // 편집 모드 시작
  const handleStartEdit = (id: number, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  // 편집 저장
  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      updateFavoriteName(editingId, editingName.trim());
      setEditingId(null);
      setEditingName("");
    }
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

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
      mainCN="w-full pt-[4rem] overflow-x-hidden"
    >
      <div className="flex items-center gap-3 bg-dark-overlay rounded-3xl px-4 py-4 mb-10">
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
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6 auto-rows-fr mb-10">
        {isLoading
          ? // 스켈레톤 카드 (날씨정보 준비되기 전)
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
          : // 실제 카드 (실시간 날씨 api 연동 후)
            favoritesWithWeather.map((favorite) => (
              <div
                key={favorite.id}
                className={`mb-2 relative bg-dark-card/90 rounded-3xl p-6 tablet:p-[2.2rem] desktop:p-[2.4rem] text-white hover:bg-dark-card transition-colors min-w-[280px] ${
                  editingId === favorite.id
                    ? "cursor-default"
                    : "cursor-pointer"
                }`}
                onClick={
                  editingId === favorite.id
                    ? undefined
                    : () => navigate("/detail", { state: { favorite } })
                }
              >
                {/* 제목 영역 - Flexbox로 버튼과 함께 배치 */}
                <div className="flex items-center justify-between gap-2 mb-4 min-w-0">
                  {editingId === favorite.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveEdit();
                        } else if (e.key === "Escape") {
                          handleCancelEdit();
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-[60%] min-w-0 bg-dark-overlay text-white text-[1.6rem] tablet:text-[2.4rem] desktop:text-[2.6rem] font-medium px-2 py-1.5 tablet:px-3 tablet:py-2 rounded-lg outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                    />
                  ) : (
                    <h3 className="flex-1 min-w-0 text-[2rem] tablet:text-[2.4rem] desktop:text-[2.6rem] font-medium break-words">
                      {
                        favorite.name.split(" ")[
                          favorite.name.split(" ").length - 1
                        ]
                      }
                    </h3>
                  )}

                  {/* 버튼 그룹 */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (editingId === favorite.id) {
                          handleSaveEdit();
                        } else {
                          handleStartEdit(
                            favorite.id,
                            favorite.name.split(" ")[
                              favorite.name.split(" ").length - 1
                            ],
                          );
                        }
                      }}
                      className="p-1.5 tablet:p-2 hover:bg-white/10 rounded-full transition-colors"
                      aria-label="수정"
                    >
                      <img
                        src={
                          editingId === favorite.id
                            ? "/check.svg"
                            : "/pencil.svg"
                        }
                        alt={editingId === favorite.id ? "저장" : "수정"}
                        className="w-10 tablet:w-9 desktop:w-10"
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("즐겨찾기에서 삭제되었습니다.");
                        removeFavorite(favorite.id);
                      }}
                      className="p-1.5 tablet:p-2 hover:bg-white/10 rounded-full transition-colors"
                      aria-label="삭제"
                    >
                      <img
                        src="/bin.svg"
                        alt="삭제"
                        className="w-10 tablet:w-9 desktop:w-10"
                      />
                    </button>
                  </div>
                </div>

                {/* 온도 정보 */}
                <div className="text-[2.2rem] tablet:text-[2.4rem] desktop:text-[3rem] font-light mb-3">
                  {favorite.currentTemp}°
                </div>
                <div className="text-[1.2rem] tablet:text-[1.4rem] desktop:text-[1.8rem] text-grey">
                  최고: {favorite.highTemp}° 최저: {favorite.lowTemp}°
                </div>
              </div>
            ))}
      </div>
    </Layout>
  );
}
