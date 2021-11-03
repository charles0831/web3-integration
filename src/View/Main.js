import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Typography, Box, TextField, Button } from "@material-ui/core";
import toast from "react-hot-toast";
import { Web3Context } from "utils/Web3Provider";

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
  const handleSendToken = () => {
    console.log(
      "**************",
      toAddress,
      window.web3.utils.toWei(toAmount.toString())
    );
    if (totalToken < toAmount || toAddress === "") {
      toast.error("Token is not enough!!!");
      return;
    }
    nftToken?.methods
      .transferFrom(
        address,
        toAddress,
        // window.web3.utils.toWei(toAmount.toString())
        toAmount
      )
      .call()
      .then((data) => {
        console.log("#####################", data);
      });
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
      </Box>
    </Container>
  );
}
