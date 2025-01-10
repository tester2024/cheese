// from https://github.com/PrismarineJS/node-minecraft-protocol/blob/556b9ddb376e089327c3fbb4ecbcabd32c7fd117/src/transforms/framing.js

import { Transform } from 'stream';
//@ts-ignore
import { types } from 'protodef';

const [readVarInt, writeVarInt, sizeOfVarInt] = types.varint;

export const createSplitter = function () {
  return new Splitter()
}

export const createFramer = function () {
  return new Framer()
}

export class Framer extends Transform {
  _transform (chunk: { length: number; subarray: (arg0: number, arg1?: number) => Buffer<ArrayBuffer>; }, _enc: any, cb: () => any) {
    const varIntSize = sizeOfVarInt(chunk.length)
    const buffer = Buffer.alloc(varIntSize + chunk.length)
    writeVarInt(chunk.length, buffer, 0)
    chunk.subarray(0).copy(buffer, varIntSize)
    this.push(buffer)
    return cb()
  }
}

export class Splitter extends Transform {
  private buffer: Buffer;

  constructor() {
    super();
    this.buffer = Buffer.alloc(0);
  }

  _transform(chunk: Uint8Array, enc: any, cb: () => any) {
    this.buffer = Buffer.concat([this.buffer, chunk])
    let offset = 0

    while (this.buffer.length > offset) {
      const { value, size } = readVarInt(this.buffer, offset)
      if (this.buffer.length < offset + size + value) break
      this.push(this.buffer.subarray(offset + size, offset + size + value))
      offset += size + value
    }

    this.buffer = this.buffer.subarray(offset)
    return cb()
  }
}