## Subgraph template for RAILGUN V2

### Run tests:

Ensure `./generated` exists by running

`yarn codegen`

And then

`yarn test`

### Single test (ex):

graph test src/railgun-smart-wallet-v2.1-new-shield -v 0.5.2 -r

[Uses matchstick options](https://thegraph.com/docs/en/developing/unit-testing-framework/)

- -c, --coverage Run the tests in coverage mode
- -d, --docker Run the tests in a docker container (Note: Please execute from the root folder of the subgraph)
- -f, --force Binary: Redownloads the binary. Docker: Redownloads the Dockerfile and rebuilds the docker image.
- -h, --help Show usage information
- -l, --logs Logs to the console information about the OS, CPU model and download url (debugging purposes)
- -r, --recompile Forces tests to be recompiled
- -v, --version <tag> Choose the version of the rust binary that you want to be downloaded/used

### Build

graph build --network mainnet

// Options: mainnet, goerli, sepolia, matic, mumbai, bsc, arbitrum-one, arbitrum-goerli

### Deploy

graph deploy --product hosted-service railgun-community/railgun-v2-ethereum

// Options: railgun-v2-ethereum, railgun-v2-goerli, railgun-v2-bsc, railgun-v2-polygon, railgun-v2-mumbai, railgun-v2-arbitrum, railgun-v2-arbitrum-goerli, railgun-v2-sepolia, railgun-v2-amoy

### Master build and deploy

./build-deploy-all

### Show network names

graph init --help
