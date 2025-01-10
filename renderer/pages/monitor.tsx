import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import {
  FaCaretDown,
  FaCaretUp,
  FaCode,
  FaFile,
  FaFileWord,
  FaPlus,
  FaSave,
  FaSearch,
  FaTable,
  FaTrash,
  FaUpload
} from 'react-icons/fa';
import dynamic from 'next/dynamic';

import { HexViewer } from 'react-hexviewer-ts';
import { Navbar } from '../components/navBar';
import { Packet } from '../../main/vars';

const ReactJson = dynamic(() => import('@microlink/react-json-view'), { ssr: false });

type ViewType = 'HexView' | 'JsonView' | 'Strings' | 'Minecraft.Wiki';

const formatTime = (date: Date) => date.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3
});


const formatData = (packet_raw: Buffer) => `${(packet_raw.length / 1024 ** Math.floor(Math.log2(packet_raw.length) / Math.log2(1024))).toFixed(2)} ${['B', 'KB', 'MB', 'GB'][Math.floor(Math.log2(packet_raw.length) / Math.log2(1024))]}`;


export default function MonitorPage() {
  const [view, setView] = useState<ViewType>('JsonView');
  const [selected, setSelected] = useState(null);

  const [packets, setPackets] = useState<Packet[]>();

  const handleSelectPacket = useCallback((packet: Packet) => {
    if (selected && selected.packet_uuid === packet.packet_uuid) {
      setSelected(null);
    } else {
      setSelected(packet);
    }
  }, [setSelected, selected]);

  useEffect(() => {
    const ipc = window.ipc;
    ipc.on('packet', addPacket);
  });

  const addPacket = (packet: Packet) => {
    setPackets((prev) => {
      if (prev) {
        return [...prev, packet];
      } else {
        return [packet];
      }
    });
  };

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="mx-auto bg-gray-800 rounded-lg p-5 flex flex-col space-y-4">
          <Navbar current="monitor" />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <select
                  className="p-2 w-full rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="incoming">Incoming</option>
                  <option value="outgoing">Outgoing</option>
                </select>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="relative w-2/6">
                <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search packets..."
                  className="pl-8 p-2 w-full rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="bg-gray-700 h-full space-y-2 rounded p-3.5">
                <div className="flex bg-gray-800 mr-4 px-2 py-1 rounded justify-between">
                  <span>#</span>
                  <span>Name</span>
                  <span>Length</span>
                  <span>Time</span>
                </div>
                <ul
                  className="space-y-1 h-80 flex flex-col overflow-y-scroll scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-700">
                  {packets ? packets.reverse().map((packet) => (
                      <li
                        key={packet.packet_uuid + packet.packet_name}
                        onClick={(_) => handleSelectPacket(packet)}
                        className={
                          (selected && selected.packet_uuid == packet.packet_uuid ? 'bg-slate-500' : 'bg-slate-600') +
                          ' px-3.5 py-1 rounded flex justify-between items-center hover:cursor-pointer'
                        }
                      >
                          <span
                            className={(packet.packet_in ? 'text-green-300' : 'text-red-300') + ' text-sm flex'}>
                            {packet.packet_in ? <FaCaretDown className="mr-1 text-xl" /> :
                              <FaCaretUp className="mr-1 text-xl" />}
                            {`0x${packet.packet_id
                              .toString(16)
                              .toUpperCase()}`}
                          </span>
                        <span
                          className={(packet.packet_in ? 'text-green-300' : 'text-red-300') + ' text-sm'}>{packet.packet_name}</span>
                        <span className="text-gray-400 text-sm">{formatData(packet.packet_raw)}</span>
                        <span className="text-gray-400 text-sm">{formatTime(packet.packet_time)}</span>
                      </li>
                    )
                  ) : (
                    <li className="px-3.5 py-1 rounded flex items-center justify-center bg-gray-700">
                      <span className="text-gray-400 text-sm font-bold tracking-wide">
                        No packets
                      </span>
                    </li>
                  )}
                </ul>

              </div>
              <div className="bg-gray-700 flex flex-col rounded p-4">
                <div className="flex h-fit justify-center items-center shadow space-x-2 bg-gray-600 rounded">
                  <button
                    className={`py-2 px-2 w-1/3 rounded flex items-center ${view === 'HexView' ? 'bg-blueGray-800 text-white' : 'text-gray-400'}`}
                    onClick={() => setView('HexView')}
                  >
                    <FaFile className="w-5 h-5 mr-1" />
                    Hex
                  </button>
                  <button
                    className={`py-2 px-2 w-1/3 rounded flex items-center ${view === 'JsonView' ? 'bg-blueGray-800 text-white' : 'text-gray-400'}`}
                    onClick={() => setView('JsonView')}
                  >
                    <FaCode className="w-5 h-5 mr-1" />
                    Json
                  </button>
                  <button
                    className={`py-2 px-2 w-1/3 rounded flex items-center ${view === 'Strings' ? 'bg-blueGray-800 text-white' : 'text-gray-400'}`}
                    onClick={() => setView('Strings')}
                  >
                    <FaFileWord className="w-5 h-5 mr-1" />
                    Strings
                  </button>
                  <button
                    className={`py-2 px-2 w-1/3 rounded flex items-center ${view === 'Minecraft.Wiki' ? 'bg-blueGray-800 text-white' : 'text-gray-400'}`}
                    onClick={() => setView('Minecraft.Wiki')}
                  >
                    <FaTable className="w-5 h-5 mr-1" />
                    Minecraft.Wiki
                  </button>
                </div>

                {selected ? <div className="h-60 space-y-2">
                    {view === 'HexView' && (
                      <div className="mt-4 h-full">
                        <div
                          className="rounded bg-viewer-color h-full overflow-auto scrollbar scrollbar-thumb-slate-600">
                          <HexViewer>
                            {selected.packet_raw}
                          </HexViewer>
                        </div>
                      </div>
                    )}
                    {view === 'JsonView' && (
                      <div className="mt-4 h-full">
                        <div
                          className="rounded bg-viewer-color h-full overflow-auto scrollbar scrollbar-thumb-slate-600">
                          <ReactJson
                            src={selected.packet_body}
                            collapsed={true}
                            theme="harmonic"
                            iconStyle="triangle"
                            style={{
                              fontSize: '1rem',
                              padding: '0.7rem',
                              borderRadius: '0.2rem',
                              fontFamily: 'monospace'
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {view === 'Strings' && (
                      <div className="mt-4 h-full">
                        <div
                          className="rounded bg-viewer-color h-full overflow-auto scrollbar scrollbar-thumb-slate-600">
                        <pre className="text-white p-4 whitespace-pre-wrap">
                          {
                            selected.packet_raw
                              .toString()
                              .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
                              .match(/.{1,100}/g)
                              ?.join('\n')
                          }
                          <br />
                          {}
                        </pre>
                        </div>
                      </div>
                    )}
                    {view === 'Minecraft.Wiki' && (
                      <div className="mt-4 h-full">
                        <iframe
                          src={`https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Protocol`}
                          className="w-full h-full"
                        />
                      </div>
                    )}

                    <div className="flex mt-auto items-center space-x-2">
                      <button
                        className="py-2 px-4 w-1/3 rounded bg-rose-600 text-white hover:bg-rose-500 focus:outline-none flex items-center"
                        onClick={() => {
                          // @todo
                        }}
                      >
                        <FaTrash className="w-5 h-5 mr-2" />
                        Delete
                      </button>
                      <button
                        className="py-2 px-4 w-1/3 rounded bg-teal-600 text-white hover:bg-teal-500 focus:outline-none flex items-center"
                        onClick={() => {
                          // @todo
                        }}
                      >
                        <FaSave className="w-5 h-5 mr-2" />
                        Save
                      </button>
                      <button
                        className="py-2 px-4 w-1/3 rounded bg-sky-600 text-white hover:bg-teal-500 focus:outline-none flex items-center"
                        onClick={() => {
                          // @todo
                        }}
                      >
                        <FaUpload className="w-5 h-5 mr-2" />
                        Resend
                      </button>
                    </div>
                  </div> :
                  <div className="flex mt-4 bg-viewer-color flex-col justify-center text-center h-full space-y-4">
                    <h1 className="text-4xl font-bold text-red-500">
                      No packets selected.
                    </h1>
                    <h4 className="text-xl text-gray-400">
                      Please select a packet on the left to view its details.
                    </h4>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}