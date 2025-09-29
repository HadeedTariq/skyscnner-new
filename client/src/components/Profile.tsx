import { useAuth } from "../context/AuthContext";
import { Card } from "./ui/card";
import { LogOut, Mail, User } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24"></div>

        <div className="px-6 pb-6">
          <div className="flex flex-col items-center -mt-12">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <User className="w-12 h-12 text-gray-600" />
            </div>

            <h1 className="mt-4 text-2xl font-semibold text-gray-800">
              {user?.username}
            </h1>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800 truncate">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-gray-800 capitalize">{user?.gender}</p>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
