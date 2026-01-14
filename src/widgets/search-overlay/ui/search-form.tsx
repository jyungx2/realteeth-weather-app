import { useState } from "react";
import { Search, X, MapPin } from "lucide-react";

interface SearchResult {
  id: string;
  name: string;
  region: string;
}

interface SearchFormProps {
  onClose: () => void;
  onSelectLocation?: (location: SearchResult) => void;
}

export default function SearchForm({
  onClose,
  onSelectLocation,
}: SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // 검색 결과 더미데이터
  const allResults: SearchResult[] = [
    { id: "1", name: "서울특별시", region: "서울" },
    { id: "2", name: "서울특별시 성동구", region: "서울" },
    { id: "3", name: "서구", region: "대전광역시" },
    { id: "4", name: "서구", region: "부산광역시" },
    { id: "5", name: "서구", region: "인천광역시" },
  ];

  // 검색 필터링
  const filteredResults = searchQuery
    ? allResults.filter(
        (result) =>
          result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelect = (location: SearchResult) => {
    if (onSelectLocation) {
      onSelectLocation(location);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-overlay z-50 flex flex-col">
      {/* 검색 헤더 */}
      <div className="bg-dark-card border-b border-dark-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-dark-overlay rounded-lg px-4 py-4 flex-1">
            <Search size={20} className="text-grey flex-shrink-0" />

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
            onClick={handleClose}
            className="text-white text-[1.6rem] hover:text-grey transition-colors cursor-pointer"
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
              onClick={() => handleSelect(result)}
              className="w-full px-6 py-5 text-left hover:bg-white/5 transition-colors border-b border-dark-border"
            >
              <div className="flex items-center gap-4">
                <MapPin size={20} className="text-grey flex-shrink-0" />
                <div>
                  <div className="text-white font-medium text-lg mb-1">
                    {result.name}
                  </div>
                  <div className="text-grey text-sm">{result.region}</div>
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
