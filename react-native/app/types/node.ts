// Used to be named RawNodeConfig in v1
export enum NodeType {
  RPC = 'rpc',
  INFURA = 'infura',
}

export interface NodeConfig {
  name: string
  type: NodeType
  service: string
  url: string
}

interface NodeBase {
  isCustom?: boolean
  name: string
  type: NodeType
  service: string
  url: string
  hidden?: boolean
  disableByDefault?: boolean
}

export interface StaticNodeConfig extends NodeBase {
  isCustom?: false
  type: NodeType.INFURA | NodeType.RPC
}

export type NodeOptions = StaticNodeConfig
