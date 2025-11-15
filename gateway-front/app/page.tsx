"use client";

import { Suspense, useEffect, useState } from "react";
import { ethers } from "ethers";

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

//
// 🔥 Função essencial para MetaMask/Trust Wallet Mobile
//
function getEthereum() {
  if (typeof window === "undefined") return null;
  const eth = window.ethereum;

  if (eth?.isMetaMask) return eth;

  // detecta múltiplos providers (MetaMask + Trust Wallet Mobile)
  if (Array.isArray(eth?.providers)) {
    const mm = eth.providers.find((p: any) => p.isMetaMask);
    const tw = eth.providers.find((p: any) => p.isTrust || p.isWalletConnect);

    return mm || tw || eth;
  }

  return eth ?? null;
}

//
// COMPONENTE PRINCIPAL
//
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

  //
  // BUSCAR INFO DO TOKEN
  //
  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(NETWORKS[rede].rpc);
        const contract = new ethers.Contract(getTokenAddress(), ERC20_ABI, provider);

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

  //
  // FORMATAÇÃO DO VALOR
  //
  useEffect(() => {
    if (!valor) {
      setValorFormatado(null);
      return;
    }
    const v = parseFloat(valor.replace(",", "."));
    if (isNaN(v)) setValorFormatado(null);
    else setValorFormatado(v.toFixed(2).replace(".", ","));
  }, [valor]);

  //
  // CHECAR REDE
  //
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

  //
  // CONECTAR
  //
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

  //
  // DESCONECTAR (MetaMask = local | Trust Wallet = real disconnect)
  //
  const disconnectWallet = async () => {
    const eth = getEthereum();

    try {
      if (eth?.disconnect) {
        await eth.disconnect(); // WalletConnect / Trust Wallet
      }
    } catch (err) {
      console.warn("Erro ao desconectar WalletConnect:", err);
    }

    // limpar estado local
    setWalletAddress(null);
    setCanApprove(false);
    setIsCorrectNetwork(false);
    setStatus("Carteira desconectada.");

    // aviso específico para MetaMask
    if (eth?.isMetaMask) {
      console.log("MetaMask não permite desconectar via site.");
    }
  };

  //
  // TROCAR DE REDE
  //
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

  //
  // ENVIAR TRANSFERÊNCIA
  //
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

  //
  // UI
  //
  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1>Pagamento</h1>

      <div>
        <label>Rede:</label>
        <select value={rede} onChange={(e) => handleRedeChange(e.target.value as NetworkKey)}>
          {Object.keys(NETWORKS).map((k) => (
            <option key={k} value={k}>
              {NETWORKS[k as NetworkKey].name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Token:</label>
        <select value={token} onChange={(e) => setToken(e.target.value as TokenKey)}>
          {Object.keys(NETWORKS[rede].tokens).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Valor:</label>
        <input
          type="text"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="0,00"
          style={{ marginLeft: 10, padding: 5, width: 120 }}
        />
        <span style={{ marginLeft: 10, fontWeight: "bold" }}>
          {valorFormatado && tokenName ? `${valorFormatado} ${tokenName}` : ""}
        </span>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Receiver:</strong> {FIXED_RECEIVER}
      </div>

      {!walletAddress ? (
        <button style={btnStyle} onClick={connectWallet}>
          Conectar Carteira
        </button>
      ) : (
        <>
          <p style={{ color: "green" }}>
            Conectado: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>

          <button style={btnStyleRed} onClick={disconnectWallet}>
            Desconectar Carteira
          </button>
        </>
      )}

      {walletAddress && canApprove && (
        <button style={btnStyle} onClick={handleApprove}>
          Confirmar Transação
        </button>
      )}

      {status && (
        <p style={{ marginTop: 20, color: status.includes("Erro") ? "red" : "green" }}>
          {status}
        </p>
      )}
    </div>
  );
};

const btnStyle = {
  marginTop: 20,
  padding: "10px 20px",
  backgroundColor: "#8247E5",
  color: "white",
  borderRadius: 5,
  cursor: "pointer",
  border: "none"
};

const btnStyleRed = {
  marginTop: 10,
  padding: "10px 20px",
  backgroundColor: "#D9534F",
  color: "white",
  borderRadius: 5,
  cursor: "pointer",
  border: "none"
};

const Home = () => (
  <Suspense fallback={<div>Carregando...</div>}>
    <Gateway />
  </Suspense>
);

export default Home;
