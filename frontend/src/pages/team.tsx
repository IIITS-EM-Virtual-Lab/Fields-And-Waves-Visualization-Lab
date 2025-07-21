const Team = () => {
  return (
    <main className="pb-20">
      {/* Banner Section */}
      <div className="bg-[#5d86a0] py-28 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Meet Our Team</h1>
      </div>

      {/* Instructor Section */}
      <section className="max-w-6xl mx-auto px-6 mt-16">
        <h2 className="text-xl font-extrabold text-[#004c99] uppercase mb-4">Instructor</h2>
        <div className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-100 max-w-3xl">
          <p className="font-bold">Dr. K. Divyabramham, Ph.D.</p>
          <p>Associate Professor</p>
          <p>Department of Electronics and Communication Engineering</p>
          <p>Indian Institute of Information Technology, Sri City</p>
          <p>Chittoor, Andhra Pradesh 517646, INDIA</p>
        </div>
      </section>

      {/* Contributors Section */}
      <section className="max-w-6xl mx-auto px-6 mt-16">
        <h2 className="text-xl font-extrabold text-[#004c99] uppercase mb-4">Contributors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contributor 1 */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-6 text-gray-800">
            <p className="font-bold">Subrahmanyam Bitra</p>
            <p>B.Tech</p>
            <p>Dept. of Electronics and Communication Engineering</p>
            <p>IIIT Sri City</p>
            <p>Chittoor, Andhra Pradesh 517646, INDIA</p>
          </div>
          {/* Contributor 2 */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-6 text-gray-800">
            <p className="font-bold">Nitish Nasari</p>
            <p>B.Tech</p>
            <p>Dept. of Electronics and Communication Engineering</p>
            <p>IIIT Sri City</p>
            <p>Chittoor, Andhra Pradesh 517646, INDIA</p>
          </div>
          {/* Contributor 3 */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-6 text-gray-800">
            <p className="font-bold">Kothamasu Mohith Ram Sai Karthik Phalgun</p>
            <p>B.Tech</p>
            <p>Dept. of Computer Science and Engineering</p>
            <p>IIIT Sri City</p>
            <p>Chittoor, Andhra Pradesh 517646, INDIA</p>
          </div>
          {/* Contributor 4 */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-6 text-gray-800">
            <p className="font-bold">Sriman Reddy Bommireddy</p>
            <p>B.Tech</p>
            <p>Dept. of Computer Science and Engineering</p>
            <p>IIIT Sri City</p>
            <p>Chittoor, Andhra Pradesh 517646, INDIA</p>
          </div>
          {/* Contributor 5 */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-6 text-gray-800">
            <p className="font-bold">Eraveni Sai Likhith</p>
            <p>B.Tech</p>
            <p>Dept. of Electronics and Communication Engineering</p>
            <p>IIIT Sri City</p>
            <p>Chittoor, Andhra Pradesh 517646, INDIA</p>
          </div>
          {/* Contributor 6 */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-6 text-gray-800">
            <p className="font-bold">Abdul Khadar</p>
            <p>B.Tech</p>
            <p>Dept. of Electronics and Communication Engineering</p>
            <p>IIIT Sri City</p>
            <p>Chittoor, Andhra Pradesh 517646, INDIA</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Team;
