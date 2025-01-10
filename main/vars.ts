
export type AccountType = 'offline' | 'microsoft';

export interface Account {
  id: string;
  type: AccountType;
  username: string;
}

export type ProxyStart = {
  account: Account,
  selectedVersion: string,
  host: {
    address: string,
    port: number
  },
  listen: {
    address: string,
    port: number
  },
  spoof: {
    address: string,
    uuid: string
  }
}

export type Packet = {
  packet_name: string;
  packet_uuid: number;
  packet_in: boolean
  packet_time: Date;
  packet_id: number;
  packet_body: object;
  packet_raw: Buffer;
}
