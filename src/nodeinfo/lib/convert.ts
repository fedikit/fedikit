import { NodeInfo } from './types.ts'

export const convert = (nodeinfo: NodeInfo<'2.1'>): NodeInfo<'2.0'> => ({
  ...nodeinfo,
  version: '2.0',
  software: {
    name: nodeinfo.software.name,
    version: nodeinfo.software.version,
  },
})
