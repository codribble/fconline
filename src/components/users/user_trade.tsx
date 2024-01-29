import { useEffect, useState } from "react";
import { IUserInfo } from "../../routes/users";
import Trade from "../trade";
import Pagination from "./../pagination";

export interface ITrade {
  tradeDate: string; // 거래 일자 (UTC0) (구매일 경우, 구매 등록 시점 / 판매일 경우, 판매 완료 시점)
  saleSn: string; // 거래 고유 식별자
  spid: number; // 선수 고유 식별자 (/metadata/spid API 참고)
  grade: number; // 선수 강화 등급
  value: number; // 거래 선수 가치(BP)
}

export default function UserTrade({ ouid }: IUserInfo) {
  const [isLoading, setIsLoading] = useState(true);
  const [trade, setTrade] = useState<ITrade[]>([]);
  const [tradeType, setTradeType] = useState("buy");
  const [tradeTotal, setTradeTotal] = useState(1);
  const [tradePage, setTradePage] = useState(1);
  const tradeLimit = 10;
  const tradeOffset = (tradePage - 1) * tradeLimit;

  useEffect(() => {
    if (ouid) {
      const headers = {
        "x-nxopen-api-key": import.meta.env.VITE_FCONLINE_API_KEY,
      };

      fetch(
        `https://open.api.nexon.com/fconline/v1/user/trade?tradetype=${tradeType}`,
        { headers }
      )
        .then((res) => res.json())
        .then((data) => {
          setTrade(data);
          setTradeTotal(data.length);
          setIsLoading(false);
        });
    }
  }, [tradeOffset, ouid, tradeType]);

  return (
    <>
      <div
        id="tradeType"
        role="tablist"
        className="flex items-center gap-2 mb-5"
      >
        <button
          className={`min-w-[50px] p-2 rounded${
            tradeType === "buy"
              ? " bg-indigo-600 text-white font-bold"
              : " bg-gray-600"
          }`}
          onClick={() => {
            setTradeType("buy");
            setTradePage(1);
          }}
        >
          구매
        </button>
        <button
          className={`min-w-[50px] p-2 rounded${
            tradeType === "sell"
              ? " bg-indigo-600 text-white font-bold"
              : " bg-gray-600"
          }`}
          onClick={() => {
            setTradeType("sell");
            setTradePage(1);
          }}
        >
          판매
        </button>
      </div>

      <ul className="flex flex-col gap-[10px] py-[10px]">
        {isLoading ? (
          <li className="w-full py-[30px] text-center">거래 내역 조회중...</li>
        ) : trade && trade.length ? (
          trade.slice(tradeOffset, tradeOffset + tradeLimit).map((data) => (
            <Trade
              key={data.saleSn}
              {...data}
            />
          ))
        ) : (
          <li className="py-[30px] text-center">
            <p>{tradeType === "buy" ? "구입" : "판매"} 내역이 없습니다.</p>
          </li>
        )}
      </ul>

      <Pagination
        total={tradeTotal}
        limit={tradeLimit}
        page={tradePage}
        setPage={setTradePage}
      />
    </>
  );
}
