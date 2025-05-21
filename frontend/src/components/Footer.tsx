const Footer = () => {
  return (
    <div className="bg-black w-screen text-white p-12 h-[20rem] flex flex-col justify-between">
      <div>
        {" "}
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div>
              <img src="/assets/logo.png" height={48} width={50} />
            </div>
            <div className="text-2xl uppercase font-bold">EM laboratory</div>
          </div>
          <div className="flex font-2xl gap-4 items-center">
            <div>About</div>
            <div>Support</div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-300  md:flex-row justify-between text-xs text-slate-400 font-light py-2">
        <p className="mb-2 md:mb-0">
          This website utilizes educational simulations powered by{" "}
          <a
            href="https://www.geogebra.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0073e6", textDecoration: "none" }}
          >
            GeoGebra
          </a>
          . All simulations are used under the{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0073e6", textDecoration: "none" }}
          >
            Creative Commons Attribution-NonCommercial-ShareAlike License (CC
            BY-NC-SA 4.0)
          </a>
          .
        </p>
        <div>
          © 2024 Virtual Electromagnetics Laboratory. Indian Institute of
          Information Technology, Sri City
        </div>
      </div>{" "}
    </div>
  );
};

export default Footer;
