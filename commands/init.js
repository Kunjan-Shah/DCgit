import chalk from "chalk"
import "web3"

export default function init() {
    /******* TODO *********/

    // upload current repo to IPFS and get back the "storage_address". Store "storage_address" in .dcgit file
    // find HASH of current repo and save it in "integrity". Store "integrity" in .dcgit file
    // generate repo encyption key and save it in "key". Store "key" in .dcgit file
    // call initialize_repo(storage_address, integrity, key) -> returns repo uuid
    // store uuid in .dcgit file
    // Error handling

    ethereum.request({ method: "eth_requestAccounts" });

    const rpcURL = "https://rinkeby.infura.io/v3/49cc660be5284f6485525762167b6f74";
    const web3 = new Web3(rpcURL);
    let account;

     // here is our contract Address, which we grabbed from Remix
  let contractAddress = '0xA6ebEcc8d075Eb5301452358e0cBF7c8Ae69d857';
  
  
  // here is our function to make our smart contract call! window.ethereum.selectedAddress is our connected metamask account,
  // contract address is the one we deployed
  // value is 0 because we are not putting any arguments to this function call
  // gasPrice is 0 because a read function in solidity does not cost gas
  // gas has to have a minumum of 21064, when making read only function calls, but no gas is actually consumed
  // data is our function hash from our complication details in Remix
  // notice that our paramaters must be in Hexadecimal
  // finnaly, our result is changed into a number with the web3 utility method, otherwise our result would be a hexadecimal
  
  const handleClick = async () => {
      let account = window.ethereum.selectedAddress
          window.ethereum
            .request({
              method: 'eth_call',
              params: [
                {
                  from: account,
                  to: contractAddress,
                  value: '0x0',
                  gasPrice: '0x0',
                  gas: '0x30000',
                  data: '0x2e64cec1'
                },
              ],
            })
            .then((result) => {
              console.log (web3.utils.hexToNumber(result))
              }).catch((error) => {
                console.log(error)
              })}

    console.log(chalk.greenBright("DCgit repo initialized successfully"));
}

