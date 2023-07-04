import React, {useEffect, useState} from 'react';
import {Button, Divider, Grid, Link, Typography} from "@mui/material";
import FlightIcon from '@mui/icons-material/Flight';
import {useForm,} from "react-hook-form";
import {Web3} from "web3";
import axios from "axios";

import {InputText} from "./InputText";
import abi from "./abi.json";
import {LoadingButton} from "@mui/lab";


function App() {
  const {control: createControl, handleSubmit: handleCreateSubmit} = useForm({
    defaultValues: {
      name: '',
      url: "https://google.com",
      max_cap: 10_000,
    }
  });

  const {control: investControl, handleSubmit: handleInvestmentSubmit, watch} = useForm({
    defaultValues: {
      project_id: '',
      investment: 10,
    }
  });

  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(false);

  const [totalInvestment, setTotalInvestment] = useState(-1);
  const [remainingInvestment, setRemainingInvestment] = useState(-1);

  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    getLastContract();

    if (web3) {
      getProjectLastId().then(() => {
        getLimits();
      });
    }
  }, [transactionHash])

  async function getLastContract() {
    const response = await axios.get('http://localhost:3000/api/contract/');
    console.log("response", response.data)
    setContract(response.data);
  }

  async function load() {
    console.log("loading metamask");

    if (typeof window.ethereum !== 'undefined') {
      setWeb3(new Web3(window.ethereum));

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setAccount(accounts[0]);

    } else {
      console.error('MetaMask is not installed');
    }
  }

  // const listProjects = async () => {
  //   const contractApi = new web3.eth.Contract(abi, contract?.address);
  //   const projects = await contractApi.methods.listProjects().call();
  //   console.log("projects", projects)
  // }

  const getProjectLastId = async () => {
    const contractApi = new web3.eth.Contract(abi, contract?.address);
    const lastId = await contractApi.methods.totalProjects().call();
    console.log("lastId", lastId);
    const id = web3.utils.toNumber(lastId) - 1;
    console.log("lastId fixed", id);
    setProjectId(id);
  }

  const getLimits = async () => {
    const id = web3.utils.numberToHex(projectId)
    console.log("projectid", id);
    const contractApi = new web3.eth.Contract(abi, contract?.address);
    const total = await contractApi.methods.getTotalInvestment(id, account).call();
    const remaining = await contractApi.methods.getRemainingInvestment(id, account).call();

    console.log("getLimits", total, remaining);

    setTotalInvestment(web3.utils.toNumber(total));
    setRemainingInvestment(web3.utils.toNumber(remaining));
  }

  const onProjectCreated = async (data) => {
    setLoading(true);

    try {
      const contractApi = new web3.eth.Contract(abi, contract?.address);
      const tx = await contractApi.methods.createProject(data.name, data.url, data.max_cap).send({
        from: account,
        gas: 3000000
      });

      setTransactionHash(tx.transactionHash)

      console.log("Transaction confirmed");

      const response = await axios.post('http://localhost:3000/api/project', {
        name: data.name,
        url: data.url,
        max_cap_per_investor: data.max_cap,
        transaction_hash: tx.transactionHash,
        contract_id: contract?.id,
      });

      console.log("response", response);

      await getProjectLastId();

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const onInvestmentMade = async (data) => {
    setLoading(true);

    const value = web3.utils.toWei(parseFloat(data.investment), 'gwei');
    try {
      const contractApi = new web3.eth.Contract(abi, contract?.address);
      const tx = await contractApi.methods.invest(web3.utils.numberToHex(projectId)).send({
        from: account,
        value: value,
        gas: 3000000
      });

      console.log("onInvestmentMade Transaction confirmed", tx.transactionHash);

      await getLimits();
      investControl.reset();

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} bgcolor={'#f0f0f2'} p={5}>
          <Typography ml={5} mt={5} variant={"h1"} fontSize={"2em"} fontWeight={"bolder"}>
            Presail
          </Typography>
          <Typography ml={5} variant={"h2"} fontSize={"1em"}>
            Fundraising, investor management & token vesting.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography m={5} variant={"h3"} fontSize={"1em"}>
            Use your metamask account to create a new project:
          </Typography>
        </Grid>
        {
          !contract ? (
            <Grid item xs={12} m={5}>
              <Typography variant={"body1"} color={"red"} fontWeight={"bolder"}>
                Please export the contract variable before running
              </Typography>
            </Grid>
          ) : (
            <>
              <Grid item xs={12} ml={5} mt={2}>
                {
                  account ? (
                    <>
                      <span> Connected Account: </span>
                      <Link target={"_blank"} href={`https://mumbai.polygonscan.com/address/${account}`}>
                        {account}
                      </Link>
                    </>
                  ) : (
                    <Button variant="outlined" color="primary" onClick={() => load()}>
                      <img alt={""} src={"https://metamask.io/images/metamask-logo.png"} width={30}
                           style={{padding: '5px'}}/> Connect Metamask
                    </Button>
                  )
                }
              </Grid>
              <Grid item xs={12} ml={5} mt={2}>
                {
                  contract ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <span> Contract Address: </span>
                        <Link target={"_blank"} href={`https://mumbai.polygonscan.com/address/${contract.address}`}>
                          {contract.address}
                        </Link>
                      </Grid>
                    </Grid>
                  ) : <></>
                }
              </Grid>
              <Divider/>
              <Grid item xs={12} m={5}>
                {
                  account ? (
                      <Grid container mt={5} spacing={5}>
                        {!transactionHash ? (
                          <Grid item xs={5}>
                            <Typography variant="h4">Project owner</Typography>
                            <form onSubmit={handleCreateSubmit(onProjectCreated)}>
                              <Grid item xs={12}>
                                <InputText control={createControl} name={"name"} label={"Project Name"}/>
                                <InputText control={createControl} name={"url"} label={"Project URL"}/>
                                <InputText control={createControl} name={"max_cap"} type={"number"} label={"Max cap"}/>
                              </Grid>
                              <Grid item xs={12}>
                                <LoadingButton
                                  startIcon={<FlightIcon/>}
                                  variant={"outlined"}
                                  type={"submit"}
                                  disabled={loading}
                                  loading={loading}
                                  loadingPosition="start">
                                  <small>Create Project</small>
                                </LoadingButton>
                              </Grid>
                            </form>
                          </Grid>
                        ) : (
                          <Grid item xs={5}>
                            <Typography variant="h4">Investor</Typography>
                            <form onSubmit={handleInvestmentSubmit(onInvestmentMade)}>
                              <p style={{padding: 5}}>Project ID {projectId}</p>
                              <InputText control={investControl} name={"investment"} label={"Investment Amount"}/>
                              <LoadingButton
                                startIcon={<FlightIcon/>}
                                variant={"outlined"}
                                type={"submit"}
                                disabled={loading}
                                loading={loading}
                                loadingPosition="start">
                                <small>Invest in Project</small>
                              </LoadingButton>
                            </form>
                            <Grid item xs={12} mt={2}>
                              <p> Total investment: {totalInvestment} </p>
                              <p> Remaining investment: {remainingInvestment} </p>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                    ) :
                    transactionHash ? (
                        <>
                          transactionHash:
                          <Link href={"https://mumbai.polygonscan.com/tx/" + transactionHash} target={"_blank"}>
                            {transactionHash}
                          </Link>
                        </>
                      ) :
                      <></>
                }
              </Grid>
            </>
          )
        }
      </Grid>
    </>
  );
}

export default App;
