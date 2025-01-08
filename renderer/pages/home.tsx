import React, { useState } from 'react';
import Head from 'next/head';
import {
  FaCalculator,
  FaCaretDown, 
  FaExclamationTriangle,
  FaMicrosoft,
  FaSlidersH, FaSpinner,
  FaTrash,
  FaUser,
  FaUserSecret,
  FaWifi
} from 'react-icons/fa';

export type AccountType = 'offline' | 'microsoft';

export interface Account {
  id: string;
  type: AccountType;
  username: string;
}

export default function HomePage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [newAccount, setNewAccount] = useState('');
  const [newAccountType, setNewAccountType] = useState<AccountType>('offline');
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);


  const handleAddAccount = () => {
    const newAccountId = crypto.randomUUID();
    const newAccountObj: Account = {
      id: newAccountId,
      type: newAccountType,
      username: newAccount
    };
    setAccounts((prevAccounts) => [...prevAccounts, newAccountObj]);

    if (selectedAccount === null) {
      setSelectedAccount(newAccountObj);
    }

    setShowAddAccountModal(false);
    setNewAccount('');
    setNewAccountType('offline');
  };

  const handleRemoveAccount = (account: Account) => {
    setAccounts((prevAccounts) => prevAccounts.filter((a) => a.id !== account.id));
    setSelectedAccount(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 text-white">
      <Head>
        <title>Cheese Monitor</title>
      </Head>
      <main className="flex gap-8 w-full justify-center">
        <section className="bg-gray-800 rounded-lg shadow-lg h-fit p-8 w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6">Cheese Monitor</h1>
          <div className="grid h-full w-full gap-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="ip" className="block mb-2">IP Address</label>
                <input
                  type="text"
                  id="ip"
                  className="w-full p-3 border border-gray-600 rounded bg-gray-700"
                  placeholder="127.0.0.1"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="port" className="block mb-2">Port</label>
                <input
                  type="text"
                  id="port"
                  className="w-full p-3 border border-gray-600 rounded bg-gray-700"
                  placeholder="25565"
                />
              </div>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaCalculator className="text-gray-400" />
              </span>
              <select
                className="appearance-none bg-gray-700 text-white rounded p-3 pl-10 w-full border border-gray-600 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="1.19.2">1.19.2</option>
                <option value="1.18.2">1.18.2</option>
                <option value="1.17.1">1.17.1</option>
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaCaretDown className="text-gray-400" />
              </span>
            </div>

            <details>
              <summary className="cursor-pointer select-none h-14 bg-gray-700 rounded p-2 flex items-center">
                <FaSlidersH className="mr-2" /> Listen Settings
              </summary>
              <div className="bg-gray-700 p-4 rounded-b">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="listenAddress" className="block mb-2">Listen IP</label>
                      <input
                        type="text"
                        id="listenAddress"
                        className="w-full p-3 border border-gray-600 rounded bg-gray-700"
                        placeholder="8.8.8.8"
                        defaultValue="8.8.8.8"
                      />
                    </div>
                    <div>
                      <label htmlFor="listenPort" className="block mb-2">Listen Port</label>
                      <input
                        type="text"
                        id="listenPort"
                        className="w-full p-3 border border-gray-600 rounded bg-gray-700"
                        placeholder="25565"
                        defaultValue="25565"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </details>

            <details>
              <summary className="cursor-pointer select-none h-14 bg-gray-700 rounded p-2 flex items-center">
                <FaUserSecret className="mr-2 text-gray-400" /> Spoof Settings
              </summary>
              <div className="bg-gray-700 p-4 rounded-b">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="spoofIp" className="block mb-2">Spoof IP</label>
                      <input
                        type="text"
                        id="spoofIp"
                        className="w-full p-3 border border-gray-600 rounded bg-gray-700"
                        placeholder="192.168.1.1"
                      />
                    </div>
                    <div>
                      <label htmlFor="spoofUuid" className="block mb-2">Spoof UUID</label>
                      <input
                        type="text"
                        id="spoofUuid"
                        className="w-full p-3 border border-gray-600 rounded bg-gray-700"
                        placeholder="00000000-0000-0000-0000-000000000000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </details>

            <button
              type="button"
              className="mt-auto w-full h-12 py-3 bg-blue-500 rounded hover:bg-blue-700 transition flex items-center justify-center"
            >
              <FaWifi className="mr-2" />
              Start listening
            </button>
          </div>
        </section>
        <section className="bg-gray-800 rounded-lg shadow-lg p-8 h-fit w-1/2 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Accounts</h1>
          {accounts.length > 0 ? (
            <ul className="space-y-4 mb-4 w-full">
              {accounts.map((account) => (
                <li key={account.id} className={`flex hover:opacity-75 transition cursor-pointer items-center w-full rounded-lg p-4 ${selectedAccount?.id === account.id ? 'bg-blue-700' : 'bg-gray-700'}`} onClick={() => setSelectedAccount(account)}>
                  <div className="relative w-10 h-10 mr-4">
                    <img
                      src={`https://mc-heads.net/avatar/${account.type === 'microsoft' ? account.id : account.username}/128`}
                      alt="Minecraft Head"
                      className="absolute top-0 left-0 w-full h-full rounded"
                      loading="lazy"
                      decoding="async"
                      style={{ opacity: 0 }}
                      onLoad={(e) => {
                        (e.target as HTMLImageElement).style.opacity = '1';
                        //@ts-ignore
                        const sibling = e.target.nextSibling as HTMLElement;
                        if (sibling) sibling.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center rounded">
                      <FaSpinner className="animate-spin text-white" />
                    </div>
                  </div>
                  <span>{account.type === 'microsoft' ? `Microsoft Account (${account.username})` : account.username}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAccount(account)}
                    className="ml-auto bg-red-500 p-1 rounded hover:bg-red-700 transition flex items-center"
                  >
                    <FaTrash className="text-white" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-red-500 w-full rounded-lg p-4 mb-8 shadow-lg flex items-center justify-center">
              <FaExclamationTriangle className="mr-2 text-white" />
              <p className="text-white font-bold text-center">
                No accounts available.
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowAddAccountModal(!showAddAccountModal)}
            className="bg-green-500 py-2 px-4 rounded hover:bg-green-700 mt-auto transition flex items-center w-full"
          >
            <FaUser className="mr-2" /> Add New Account
          </button>
        </section>
        {showAddAccountModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold mb-4">Add New Account</h2>
              <div className="flex flex-row space-x-4 mb-4">
                <label className="flex items-center space-x-2 bg-gray-700 rounded p-2">
                  <input
                    type="radio"
                    name="account-type"
                    id="offline-account"
                    className="hidden"
                    checked={newAccountType === 'offline'}
                    onChange={() => setNewAccountType('offline')}
                  />
                  <FaUser className={newAccountType === 'offline' ? 'h-6 w-6' : 'h-6 w-6 text-gray-500'} />
                  <span className={newAccountType === 'offline' ? 'font-bold' : 'text-gray-500 font-bold'}>Offline Username</span>
                </label>
                <label className="flex items-center space-x-2 bg-gray-700 rounded p-2">
                  <input
                    type="radio"
                    name="account-type"
                    id="microsoft-account"
                    className="hidden"
                    checked={newAccountType === 'microsoft'}
                    onChange={() => setNewAccountType('microsoft')}
                  />
                  <FaMicrosoft
                    className={newAccountType === 'microsoft' ? 'h-6 w-6' : 'h-6 w-6 text-gray-500'} />
                  <span className={newAccountType === 'microsoft' ? 'font-bold' : 'text-gray-500 font-bold'}>Microsoft Account</span>
                </label>
              </div>
              {newAccountType === 'offline' ? (
                <input
                  type="text"
                  value={newAccount}
                  onChange={(e) => setNewAccount(e.target.value)}
                  placeholder="Enter offline username"
                  className="w-full p-3 border border-gray-600 rounded bg-gray-700 mb-4"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                  }}
                  className="w-full p-3 border border-gray-600 rounded bg-gray-700 mb-4"
                >
                  Sign in with Microsoft
                </button>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="bg-red-500 py-2 px-4 rounded hover:bg-red-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddAccount}
                  className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Save Account
                </button>
              </div>
            </div>
          </div>
        )}


      </main>
    </div>
  );
}