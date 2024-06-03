import { useState } from 'react'
import reactLogo from './assets/react.svg'
import twaLogo from './assets/tapps.png'
import viteLogo from '/vite.svg'
import './App.css'

import WebApp from '@twa-dev/sdk'
import TonWeb from "tonweb/dist/tonweb"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://ton.org/dev" target="_blank">
          <img src={twaLogo} className="logo" alt="TWA logo" />
        </a>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>TWA + Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      {/*  */}
      <div className="card">
        <button onClick={() => test()}>
            Show Alert
        </button>
      </div>
    </>
  )
}

async function test() {
  const tonweb = new TonWeb();
  const publicKey = TonWeb.utils.hexToBytes('82A0B2543D06FEC0AAC952E9EC738BE56AB1B6027FC0C1AA817AE14B4D1ED2FB');
  const secretKey = TonWeb.utils.hexToBytes('F182111193F30D79D517F2339A1BA7C25FDF6C52142F0F2C1D960A1F1D65E1E4');
  
  console.log(tonweb)

  const wallet = tonweb.wallet.create({publicKey});

  const address = await wallet.getAddress();

  const nonBounceableAddress = address.toString(true, true, false);

  const seqno = await wallet.methods.seqno().call();

  await wallet.deploy(secretKey).send(); // deploy wallet to blockchain

  const fee = await wallet.methods.transfer({
      secretKey,
      toAddress: 'EQDjVXa_oltdBP64Nc__p397xLCvGm2IcZ1ba7anSW0NAkeP',
      amount: TonWeb.utils.toNano(0.01), // 0.01 TON
      seqno: seqno,
      payload: 'Hello',
      sendMode: 3,
  }).estimateFee();

  const Cell = TonWeb.boc.Cell;
  const cell = new Cell();
  cell.bits.writeUint(0, 32);
  cell.bits.writeAddress(address);
  cell.bits.writeGrams(1);
  console.log(cell.print()); // print cell data like Fift
  const bocBytes = cell.toBoc();

  const history = await tonweb.getTransactions(address);

  const balance = await tonweb.getBalance(address);

  tonweb.sendBoc(bocBytes);
}

export default App
