import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { Network, Alchemy } from "alchemy-sdk";
import "./App.css";

function App() {
  const [ownerNftCount, setOwnerNftCount] = useState(0);
  const [ownerNfts, setOwnerNfts] = useState([]);

  const [contractNftCount, setContractNftCount] = useState(0);
  const [contractNfts, setContractNfts] = useState([]);

  useEffect(() => {
    getOwnerNfts();
    getContractNfts();
  }, []);

  const settings = {
    apiKey: "p6sQP9MdSToeJx6n4JrUpGL5-rYMjU8C",
    network: Network.ETH_MAINNET,
  };

  const alchemy = new Alchemy(settings);

  async function getOwnerNfts() {
    const result = await alchemy.nft.getNftsForOwner("noun12.eth");

    while (result.pageKey) {
      const nextResult = await alchemy.nft.getNftsForOwner("noun12.eth", {
        pageKey: result.pageKey,
      });
      result.ownedNfts = result.ownedNfts.concat(nextResult.ownedNfts);
      result.pageKey = nextResult.pageKey;
    }

    setOwnerNftCount(result.totalCount);
    setOwnerNfts(result.ownedNfts);
    console.log(result);
  }

  async function getContractNfts() {
    const address = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";

    // Flag to omit metadata
    const omitMetadata = false;

    const result = await alchemy.nft.getNftsForContract(address, {
      omitMetadata: omitMetadata,
    });

    let i = 0;
    while (result.pageKey) {
      const nextResult = await alchemy.nft.getNftsForContract(address, {
        omitMetadata: omitMetadata,
        pageKey: result.pageKey,
      });
      result.nfts = result.nfts.concat(nextResult.nfts);
      result.pageKey = nextResult.pageKey;
      i++;
      if (i > 10) {
        break;
      }
    }

    setContractNftCount(result.totalCount);
    setContractNfts(result.nfts);
    console.log(result);
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => getOwnerNfts()}>Get Owner's NFTs</button>
        <p>Owner NFT count is {ownerNftCount}</p>
        <br />
        <button onClick={() => getContractNfts()}>Get Contract NFTs</button>
        <p>Contract NFT count is {contractNftCount}</p>
        <br />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
