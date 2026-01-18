import Layout from "@/widgets/layout/ui";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Layout
      background="bg-gradient-to-b from-blue-400 to-blue-600"
      mainCN="items-center justify-center text-center text-white"
    >
      {/* 에러 메시지 */}
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-[6rem] mobile:text-[8rem] tablet:text-[10rem] font-bold">
          404
        </h1>
        <p className="text-[1.8rem] mobile:text-[2.2rem] tablet:text-[2.6rem] font-medium opacity-90">
          페이지를 찾을 수 없습니다 😢
        </p>
        <p className="text-[1.4rem] mobile:text-[1.6rem] tablet:text-[1.8rem] opacity-75 mt-2">
          요청하신 페이지가 사라졌거나 주소가 변경되었을 수 있습니다
        </p>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex flex-col mobile:flex-row gap-4 mt-20">
        <button
          onClick={() => navigate(-1)}
          className="px-12 py-6 bg-white/20 backdrop-blur-md rounded-2xl text-white text-[1.6rem] font-medium hover:bg-white/30 transition-all hover:scale-105 cursor-pointer"
        >
          이전 페이지로 가기
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-12 py-6 bg-white text-blue-600 rounded-2xl text-[1.6rem] font-semibold hover:bg-white/90 transition-all hover:scale-105 cursor-pointer"
        >
          홈으로 돌아가기
        </button>
      </div>
    </Layout>
  );
}
