import { create } from 'ipfs-http-client'

const ipfs = create({
  host: 'localhost',
  port: 5001,
  protocol: 'http'
})

export const fileAdd = ipfs.add
export const fileGet = async (addr) => {
  const resp = ipfs.cat(addr)

  let content = []

  for await (const chunk of resp) {
    content = [...content, ...chunk]
  }

  return content
}
