import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <header className="flex justify-center fixed top-0 w-full py-5 bg-white z-10">
        <nav>
          <ul
            role="list"
            className="flex items-center gap-5"
          >
            <li>
              <Link
                to="/players"
                className="text-gray-900"
              >
                선수 검색
              </Link>
            </li>
            <li>
              <Link
                to="/users"
                className="text-gray-900"
              >
                유저 검색
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
