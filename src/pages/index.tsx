import fs from 'fs'
import { resolve, join } from 'path'
import { GetStaticProps } from 'next'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { flattenTxpool } from 'utils/txpool'
import { utils } from 'ethers'
import { useGasPrice } from 'hooks/useGasPrice'
import { BlockWatcher } from 'components/BlockWatcher'
import { GasPrice } from 'components/GasPrice'

interface Props {
  timestamp: number
  txData: string
}

const columns: GridColDef[] = [
  {
    field: 'hash',
    headerName: 'Txn Hash',
    width: 160,
  },
  {
    field: 'nonce',
    headerName: 'Nonce',
    width: 70,
  },
  {
    field: 'from',
    headerName: 'From',
    width: 160,
    renderCell: ({ value }) => renderAddress(value)
  },
  {
    field: 'to',
    headerName: 'To',
    width: 160,
    renderCell: ({ value }) => {
      if (!value) return <i>Contract creation</i>
      return renderAddress(value)
    }
  },
  {
    field: 'gas',
    headerName: 'Gas Limit',
    width: 120,
    valueFormatter: ({ value }) => value,
  },
  {
    field: 'gasPrice',
    headerName: 'Gas Price',
    width: 120,
    valueFormatter: ({ value }) => `${Math.round(Number(utils.formatUnits(value, 'gwei')))} Gwei`,
  },
  {
    field: 'value',
    headerName: 'Value',
    width: 120,
    align: 'right',
    valueFormatter: ({ value }) => `${Math.round(Number(utils.formatEther(value)) * 1e4) / 1e4} ETH`,
  },
]

export function renderAddress(value: string) {
  return <a href={`https://etherscan.io/address/${value}`} target='_blank' rel='noopener noreferrer'>
    {value}
  </a>
}

export default function Home(props: Props) {
  return <>
    <h2>Current Gas price</h2>
    <GasPrice />

    <h2>Latest Blocks</h2>
    <BlockWatcher />

    <h2>Pending Transactions</h2>
    <small>Latest update: {new Date(props.timestamp).toISOString()}</small>
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        getRowId={(row) => row.hash}
        rows={flattenTxpool(JSON.parse(props.txData))}
        columns={columns}
        pageSize={50}
      />
    </div>

  </>
}

export const getStaticProps: GetStaticProps<Props> = () => {
  console.log('getStaticProps')

  const dir = resolve(process.cwd(), 'src', 'data')
  const files = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((i) => i.isFile() && i.name.endsWith('.json'))
    .sort((a, b) => b.name.localeCompare(a.name))

  const latestFilename = files[0].name
  const timestamp = Number(latestFilename.replace('txpool_content_', '').replace('.json', ''))
  const filepath = resolve(process.cwd(), 'src', 'data', latestFilename)
  const content = fs.readFileSync(filepath, 'utf8')

  return {
    props: {
      txData: content,
      timestamp: timestamp
    },
    revalidate: 86400
  }
}
