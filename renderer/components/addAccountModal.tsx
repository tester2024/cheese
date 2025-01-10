import { ChangeEvent, useState } from 'react';
import { FaUser, FaMicrosoft } from 'react-icons/fa';
import { AccountType } from '../../main/vars';

type AddAccountModalProps = {
  getError: (field: string) => string | null;
  onCancel: () => void;
  onSave: (newAccount: string, newAccountType: AccountType) => void;
};

export const AddAccountModal = ({
                                  getError,
                                  onCancel,
                                  onSave,
                                }: AddAccountModalProps) => {


  const [newAccount, setNewAccount] = useState('');
  const [newAccountType, setNewAccountType] = useState<AccountType>('offline');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewAccount(e.target.value);
  };

  return (
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
            <FaUser
              className={newAccountType === 'offline' ? 'h-6 w-6' : 'h-6 w-6 text-gray-500'}
            />
            <span
              className={newAccountType === 'offline' ? 'font-bold' : 'text-gray-500 font-bold'}
            >
              Offline Username
            </span>
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
              className={newAccountType === 'microsoft' ? 'h-6 w-6' : 'h-6 w-6 text-gray-500'}
            />
            <span
              className={newAccountType === 'microsoft' ? 'font-bold' : 'text-gray-500 font-bold'}
            >
              Microsoft Account
            </span>
          </label>
        </div>
        {newAccountType === 'offline' ? (
          <div>
            <input
              type="text"
              value={newAccount}
              onChange={handleChange}
              placeholder="Enter offline username"
              className="w-full p-3 border border-gray-600 rounded bg-gray-700 mb-4"
            />
            {getError('accountError') && <p className="text-red-500 text-sm my-2">{getError('accountError')}</p>}
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => {
                alert('Microsoft authentication is not implemented yet');
              }}
              className="w-full p-3 border border-gray-600 rounded bg-gray-700 mb-4"
            >
              Sign in with Microsoft
            </button>
            {getError('accountError') && <p className="text-red-500 text-sm my-2">{getError('accountError')}</p>}
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-red-500 py-2 px-4 rounded hover:bg-red-700 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(newAccount, newAccountType)}
            className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Save Account
          </button>
        </div>
      </div>
    </div>
  );
};