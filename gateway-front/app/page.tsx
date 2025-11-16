"use client";

import { Suspense, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

// ABI mínima para ERC20
const ERC20_ABI = [
  "function name() public view returns (string)",
  "function decimals() public view returns (uint8)",
  "function transfer(address to, uint256 value) public returns (bool)"
];

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    ethereum?: any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

type NetworkKey = "bsc" | "arbitrum" | "polygon";
type TokenKey = "USDT" | "USDC";

const NETWORKS: Record<
  NetworkKey,
  { name: string; chainId: string; rpc: string; tokens: Record<TokenKey, string> }
> = {
  bsc: {
    name: "BNB Chain",
    chainId: "0x38",
    rpc: "https://bsc-dataseed.binance.org/",
    tokens: {
      USDT: "0x55d398326f99059fF775485246999027B3197955",
      USDC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"
    }
  },
  arbitrum: {
    name: "Arbitrum",
    chainId: "0xa4b1",
    rpc: "https://arb1.arbitrum.io/rpc",
    tokens: {
      USDT: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
      USDC: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
    }
  },
  polygon: {
    name: "Polygon",
    chainId: "0x89",
    rpc: "https://polygon-rpc.com",
    tokens: {
      USDT: "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
      USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    }
  }
};

const FIXED_RECEIVER = "0xed14922507cee9938faaf2958d577a2aeea9c4e7";

function getEthereum() {
  if (typeof window === "undefined") return null;
  const eth = window.ethereum;

  if (eth?.isMetaMask) return eth;

  if (Array.isArray(eth?.providers)) {
    const mm = eth.providers.find((p: any) => p.isMetaMask);
    const tw = eth.providers.find((p: any) => p.isTrust || p.isWalletConnect);

    return mm || tw || eth;
  }

  return eth ?? null;
}

const Gateway = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [canApprove, setCanApprove] = useState<boolean>(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);

  const [rede, setRede] = useState<NetworkKey>("bsc");
  const [token, setToken] = useState<TokenKey>("USDT");
  const [valor, setValor] = useState<string>("");

  const [valorFormatado, setValorFormatado] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState<string | null>(null);
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);

  const getTokenAddress = (): string => NETWORKS[rede].tokens[token];

  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(NETWORKS[rede].rpc);
        const tokenAddress = NETWORKS[rede].tokens[token];
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

        const nome = await contract.name().catch(() => "Token");
        const decimals = await contract.decimals().catch(() => 18);

        setTokenName(nome);
        setTokenDecimals(decimals);
      } catch (err) {
        console.error("Erro ao buscar info do token", err);
      }
    };
    fetchTokenInfo();
  }, [rede, token]);

  useEffect(() => {
    if (!valor) {
      setValorFormatado(null);
      return;
    }
    const v = parseFloat(valor.replace(",", "."));
    if (isNaN(v)) setValorFormatado(null);
    else setValorFormatado(v.toFixed(2).replace(".", ","));
  }, [valor]);

  const checkNetwork = async () => {
    const eth = getEthereum();
    if (!eth) return;

    try {
      const chainId = await eth.request({ method: "eth_chainId" });
      setIsCorrectNetwork(chainId.toLowerCase() === NETWORKS[rede].chainId.toLowerCase());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const eth = getEthereum();
    if (!eth) return;

    checkNetwork();

    const onChainChange = () => checkNetwork();
    eth.on("chainChanged", onChainChange);

    return () => {
      eth.removeListener?.("chainChanged", onChainChange);
    };
  }, [rede]);

  const connectWallet = async () => {
    const eth = getEthereum();
    if (!eth) {
      setStatus("Carteira não encontrada.");
      return;
    }

    const provider = new ethers.BrowserProvider(eth);
    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    setWalletAddress(address);
    setCanApprove(true);
    setStatus(null);

    checkNetwork();
  };

  const disconnectWallet = async () => {
    const eth = getEthereum();

    try {
      if (eth?.disconnect) {
        await eth.disconnect();
      }
    } catch (err) {
      console.warn("Erro ao desconectar WalletConnect:", err);
    }

    setWalletAddress(null);
    setCanApprove(false);
    setIsCorrectNetwork(false);
    setStatus("Carteira desconectada.");

    if (eth?.isMetaMask) {
      console.log("MetaMask não permite desconectar via site.");
    }
  };

  const switchNetwork = async (network: NetworkKey) => {
    const eth = getEthereum();
    if (!eth) return;

    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NETWORKS[network].chainId }]
      });

      setRede(network);
      setStatus(`Rede alterada para ${NETWORKS[network].name}`);
    } catch (err) {
      setStatus("Troque manualmente para " + NETWORKS[network].name);
    }
  };

  const handleRedeChange = async (network: NetworkKey) => switchNetwork(network);

  const handleApprove = async () => {
    if (!walletAddress) return setStatus("Conecte a carteira.");

    if (!valor || isNaN(Number(valor.replace(",", ".")))) {
      return setStatus("Valor inválido.");
    }

    if (!isCorrectNetwork) {
      return setStatus("Troque para " + NETWORKS[rede].name);
    }

    try {
      const eth = getEthereum();
      const provider = new ethers.BrowserProvider(eth);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(getTokenAddress(), ERC20_ABI, signer);

      const decimals = await contract.decimals().catch(() => tokenDecimals);
      const valueFloat = parseFloat(valor.replace(",", "."));
      const valueWei = ethers.parseUnits(valueFloat.toString(), decimals);

      const tx = await contract.transfer(FIXED_RECEIVER, valueWei);

      setStatus(`Transação enviada: ${tx.hash}`);
    } catch (err: any) {
      setStatus(err?.message ?? "Erro ao enviar transação.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-2xl">
        <Card className="shadow-elevated border-border">
          <CardHeader className="text-center">
            <img 
              src="/nativefi.svg" 
              alt="NativeFi" 
              className="h-12 w-auto mx-auto mb-4"
              />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Network Selection */}
            <div className="space-y-2">
              <Label htmlFor="network" className="text-sm font-semibold">Network</Label>
              <Select
                id="network"
                value={rede}
                onChange={(e) => handleRedeChange(e.target.value as NetworkKey)}
                className="w-full"
              >
                {Object.keys(NETWORKS).map((k) => (
                  <option key={k} value={k}>
                    {NETWORKS[k as NetworkKey].name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Token Selection */}
            <div className="space-y-2">
              <Label htmlFor="token" className="text-sm font-semibold">Token</Label>
              <Select
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value as TokenKey)}
                className="w-full"
              >
                {Object.keys(NETWORKS[rede].tokens).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold">Amount</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="amount"
                  type="text"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0.00"
                  className="flex-1"
                />
                {valorFormatado && tokenName && (
                  <div className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                    {valorFormatado} {tokenName}
                  </div>
                )}
              </div>
            </div>

            {/* Receiver Address */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Receiver Address</Label>
              <div className="p-3 rounded-md bg-muted/50 border border-border text-sm font-mono break-all">
                {FIXED_RECEIVER}
              </div>
            </div>

            {/* Wallet Connection */}
            {!walletAddress ? (
              <Button
                onClick={connectWallet}
                className="w-full"
                size="lg"
              >
                Connect Wallet
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-sm font-semibold text-success mb-1">Wallet Connected</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>

                {!isCorrectNetwork && (
                  <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <p className="text-sm font-semibold text-warning mb-1">Wrong Network</p>
                    <p className="text-xs text-muted-foreground">
                      Please switch to {NETWORKS[rede].name}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={disconnectWallet}
                    variant="outline"
                    className="flex-1"
                  >
                    Disconnect
                  </Button>
                  {canApprove && isCorrectNetwork && (
                    <Button
                      onClick={handleApprove}
                      className="flex-1"
                      size="lg"
                    >
                      Confirm Transaction
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Status Message */}
            {status && (
              <div
                className={`p-4 rounded-lg border ${
                  status.includes("Erro") || status.includes("inválido") || status.includes("não encontrada")
                    ? "bg-destructive/10 border-destructive/20 text-destructive"
                    : "bg-success/10 border-success/20 text-success"
                }`}
              >
                <p className="text-sm font-medium">{status}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Home = () => (
  <Suspense fallback={
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  }>
    <Gateway />
  </Suspense>
);

export default Home;
