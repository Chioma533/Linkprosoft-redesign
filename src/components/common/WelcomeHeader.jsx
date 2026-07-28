import React from 'react'
import { greeting } from '../../utils/greeting';
import { useAuthStore } from '../../store/authStore';

const WelcomeHeader = () => {
      const { user } = useAuthStore();

      const userName = user?.fullName || user?.full_name || "John Doe"; 

    const getGreeting = greeting()
  return (
    <div className="">
      <h2 className="text-2xl font-bold text-gray-900">
        {getGreeting} {userName}
      </h2>
      <p className="text-sm text-gray-400 mt-1">
        Manage, jobs, appointment, finance and schedules
      </p>
    </div>
  );
}

export default WelcomeHeader