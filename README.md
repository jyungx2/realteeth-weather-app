## 1. 프로젝트 실행 방법
### 📱 배포 사이트에서 실행
배포된 사이트에 바로 접속하여 사용할 수 있습니다.  
🔗 **배포 URL**: [realteeth-weather-app](https://realteeth-weather-app.vercel.app/)

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
- 홈페이지(‘/‘)
  - 검색 기능: 원하는 지역에 대한 날씨 정보 조회 가능 -> 즐겨찾기 추가 가능
  - 즐겨찾기 추가 시, 즐겨찾기 페이지로 이동
  - 이미 즐겨찾기에 추가된 지역의 경우, ‘추가’ 버튼 대신 ‘제거’ 버튼 표시

- 즐겨찾기 페이지(‘/favorites’)
  - 홈페이지와 동일하게 검색 기능 사용 가능
  - 연필 버튼을 통해 장소(지역) 이름 수정 가능
  - 휴지통 버튼을 통해 삭제 가능
  - 즐겨찾기 카드 클릭 시, 상세 페이지로 이동

- 상세 페이지(‘/detail’)
  - 홈페이지와 동일한 UI로 날씨 정보 조회 가능
