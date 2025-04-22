import { Link } from "react-router-dom";

const AuthHeader = () => {

  return (
    <>
      <header className="bg-parchment text-ink-black py-4 shadow-md text-2xl font-bold font-cinzel text-center">
        <h1>
          <Link to='/home'>
            Sophos Map
          </Link>
        </h1>
      </header>
    </>
  );
};

export default AuthHeader;