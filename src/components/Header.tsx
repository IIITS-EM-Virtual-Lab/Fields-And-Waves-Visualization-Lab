import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Link to="/" className="">
      <div className="py-4 px-12 flex uppercase font-bold text-2xl items-center gap-4">
        <div>
          <img src="/assets/logo.png" height={48} width={50} />
        </div>
        <div>EM Virtual Laboratory</div>
      </div>
    </Link>
  );
};

export default Header;
