const About = () => {
  return (
    <main className=" px-12">
      <div
        className="absolute top-0 left-0 h-[80vh] w-screen -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(187,223,255,1) 0%, rgba(187,223,255,1) 59%, rgba(255,255,255,1) 100%)",
        }}
      ></div>
      <div className="flex items-center h-[40vh]">
        <div className="w-1/2  text-4xl font-extrabold p-8">About Us</div>
        <div className="w-1/2">
          <img src="/assets/hero.png" />
        </div>
      </div>
      <div className="ml-10">
        <div className="text-3xl font-extrabold uppercase mt-20 mb-4">
          Instructor
        </div>
        <div>Dr. K. Divyabramham Ph. D.</div>
        <div>Assistant Professor,</div>
        <div>Dept. of Electronics and Communication Engineering,</div>
        <div>Indian Institute of Information Technology, Sri City,</div>
        <div>Chittoor, Andhra Pradesh 517646, INDIA.</div>
        <div className="text-3xl font-extrabold uppercase mt-20 mb-4">
          Contributors
        </div>
        <div>
          <div>Subrahmanyam Bitra</div>
          <div>B.Tech</div>
          <div>Dept. of Electronics and Communication Engineering,</div>
          <div>Indian Institute of Information Technology, Sri City,</div>
          <div>Chittoor, Andhra Pradesh 517646, INDIA.</div>
        </div>
        <div className="mt-10 mb-40">
          <div>Nitish Nasari</div>
          <div>B.Tech</div>
          <div>Dept. of Electronics and Communication Engineering,</div>
          <div>Indian Institute of Information Technology, Sri City,</div>
          <div>Chittoor, Andhra Pradesh 517646, INDIA.</div>
        </div>
      </div>
    </main>
  );
};

export default About;
