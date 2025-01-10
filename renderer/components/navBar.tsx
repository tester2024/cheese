import React, { useEffect } from 'react';
import { FaCalculator, FaChargingStation, FaCircleStop, FaFilter, FaGear, FaGithub, FaServer } from 'react-icons/fa6';
import Link from 'next/link';
import { router } from 'next/client';

type NavbarItem = 'monitor' | 'logs' | 'network' | 'filters' | 'settings' | 'stop' | 'github';

interface NavbarProps {
  current?: NavbarItem;
}

export const Navbar = ({ current }: NavbarProps) => {
  const handleLogout = () => {
    const ipc = window.ipc;
    ipc.send("stop-proxy", {});
  };

  useEffect(() => {
    const ipc = window.ipc;
    ipc.on("stop-proxy",async () => {
      await router.push('/home');
    })
  }, []);

  return (
    <nav
      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full p-1.5 flex justify-between rounded shadow-lg">
      <ul className="flex justify-between space-x-2 w-1/2">
        <li>
          <Link legacyBehavior href="/monitor">
            <a
              className={`text-white hover:text-teal-200 transition-all duration-100 ease-in-out font-bold flex items-center px-2 py-1 rounded hover:bg-teal-500 ${current === 'monitor' ? `bg-teal-600` : ''}`}>
              <FaServer className="mr-1 text-teal-200" />
              Monitor
            </a>
          </Link>
        </li>
        <li>
          <Link legacyBehavior href="logs">
            <a
              className={`text-white hover:text-orange-200 transition-all duration-200 ease-in-out font-bold flex items-center px-2 py-1 rounded hover:bg-orange-500 ${current === 'logs' ? `bg-orange-600` : ''}`}>
              <FaCalculator className="mr-1 text-orange-200" />
              Logs
            </a>
          </Link>
        </li>
        <li>
          <Link legacyBehavior href="network">
            <a
              className={`text-white hover:text-cyan-200 transition-all duration-300 ease-in-out font-bold flex items-center px-2 py-1 rounded hover:bg-cyan-500 ${current === 'network' ? `bg-cyan-600` : ''}`}>
              <FaChargingStation className="mr-1 text-cyan-200" />
              Network
            </a>
          </Link>
        </li>
        <li>
          <Link legacyBehavior href="filters">
            <a
              className={`text-white hover:text-lime-200 transition-all duration-400 ease-in-out font-bold flex items-center px-2 py-1 rounded hover:bg-lime-500 ${current === 'filters' ? `bg-lime-600` : ''}`}>
              <FaFilter className="mr-1 text-lime-200" />
              Filters
            </a>
          </Link>
        </li>
        <li>
          <Link legacyBehavior href="settings">
            <a
              className={`text-white hover:text-gray-200 transition-all duration-600 ease-in-out font-bold flex items-center px-2 py-1 rounded hover:bg-gray-500 ${current === 'settings' ? `bg-gray-600` : ''}`}>
              <FaGear className="mr-1 text-gray-200" />
              Settings
            </a>
          </Link>
        </li>

      </ul>
      <ul className="flex space-x-2">
        <li>
            <a
              onClick={handleLogout}
              className={`text-white hover:text-red-200 hover:cursor-pointer transition-all duration-500 ease-in-out font-bold flex items-center px-2 py-1 rounded hover:bg-red-500 ${current === 'stop' ? `bg-red-600` : ''}`}>
              <FaCircleStop className="mr-1 text-red-200" />
              logout
            </a>
        </li>
        <li>
          <a href="https://github.com/tester2024/cheese"
             target="_blank"
             rel="noopener noreferrer"
             className={`text-white hover:text-green-200 transition-all duration-700 ease-in-out font-bold flex items-center px-2 py-1 rounded hover:bg-green-500 ${current === 'github' ? `bg-green-600` : ''}`}>
            <FaGithub className="mr-1 text-green-200" />
            GitHub
          </a>
        </li>
      </ul>
    </nav>
  );
};