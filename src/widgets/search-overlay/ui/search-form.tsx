import { useMemo, useState } from "react";
import { Search, X, MapPin } from "lucide-react";
import { parseLocationString } from "@/widgets/search-overlay/model/type";
import koreaDistrictsData from "@/data/korea_districts.json";
import { useLocationModal } from "@/widgets/location-modal/model/locationContext";
import { useSearch } from "@/widgets/search-overlay/model/searchContext";

export default function SearchForm() {
  const { toggleSearch } = useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const { openModal } = useLocationModal();

  // JSON 데이터를 SelectedLocation 형식으로 변환
  const allLocations = useMemo(() => {
    return koreaDistrictsData.map((location: string, i: number) => {
      const parsed = parseLocationString(location, i);

      return {
        id: parsed.id,
        name: parsed.displayName,
        city: parsed.city,
      };
    });
  }, []);

  // 검색 필터링
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();

    return allLocations
      .filter((location) => {
        const name = location.name.toLowerCase();
        const city = location.city.toLowerCase();

        // 공백 제거 버전
        const nameWithoutSpaces = name.replace(/\s/g, "");
        const queryWithoutSpaces = query.replace(/\s/g, "");

        // 부분 토큰 매칭 ("종로" → "서울특별시 종로구")
        // location.name을 토큰으로 분리
        const tokens = name.split(/[\s-]/); // 공백이나 하이픈으로 분리

        return (
          name.includes(query) ||
          city.includes(query) ||
          nameWithoutSpaces.includes(queryWithoutSpaces) ||
          tokens.some((token) => token.includes(query))
        );
      })
      .slice(0, 20); // 최대 20개만 표시
  }, [searchQuery, allLocations]);

  return (
    <div className="fixed inset-0 bg-dark-overlay z-50 flex flex-col">
      {/* 검색 헤더 */}
      <div className="bg-dark-card border-b border-dark-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-dark-overlay rounded-lg px-4 py-4 flex-1">
            <Search size={20} className="text-grey shrink-0" />

            <input
              type="text"
              placeholder="위치를 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none placeholder-grey"
              autoFocus
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

          <button
            onClick={toggleSearch}
            className="text-white text-[1.6rem] hover:text-grey transition-colors cursor-pointer shrink-0"
          >
            취소
          </button>
        </div>
      </div>

      {/* 검색 결과 리스트 */}
      <div className="flex-1 overflow-y-auto">
        {filteredResults.length > 0 ? (
          filteredResults.map((result) => (
            <button
              key={result.id}
              onClick={() => openModal(result)}
              className="w-full px-6 py-5 text-left hover:bg-white/5 transition-colors border-b border-dark-border"
            >
              <div className="flex items-center gap-4">
                <MapPin size={20} className="text-grey shrink-0" />
                <div>
                  <div className="text-white font-medium text-lg mb-1">
                    {result.name}
                  </div>
                  {/* <div className="text-grey text-sm">{result.fullPath}</div> */}
                </div>
              </div>
            </button>
          ))
        ) : searchQuery ? (
          <div className="text-center text-grey mt-12 px-6">
            <p className="text-[1.5rem]">검색 결과가 없습니다</p>
            <p className="text-[1.3rem] mt-5 opacity-75">
              다른 검색어를 입력해보세요
            </p>
          </div>
        ) : (
          <div className="text-center text-grey mt-12 px-6">
            <p className="text-[1.5rem]">위치를 검색하세요</p>
            <p className="text-[1.3rem] mt-5 opacity-75">
              예: 서울, 부산, 제주도
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
