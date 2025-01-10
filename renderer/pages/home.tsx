import React, { useCallback, useState } from 'react';
import Head from 'next/head';
import {
  FaCalculator,
  FaCaretDown,
  FaExclamationTriangle,
  FaServer,
  FaSpinner,
  FaTrash,
  FaUser,
  FaUserSecret,
  FaWifi
} from 'react-icons/fa';
import dynamic from 'next/dynamic';

import * as crypto from 'crypto';
import { AddAccountModal } from '../components/addAccountModal';
import { router } from 'next/client';
import { Account, AccountType, ProxyStart } from '../../main/vars';


const generateOfflineUUID = (username: string): string => {
  const data = `OfflinePlayer:${username}`;
  const hash = crypto.createHash('md5').update(data).digest('hex').toLowerCase();
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20)}`;
};

const HOSTNAME_REGEX = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,6})$/;
const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

const isAddressValid = (hostAddress: string) => {
  return HOSTNAME_REGEX.test(hostAddress);
};

const isPortValid = (port: number) => {
  return !isNaN(port) && port >= 1 && port <= 65535;
};

const isUuidValid = (spoofUuid: string) => {
  return UUID_REGEX.test(spoofUuid);
};

const ErrorHandler = dynamic(() => import('../components/errorHandler'), { ssr: false });
const HomeScript = dynamic(() => import('../components/homeScript'), { ssr: false });

export default function HomePage() {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: generateOfflineUUID("MHProDev"),
      type: 'offline',
      username: 'MHProDev'
    }
  ]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(accounts[0]);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [errors, setErrors] = useState({
    versionError: null,
    ipError: null,
    portError: null,

    listenIpError: null,
    listenPortError: null,

    spoofIpError: null,
    spoofUuidError: null,

    accountError: null
  });


  const handleAddAccount = useCallback(
    (newAccount: string, newAccountType: AccountType) => {
      const username = newAccount.trim();
      if (!USERNAME_REGEX.test(username)) {
        setError('accountError', 'Username must be between 3 and 30 characters.');
        return;
      }

      if (accounts.some((account) => account.username === username)) {
        setError('accountError', `Account with username "${username}" already exists.`);
        return;
      }

      const newAccountObj: Account = {
        id: newAccountType === 'microsoft' ? crypto.randomUUID() : generateOfflineUUID(username),
        type: newAccountType,
        username
      };

      if (!selectedAccount) setSelectedAccount(newAccountObj);

      setAccounts((prev) => [...prev, newAccountObj]);
      setShowAddAccountModal(false);
      setError('accountError', null);
    },
    [accounts]
  );

  const handleRemoveAccount = useCallback(
    (accountId: string) => {
      setAccounts((prev) => prev.filter((account) => account.id !== accountId));
      if (selectedAccount?.id === accountId) setSelectedAccount(null);
    },
    [selectedAccount]
  );

  const handleSelectAccount = useCallback(
    (account: Account) => setSelectedAccount(account),
    [setSelectedAccount]
  );

  const handleStartListening = () => {
    setError('versionError', null);
    setError('ipError', null);
    setError('portError', null);
    setError('listenIpError', null);
    setError('listenPortError', null);
    setError('spoofIpError', null);
    setError('spoofUuidError', null);
    setError('accountError', null);

    if (!selectedAccount) {
      setError('account', 'Please select an account');
      return;
    }

    const version = (document.getElementById('version') as HTMLSelectElement).value;
    const hostAddress = (document.getElementById('ip') as HTMLInputElement).value;
    const hostPort = Number((document.getElementById('port') as HTMLInputElement).value);
    const listenAddress = (document.getElementById('listenAddress') as HTMLInputElement).value;
    const listenPort = Number((document.getElementById('listenPort') as HTMLInputElement).value);
    const spoofAddress = (document.getElementById('spoofIp') as HTMLInputElement).value;
    const spoofUuid = (document.getElementById('spoofUuid') as HTMLInputElement).value;

    if (!version) {
      setError('versionError', 'A version selection is required');
      return;
    }

    if (!isAddressValid(hostAddress)) {
      setError('ipError', 'Please enter a valid IP address');
      return;
    }

    if (!isPortValid(hostPort)) {
      setError('portError', 'Port number must be between 1 and 65535');
      return;
    }

    if (!isAddressValid(listenAddress)) {
      setError('listenIpError', 'Please enter a valid IP address');
      return;
    }

    if (!isPortValid(listenPort)) {
      setError('listenPortError', 'Port number must be between 1 and 65535');
      return;
    }

    if (spoofAddress && !isAddressValid(spoofAddress)) {
      setError('spoofIpError', 'Please enter a valid IP address');
      return;
    }

    if (spoofUuid && !isUuidValid(spoofUuid)) {
      setError('spoofUuidError', 'Please enter a valid UUID');
      return;
    }

    const proxyStartData: ProxyStart = {
      account: selectedAccount,
      selectedVersion: version,
      host: {
        address: hostAddress,
        port: hostPort
      },
      listen: {
        address: listenAddress,
        port: listenPort
      },
      spoof: {
        address: spoofAddress,
        uuid: spoofUuid
      }
    };

    if (window.ipc) window.ipc.send('start-proxy', proxyStartData);
  };

  const getError = (field: string) => {
    return errors[field];
  };


  const setError = (field: string, error: string | null) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error || undefined
    }));
  };

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 text-white">
        <div className="flex gap-8 w-full justify-center">
          <section className="bg-gray-800 rounded-lg shadow-lg h-fit p-8 w-full flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">Cheese Monitor</h1>
            <div className="grid h-full w-full gap-4">
              <div className="flex space-x-4 w-full">
                <InputField
                  id="ip"
                  label="IP Address"
                  error={getError('ipError')}
                  placeholder="play.trexmine.com"
                  defaultValue="play.trexmine.com"
                  type="text"
                />
                <InputField
                  id="port"
                  label="Port"
                  error={getError('portError')}
                  placeholder="25565"
                  type="number"
                  defaultValue="25565"
                />
              </div>

              <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaCalculator className="text-gray-400" />
              </span>
                <select
                  id="version"
                  className="appearance-none bg-gray-700 text-white rounded p-3 pl-10 w-full border border-gray-600 focus:outline-none focus:border-blue-500 transition"
                >

                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaCaretDown className="text-gray-400" />
              </span>

              </div>

              {getError('versionError') && (
                <p className="text-red-500 text-sm mt-1">{getError('versionError')}</p>
              )}

              <CollapsibleSection
                title="Listen Settings"
                icon={<FaServer className="text-gray-400" />}
              >
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Listen IP"
                    id="listenAddress"
                    placeholder="127.0.0.1"
                    defaultValue="127.0.0.1"
                    error={getError('listenIpError')}
                  />
                  <InputField
                    label="Listen Port"
                    id="listenPort"
                    type="number"
                    placeholder="25565"
                    defaultValue="25565"
                    error={getError('listenPortError')}
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                title="Spoof Settings"
                icon={<FaUserSecret className="text-gray-400" />}
              >
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Spoof IP"
                    id="spoofIp"
                    placeholder="192.168.1.1"
                    required
                    error={getError('spoofIpError')}
                  />
                  <InputField
                    label="Spoof UUID"
                    id="spoofUuid"
                    placeholder="00000000-0000-0000-0000-000000000000"
                    required
                    error={getError('spoofUuidError')}
                  />
                </div>
              </CollapsibleSection>

              <button
                type="button"
                className="mt-auto w-full h-12 py-3 bg-blue-500 rounded hover:bg-blue-700 transition flex items-center justify-center"
                onClick={handleStartListening}
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
                <AccountList
                  accounts={accounts}
                  selectedAccount={selectedAccount}
                  onSelect={handleSelectAccount}
                  onRemove={handleRemoveAccount}
                />
              </ul>
            ) : (
              <div className="bg-red-500 w-full rounded-lg p-4 mb-8 shadow-lg flex items-center justify-center">
                <FaExclamationTriangle className="mr-2 text-white" />
                <p className="text-white font-bold text-center">
                  {getError('account') ? getError('account') : 'No accounts available.'}
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
            <AddAccountModal
              onCancel={() => setShowAddAccountModal(false)}
              onSave={handleAddAccount}
              getError={getError}
            />
          )}

          <ErrorHandler />
          <HomeScript />
        </div>
      </main>
    </>
  );
}

const InputField = ({
                      id,
                      label,
                      error,
                      placeholder,
                      type = 'text',
                      defaultValue = null
                    }: any) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-200 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        id={id}
        className="w-full p-3  text-sm text-gray-200 transition duration-150 ease-in-out bg-gray-700 border border-gray-600 rounded-lg shadow-sm appearance-none focus:outline-none focus:border-blue-500 focus:ring-blue-500 focus:ring-1"
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);


const CollapsibleSection = ({ title, icon, children }: any) => (
  <details className="rounded bg-gray-700 p-4 transition duration-300">
    <summary className="cursor-pointer flex items-center space-x-2">
      {icon}
      <span className="text-lg">{title}</span>
    </summary>
    <div className="mt-4 animate-fade">
      {children}
    </div>
  </details>
);

const AccountList = ({
                       accounts, selectedAccount, onSelect, onRemove
                     }: any) => (
  <ul className="space-y-4">
    {accounts.map((account: Account) => (
      <li key={account.id}
          className={`flex hover:opacity-75 transition cursor-pointer items-center w-full rounded-lg p-4 ${selectedAccount?.id === account.id ? 'bg-blue-700' : 'bg-gray-700'}`}
          onClick={() => onSelect(account)}>
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
              const sibling = (e.target as HTMLElement).nextSibling as HTMLElement;
              if (sibling) sibling.style.display = 'none';
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const sibling = (e.target as HTMLElement).nextSibling as HTMLElement;
              if (sibling) sibling.style.display = 'block';
            }}
          />
          <div
            className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center rounded">
            <FaSpinner className="animate-spin text-white" />
          </div>
          <div
            className="absolute top-0 left-0 w-full h-full bg-red-500 bg-opacity-50  items-center justify-center rounded hidden">
            <FaExclamationTriangle className="text-white" />
          </div>
        </div>
        <span>{account.type === 'microsoft' ? `Microsoft Account (${account.username})` : account.username}</span>
        <button
          type="button"
          onClick={() => onRemove(account)}
          className="ml-auto bg-red-500 p-1 rounded hover:bg-red-700 transition flex items-center"
        >
          <FaTrash className="text-white" />
        </button>
      </li>
    ))}
  </ul>
);