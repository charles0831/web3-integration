import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Typography, Box, TextField, Button } from "@material-ui/core";
import toast from "react-hot-toast";
import { Web3Context } from "utils/Web3Provider";
import abiArray from "abis/GLDToken.json";
import { REACT_APP_CHAINID, REACT_APP_ASTRO_TOKEN_ADDRESS } from "utils/config";
require("dotenv").config();
var Tx = require("ethereumjs-tx");

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(8),
    display: "flex",
    justifyContent: "center",
  },
}));

const INPUT_VALUE = "You must input quantity";
const WRONG_NETWORK = "You should connect to the Ethereum Mainnet";
const SUCCSESS_CONNECTED = "Successfully connected to the Ethereum Mainnet";
const WAIT_METAMASK = "Please wait a moment.";

export default function Main() {
  const classes = useStyles();
  const {
    connectionStatus,
    notifyLabel,
    balance,
    address,
    walletInstalledStatus,
    loadWeb3,
    nftToken,
  } = useContext(Web3Context);
  const [totalSupply, setTotalSupply] = useState(0);
  const [totalToken, setTotalToken] = useState(0);
  const [toAddress, setToAddress] = useState(
    "0xA6fB689d3e90c7EbC60E9ff1f8B49c597afCA211"
  );
  const [toAmount, setToAmount] = useState(100);
  const [amount, setAmount] = useState(200);
  const [srcAddress, setSrcAddress] = useState(
    "0x88B5B5BAe83a66283C9203d189333b7F5b5d9881"
  );
  const [desAddress, setDesAddress] = useState(
    "0xA6fB689d3e90c7EbC60E9ff1f8B49c597afCA211"
  );

  const handleClickWallet = async () => {
    if (connectionStatus) {
      toast.success(SUCCSESS_CONNECTED);
    }
    await loadWeb3();
  };

  useEffect(() => {
    if (connectionStatus) {
      toast.success(notifyLabel);
    } else {
      if (notifyLabel !== "") {
        toast.error(notifyLabel);
      }
    }
  }, [notifyLabel]);

  useEffect(() => {
    if (!walletInstalledStatus)
      window.open(
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en",
        "_blank"
      );
  }, [walletInstalledStatus]);

  useEffect(() => {}, []);

  const handleGetToken = () => {
    nftToken?.methods
      .balanceOf(address)
      .call()
      .then((data) => {
        setTotalToken(window.web3.utils.fromWei(data));
      });
  };

  const handleGetTotalSupply = () => {
    nftToken?.methods
      .totalSupply()
      .call()
      .then((data) => {
        setTotalSupply(window.web3.utils.fromWei(data));
      });
  };

  const handleChangeToAddress = (event) => {
    setToAddress(event.target.value);
  };
  const handleChangeToAmount = (event) => {
    setToAmount(event.target.value);
  };
  const handleSendToken = async () => {
    if (totalToken < toAmount || toAddress === "") {
      toast.error("Token is not enough!!!");
      return;
    }
    nftToken?.methods
      .transfer(toAddress, window.web3.utils.toWei(toAmount.toString()))
      .send({ from: address })
      .then((data) => {
        if (data.transactionHash) {
          toast.success("Successfully send token!!!");
        }
      });
  };

  const handleSendTokenFromTo = () => {
    console.log("+++++++++++++++++", srcAddress, desAddress, amount);
    if (totalToken < toAmount || toAddress === "") {
      toast.error("Token is not enough!!!");
      return;
    }
    nftToken?.methods
      .approve(srcAddress, window.web3.utils.toWei(amount.toString()))
      .send({ from: address })
      .then((data) => {
        console.log("++++++++++++++", data);
      });
    nftToken?.methods
      .transferFrom(
        srcAddress,
        desAddress,
        window.web3.utils.toWei(amount.toString())
      )
      .send({ from: address })
      .then((data) => {
        console.log("#####################", data);
        if (data.transactionHash) {
          toast.success("Successfully send token!!!");
        }
      })
      .catch((error) => {
        console.error("onRejected function called: " + error.message);
      });
  };

  const handleChangeSrcAddress = (event) => {
    setSrcAddress(event.target.value);
  };
  const handleChangeDesAddress = (event) => {
    setDesAddress(event.target.value);
  };
  const handleChangeAmount = (event) => {
    setAmount(event.target.value);
  };
  return (
    <Container component="main" className={classes.root}>
      <Box>
        <Button variant="contained" onClick={handleClickWallet}>
          Connect Wallet
        </Button>
        <Box display="flex" alignItems="center" justifyContent="start" m={2}>
          <Typography variant="h6">Your Address : &nbsp; </Typography>
          <TextField
            variant="outlined"
            value={address}
            style={{ width: "450px" }}
          ></TextField>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="start" m={2}>
          <Typography variant="h6">Balnace(ETH) :&nbsp;</Typography>
          <TextField variant="outlined" value={balance}></TextField>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="start" m={2}>
          <Typography variant="h6">
            Total Token &nbsp; &nbsp;: &nbsp;
          </Typography>
          <TextField
            variant="outlined"
            value={totalToken}
            style={{ marginRight: "10px" }}
          ></TextField>
          <Button variant="contained" onClick={handleGetToken}>
            Get Token
          </Button>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="start" m={2}>
          <Typography variant="h6">Total Supply &nbsp; : &nbsp;</Typography>
          <TextField
            variant="outlined"
            value={totalSupply}
            style={{ marginRight: "10px" }}
          ></TextField>
          <Button variant="contained" onClick={handleGetTotalSupply}>
            Get TotalSupply
          </Button>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="start" m={2}>
          <Typography variant="h6">Send Token &nbsp; : &nbsp;</Typography>
          <TextField
            variant="outlined"
            value={toAddress}
            onChange={handleChangeToAddress}
            style={{ width: "450px", marginRight: "10px" }}
          ></TextField>
          <TextField
            variant="outlined"
            value={toAmount}
            onChange={handleChangeToAmount}
            style={{ width: "100px", marginRight: "10px" }}
          ></TextField>
          <Button variant="contained" onClick={handleSendToken}>
            Send Token
          </Button>
        </Box>
        <Box m={2} textAlign="left">
          <Typography variant="h6">TransferFrom &nbsp; : &nbsp;</Typography>
          <Box display="flex" alignItems="center" justifyContent="start" m={2}>
            <Typography variant="h6">From &nbsp; : &nbsp;</Typography>
            <TextField
              variant="outlined"
              value={srcAddress}
              onChange={handleChangeSrcAddress}
              style={{ width: "450px", marginRight: "10px" }}
            ></TextField>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="start" m={2}>
            <Typography variant="h6">
              To &nbsp; &nbsp;&nbsp; : &nbsp;
            </Typography>
            <TextField
              variant="outlined"
              value={desAddress}
              onChange={handleChangeDesAddress}
              style={{ width: "450px", marginRight: "10px" }}
            ></TextField>
            <TextField
              variant="outlined"
              value={amount}
              onChange={handleChangeAmount}
              style={{ width: "100px", marginRight: "10px" }}
            ></TextField>
            <Button variant="contained" onClick={handleSendTokenFromTo}>
              Send Token
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
