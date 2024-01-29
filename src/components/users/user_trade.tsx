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
          Buy
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
          Sell
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between py-[20px] border-solid border-t-2 border-b-[1px] border-t-white border-b-white">
          <div className="w-[200px] text-center">
            <p>{tradeType === "buy" ? "구매" : "판매"} 일시</p>
          </div>
          <div className="w-[calc(100%-500px)] text-center">
            <p>{tradeType === "buy" ? "구매" : "판매"}선수</p>
          </div>
          <div className="w-[100px] text-center">
            <p>강화등급</p>
          </div>
          <div className="w-[200px] text-center">
            <p>{tradeType === "buy" ? "구매" : "판매"} 가치(BP)</p>
          </div>
        </div>

        <ul className="flex flex-col gap-[10px] py-[10px]">
          {trade && trade.length ? (
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
      </div>

      <Pagination
        total={tradeTotal}
        limit={tradeLimit}
        page={tradePage}
        setPage={setTradePage}
      />
    </>
  );
}
