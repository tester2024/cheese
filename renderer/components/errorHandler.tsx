import { useEffect, useState } from 'react';
import { FaCopy, FaExclamationTriangle } from 'react-icons/fa';

const ErrorMessage = () => {
  const ipc = window.ipc;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ipc) return
    const handleError = (message: string) => {
      setError(message);
      console.log(message);
    };

    ipc.on('errors', handleError);
  }, [ipc]);

  return error && (
    <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center transition-opacity animate-jump-in animate-delay-100 animate-once">
      <div className="max-w-md w-full p-6 mx-auto bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="flex w-full justify-center">
          <FaExclamationTriangle className="text-6xl text-yellow-500" aria-hidden="true" />
        </div>
        <h3 className="mt-3 text-3xl font-bold text-center text-gray-300">Error!</h3>
        <p className="mt-2 text-xl text-center text-gray-500">
          An error occurred, please open an issue on our
          <a href="https://github.com/tester2024/cheese/issues" target="_blank" className="text-blue-500 underline mx-1">Issues</a>
          for more information.
        </p>
        <textarea
          className="mt-4 text-base min-h-28 text-gray-400 w-full p-2 bg-gray-700 border focus:outline-none border-gray-600 rounded resize-none"
          readOnly
          placeholder="Error message"
          value={error || ''}
        />
        <div className="flex w-full items-center justify-center mt-4 space-x-2">
          <button
            type="button"
            className="text-gray-300 bg-red-700 hover:bg-red-600 border border-red-600  w-full rounded p-2 flex items-center justify-center"
            onClick={() => setError(null)}
          >
            <FaExclamationTriangle className="mr-2" aria-hidden="true" />
            Close
          </button>
          <button
            type="button"
            className="text-gray-300 bg-blue-700 hover:bg-blue-600 border border-blue-600 rounded p-2 flex items-center justify-center"
            onClick={() => navigator.clipboard.writeText(error || '')}
          >
            <FaCopy className="mr-2" aria-hidden="true" />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;