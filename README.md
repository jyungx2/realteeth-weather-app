## 1. 프로젝트 실행 방법
### 📱 배포 사이트에서 실행
배포된 사이트에 바로 접속하여 사용할 수 있습니다.  

🔗 **배포 URL**: https://realteeth-weather-app.vercel.app/

---
### 💻 로컬 개발 환경에서 실행
#### 1️⃣ 프로젝트 클론
```bash
git clone https://github.com/jyungx2/realteeth-weather-app.git
cd realteeth-weather-app
```

#### 2️⃣ 의존성 설치
```bash
npm install
```

#### 3️⃣ 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 API 키를 입력합니다.
```env
VITE_OPENWEATHER_API_KEY=e1ade1ba235a675264230dde3fc9c759
```

#### 4️⃣ 개발 서버 실행
```bash
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173`으로 접속합니다.

#### 5️⃣ 프로덕션 빌드 및 미리보기
```bash
npm run build
npm run preview
```

---

## 2. 구현한 기능에 대한 설명
### 🔹 페이지 (/pages)
**[1] 홈페이지(‘/‘)**
  - 검색 기능: 원하는 지역에 대한 날씨 정보 조회 가능 -> 즐겨찾기 추가 가능
  - 즐겨찾기 추가 시, 즐겨찾기 페이지로 이동
  - 이미 즐겨찾기에 추가된 지역의 경우, ‘추가’ 버튼 대신 ‘제거’ 버튼 표시
 
 #### 🧩 구현 로직
  * 파일 경로: src/features/weather/useCurrentWeather.tsx
   1) 브라우저 내장 API (navigator.geolocation.getCurrentPosition)을 통해 현재 위치에 대한 좌표를 받아옴
      - 📁 src/shared/api/getCurrentPosition.ts
   3) 좌표를 기반으로 openWeatherMap API을 이용해 현재 날씨 정보, 시간대별(3시간 간격) 날씨 정보, 좌표를 지역으로 변환하는 역지오코딩 API를 이용해 반환
      - 📁 src/shared/api/fetchWeather.ts

---

**[2] 즐겨찾기 페이지(/favorites)**
  - 홈페이지와 동일하게 검색 기능 사용 가능
  - 연필 버튼을 통해 장소(지역) 이름 수정 가능
  - 휴지통 버튼을 통해 삭제 가능
  - 즐겨찾기 카드 클릭 시, 상세 페이지로 이동

#### 🧩 구현 로직
  * 파일 경로: src/features/weather/useCurrentWeather.tsx
  1) 즐겨찾기 상태는 location-modal 컴포넌트와 favorites 페이지에서 사용되므로 Zustand 전역 상태 라이브러리를 이용해 관리했습니다.
  2) 즐겨찾기 상태값은 위치 정보(id/name/city/lat/lng)만 포함한 객체 데이터로, 날씨 데이터는 실시간으로 받아와 반영해야 하기 때문에 즐겨찾기 상태에 포함하지 않고, useQuery로 데이터를 요청하는 훅을 만들어 임포트하여 사용했습니다.
     - 📁 src/features/weather/useFavoritesWeather.ts

---

**[3] 상세 페이지(/detail)**
  - 즐겨찾기 페이지에서 navigate의 state 속성으로 날씨 데이터를 포함한 즐겨찾기 상태를 보낸 후, useLocation으로 값을 추출해 렌더링
  - 홈페이지와 동일한 UI로 날씨 정보 조회 가능

---

### 🔹 컴포넌트 (/widgets)
- 전체 페이지 레이아웃 덮는 UI
- 홈/즐겨찾기 페이지에서 접근 가능
-> 아래 두 개의 컴포넌트는 여러 페이지 컴포넌트에서 접근/사용되어야 하고, 전체 레이아웃을 덮는 전역 컴포넌트이기 떄문에 Context API로 UI 토글 상태를 관리하였습니다. 
  
**[1] 검색 오버레이(search-overlay)**
 - 제공받은 대한민국 행정구역 json 파일을 data 폴더에 저장하고, 컴포넌트 외부에서 모듈 로드 시 한 번만 파싱하여 전역 상수로 관리하며, 사용자의 검색어와 매칭되는 값들을 useMemo로 필터링하여 렌더링
   

**[2] 위치 모달(location-modal)**
  - 유저가 선택한 위치에 대한 실시간 날씨 정보를 렌더링
    - 선택 위치에 대한 좌표 정보(위도/경도)를 useQuery로 조회
      - 📁 /src/features/geocoding/useGeocodeLocation.ts
    - 받아온 좌표를 기반으로 날씨 정보를 useQuery로 조회
      - 📁 /src/features/weather/useWeatherByCoords.ts
   
---

### 📂 디렉토리 구조 (Feature-Sliced Design 아키텍처)
```
src/
├── app/
│   ├── layers/
│   │   ├── LocationLayer.tsx
│   │   └── SearchLayer.tsx
│   ├── layouts/
│   │   └── RootLayout.tsx
│   ├── providers/
│   │   ├── index.tsx
│   │   ├── LocationProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── SearchProvider.tsx
│   ├── router/
│   │   └── routes.tsx
│   ├── styles/
│   │   └── global.css
│   └── App.tsx
│
├── data/
│   └── korea_districts.json
│
├── features/
│   ├── favorites/
│   │   ├── types.ts
│   │   └── useFavoritesStore.ts
│   ├── geocoding/
│   │   └── useGeocodeLocation.ts
│   └── weather/
│       ├── useCurrentWeather.ts
│       ├── useFavoritesWeather.ts
│       └── useWeatherByCoords.ts
│
├── pages/
│   ├── detail.tsx
│   ├── favorites.tsx
│   ├── home.tsx
│   └── not-found.tsx
│
├── shared/
│   ├── api/
│   │   ├── fetchWeather.ts
│   │   ├── getCurrentPosition.ts
│   │   └── nominatim-geocoding.ts
│   ├── model/
│   │   ├── header.ts
│   │   ├── location.ts
│   │   └── weather.ts
│   └── ui/
│       └── header.tsx
│
└── widgets/
    ├── layout/
    │   ├── model/
    │   │   └── index.ts
    │   └── ui/
    │       └── index.tsx
    ├── location-modal/
    │   ├── model/
    │   │   ├── locationContext.ts
    │   │   └── types.ts
    │   └── ui/
    │       ├── index.tsx
    │       └── location-modal.tsx
    └── search-overlay/
        ├── model/
        │   ├── searchContext.ts
        │   └── type.ts
        └── ui/
            └── index.tsx
```



## 3. 기술적 의사결정 및 이유
- Nominatim Geocoding API 사용
초기에는 Kakao Local API의 Geocoding을 사용하여 주소를 좌표로 변환했습니다. 하지만 Kakao 지도 API는 추가 기능 심사 절차가 필요하며, 승인까지 약 일주일이 소요되어 프로젝트 일정상 대안이 필요했습니다.
OpenWeather API에도 Geocoding 기능이 있지만, 광역시/도 단위까지만 구분하여 구/동이 달라도 동일한 좌표를 반환하는 문제가 있었습니다.
```ts
1. OpenWeather: 구/동이 달라도 모두 같은 "서울" 좌표 반환 ❌
 - "서울특별시 종로구 청와대로 1" → OpenWeather: 서울 (37.5665, 126.9780)
 - "서울특별시 강남구 테헤란로 152" → OpenWeather: 서울 (37.5665, 126.9780)


2. Kakao Local API: 상세 주소까지 정확한 좌표 제공 ✅
 - "서울특별시 종로구 청와대로 1" → (37.5867, 126.9748)
 - "서울특별시 강남구 테헤란로 152" → (37.5048, 127.0493)
```
따라서 구/동 단위까지 정확한 좌표를 제공하는 Nominatim Geocoding API를 사용하여 주소를 좌표로 변환하도록 구현했습니다.

---

- Context API를 활용한 전역 UI 상태 관리  
: 검색 오버레이(search-overlay)와 위치 모달(location-modal) 같은 전역 UI 컴포넌트의 열림/닫힘 상태를 전역 상태 라이브러리(Zustand/Redux) 대신 Context API로 구현했습니다.
UI 토글 상태는 별도의 비즈니스 로직이 필요 없고 LocalStorage에 저장할 필요도 없는 단순한 boolean 값이기 때문에, 가벼운 Context API가 적합하다고 판단했습니다.
    
## 선택 이유
### 1. 스타일링 관리 최소화
> **🖍️ 문제 상황**
전역 오버레이/모달을 각 페이지 컴포넌트 내부에서 렌더링하면:
* z-index 값 관리가 복잡해짐
* 페이지별로 다른 stacking context에 갇힐 위험 O

> **📝 해결 방법**
RootLayout에서 DOM 순서로 레이어를 관리하면: 
```ts
import { Outlet } from "react-router-dom";
import { SearchLayer } from "@/app/layers/SearchLayer";
import { LocationLayer } from "@/app/layers/LocationLayer";

export default function RootLayout() {
  return (
    <>
      <Outlet /> {/* 페이지 컨텐츠 (1층) */}
      <SearchLayer /> {/* 검색 오버레이 (2층) */}
      <LocationLayer /> {/* 위치 모달 (3층) */}
    </>
  );
}
```
**DOM 렌더링 순서 = 화면 쌓임 순서**
* 나중에 렌더링된 요소가 자연스럽게 위에 표시
* z-index 없이도 직관적이고 올바른 레이어 순서 보장
* 페이지 CSS와 완전히 독립적

⠀
### 2. Zustand가 아닌 Context를 선택한 이유
> **Zustand vs Context 선택 기준**

**Context가 적합한 경우 (검색/위치 모달):**
- 단순 UI 토글 (boolean 상태 + 열기/닫기 함수)
- 일시적 상태 (새로고침 시 초기화 OK)
- 사용 범위 제한 필요 (특정 레이아웃 내부만)

**Zustand가 적합한 경우 (즐겨찾기):**
- 복잡한 상태 관리 (배열 + CRUD 로직)
- 영속적 상태 (localStorage 동기화 필요)
- 앱 전체에서 접근 필요

따라서 해당 프로젝트에서는 다음과 같이 판단하여 적용했습니다.
- **모달/오버레이**: boolean 상태 1개 + 토글 함수만 필요 → Context로 충분 
- **즐겨찾기 관리**: 배열 상태 + CRUD 로직 + 로컬 스토리지 동기화 → Zustand 활용

---

> **✏️ 검색 오버레이(SearchForm)와 위치 모달(LocationModal)의 특성:**
- ****단순한 UI 토글 상태**** (open/close, selected item) 
  - 복잡한 비즈니스 로직이나 파생 상태 계산 없음 
  - 상태 업데이트 로직이 단순함 (토글, 선택) 

- ****일시적인 UI 상태**** 
  - 페이지 새로고침 시 초기화되어도 무방
  - localStorage 같은 영속화 불필요 
  - 앱의 핵심 비즈니스 데이터가 아닌 UI 표시 제어용

- **UI 상태의 명확한 사용 범위 제한 가능**
  - Provider로 컴포넌트 트리 구조상 사용 가능한 범위를 명시할 수 있어 직관적으로 코드를 파악할 수 있음
    - 위치 모달은 검색창에서 지역을 검색한 후 선택할 때만 사용되므로, 검색 기능이 활성화된 상태에서만 위치 선택이 의미 있음
    - 이러한 의존 관계를 Provider 중첩으로 명확히 표현 (SearchProvider 내부에 LocationProvider 위치)
  - 현재는 단일 레이아웃이지만, 추후 여러 레이아웃/권한별 페이지 추가 시 각 영역에서 사용 가능한 UI를 명확히 분리 가능
  - Provider 바깥에서 사용 시 에러로 감지되어 의도치 않은 사용 방지
 

```ts
import type { ReactNode } from "react";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { SearchProvider } from "@/app/providers/SearchProvider";
import { LocationProvider } from "@/app/providers/LocationProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <SearchProvider> {/* 👈 이 안에서만 사용 가능 */}
        <LocationProvider> {/* 👈 이 안에서만 사용 가능 */}
           {children} {/* => RouterProvider 렌더링 */}
        </LocationProvider>
      </SearchProvider>
    </QueryProvider>
  );
}
```


## 코드 예시
### 1. RootLayout: 레이어 진입점
**핵심:**
* RootLayout은 컨텍스트를 구독하지 않음 → 상태 변경 시 리렌더링 안 됨
* DOM 순서로 레이어 쌓임 제어
* 각 Layer는 독립적으로 조건부 렌더링

```ts
// app/layouts/RootLayout.tsx
import { Outlet } from "react-router-dom";
import { SearchLayer } from "@/app/layers/SearchLayer";
import { LocationLayer } from "@/app/layers/LocationLayer";

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <SearchLayer />
      <LocationLayer />
    </>
  );
}
```
⠀

### 2. Layer: 독립적 렌더링 제어
**핵심:**
* Layer 컴포넌트가 컨텍스트를 구독
* 해당 Layer만 독립적으로 리렌더링
* RootLayout과 다른 페이지는 영향받지 않음
```ts
// app/layers/SearchLayer.tsx
import SearchForm from "@/widgets/search-overlay/ui/search-form";
import { useSearch } from "@/widgets/search-overlay/model/searchContext";

export function SearchLayer() {
  const { isSearchOpen } = useSearch();
  if (!isSearchOpen) return null;
  return <SearchForm />;
}
```

⠀
### 3. Context Provider: 상태 관리
**핵심:**
* useCallback: 함수 참조 고정
* useMemo: value 객체 메모이제이션
* 불필요한 Context 업데이트 방지
```ts
// widgets/search-overlay/model/SearchProvider.tsx
import { SearchContext } from "@/widgets/search-overlay/model/searchContext";
import { useState, useMemo, useCallback, type ReactNode } from "react";

type SearchProviderProps = {
  children: ReactNode;
};

export function SearchProvider({ children }: SearchProviderProps) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const value = useMemo(
    () => ({
      isSearchOpen: open,
      toggleSearch: toggle,
    }),
    [open, toggle]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
```


### 4. Context 정의
**핵심:**
* 타입 안전성 보장
* Provider 밖에서 사용 시 명확한 에러

```ts
// widgets/search-overlay/model/searchContext.tsx
import { createContext, useContext } from "react";

type SearchContextType = {
  isSearchOpen: boolean;
  toggleSearch: () => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within <SearchProvider>");
  }
  return context;
}
```

⠀

## 성능 최적화
### 1. Layer 패턴으로 리렌더링 격리
**❌ 문제 상황:**
1. 즐겨찾기 페이지에서 toggleSearch() 호출
2. isSearchOpen 변경
3. 해당 컨텍스트를 구독하는 RootLayout 리렌더링
4. <Outlet /> 에 들어가는 모든 하위 페이지 리렌더링 -> 불필요한 리렌더링 발생!
```ts
export default function RootLayout() {
  const { isSearchOpen } = useSearch();    // 👈 구독
  const { isModalOpen } = useLocationModal(); // 👈 구독
  
  return (
    <>
      <Outlet />
      {isSearchOpen && <SearchForm />}
      {isModalOpen && <LocationModal />}
    </>
  );
}
```

**✅ 최적화 후 (Layer가 독립적으로 구독):**
1. toggleSearch() 호출
2. isSearchOpen 변경
3. SearchLayer만 리렌더링✨
4. RootLayout과 Outlet은 영향 X -> 
```ts
export default function RootLayout() {
  // 컨텍스트 구독하지 않음 ✅
  return (
    <>
      <Outlet />
      <SearchLayer />
      <LocationLayer />
    </>
  );
}

export function SearchLayer() {
  const { isSearchOpen } = useSearch(); // 👈 여기서만 구독
  if (!isSearchOpen) return null;
  return <SearchForm />;
}
```

### 2. useMemo & useCallback으로 불필요한 업데이트 방지
Context Provider의 value는 객체 참조로 비교되므로, 
Provider가 리렌더링될 때 새로운 참조값이 생성되어 해당 컨텍스트를 구독한 모든 컴포넌트들이 함께 리렌더링됩니다. 
```ts
// app/providers/SearchProvider.tsx
  const toggle = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const value = useMemo(
    () => ({
      isSearchOpen: open,
      toggleSearch: toggle,
    }),
    [open, toggle]
  );
```

현재는 Provider 부모(AppProviders)에 컨텍스트와 무관한 상태가 없어 리렌더링될 상황이 없지만, 향후 기능 확장 시 (예: 전역 테마, 사용자 설정 등의 상태 추가) 각 Provider가 독립적으로 동작하도록 미리 메모이제이션을 적용했습니다.
```ts
import type { ReactNode } from "react";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { SearchProvider } from "@/app/providers/SearchProvider";
import { LocationProvider } from "@/app/providers/LocationProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <SearchProvider>
        <LocationProvider>{children}</LocationProvider>
      </SearchProvider>
    </QueryProvider>
  );
}
```

## 4. 사용한 기술 스택
HTML5, CSS3, TailwindCSS, TypeScript, React, Zustand, Tanstack Query

