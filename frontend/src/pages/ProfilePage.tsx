import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { FaUser } from "react-icons/fa";

const ProfilePage = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="pt-28 pb-10 px-4 min-h-screen bg-[#f0f8ff]">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-blue-300 p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaUser className="text-blue-800 text-3xl" />
          <h2 className="text-3xl font-bold text-blue-800">Profile Details</h2>
        </div>
        <div className="space-y-4 text-lg text-gray-800">
          <div className="flex gap-2">
            <span className="font-semibold text-gray-600 w-20">Name:</span>
            <span>{user?.name || "—"}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-gray-600 w-20">Email:</span>
            <span>{user?.email || "—"}</span>
          </div>
        </div>
        <div className="mt-8 text-right">
          <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-200">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
