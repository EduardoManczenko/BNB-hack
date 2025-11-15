"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

const Gateway = () => {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [canApprove, setCanApprove] = useState<boolean>(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);

  const [rede, setRede] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [valor, setValor] = useState<string | null>(null);
  const [receiver, setReceiver] = useState<string | null>(null);

  const [valorFormatado, setValorFormatado] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState<string | null>(null);
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);

  // RPC pública da BNB Chain
  const BNB_CHAIN_RPC = "https://bsc-dataseed.binance.org/";

  // Captura os parâmetros da URL
  useEffect(() => {
    setRede(searchParams.get("rede"));
    setToken(searchParams.get("token"));
    setValor(searchParams.get("valor"));
    setReceiver(searchParams.get("receiver"));
  }, [searchParams]);

  // Formata o valor e pega o nome do token usando RPC da BNB Chain
  useEffect(() => {
    const formatarValor = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(BNB_CHAIN_RPC);

        // Se não tiver token definido na URL, usar USDC na BNB Chain como default
        const tokenAddress =
          token || "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";

        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

        // Pega o nome e os decimais do token
        let nome: string = "Token desconhecido";
        let decimals: number = 18;

        try {
          nome = await contract.name();
        } catch {
          console.warn("Não foi possível obter o nome do token.");
        }

        try {
          decimals = await contract.decimals();
        } catch {
          console.warn("Não foi possível obter os decimais do token.");
        }

        setTokenName(nome);
        setTokenDecimals(decimals);

        // Se não tiver valor definido na URL, usar 1 token
        const valorRaw = valor || ethers.parseUnits("1", decimals).toString();
        let formatted = ethers.formatUnits(valorRaw, decimals);
        formatted = parseFloat(formatted).toFixed(2).replace(".", ",");
        setValorFormatado(formatted);

        setToken(tokenAddress);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Erro ao formatar valor:", err.message);
        } else {
          console.error("Erro desconhecido ao formatar valor", err);
        }
        setValorFormatado(valor || "0");
      }
    };

    formatarValor();
  }, [token, valor]);

  // Verifica se o usuário está na BNB Chain
  const checkNetwork = async () => {
    if (!window.ethereum) return;
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    setIsCorrectNetwork(chainId === "0x38"); // 0x38 = 56, BNB Chain Mainnet
  };

  useEffect(() => {
    checkNetwork();
    if (window.ethereum) {
      window.ethereum.on("chainChanged", checkNetwork);
    }
    return () => {
      if (window.ethereum) window.ethereum.removeListener("chainChanged", checkNetwork);
    };
  }, []);

  // Conectar carteira
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
      if (error instanceof Error) console.error(error.message);
      else console.error("Erro desconhecido", error);
    }
  };

  // Aprovar / transferir usando MetaMask
  const handleApprove = async () => {
    if (!walletAddress || !token || !valor || !receiver) {
      setStatus("Erro: Verifique os parâmetros e conecte sua carteira.");
      return;
    }

    if (!isCorrectNetwork) {
      setStatus("Erro: Mude para a Binance Smart Chain antes de aprovar.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(token, ERC20_ABI, signer);

      // Converte o valor para BigInt usando os decimais do token
      const valorInteiro = ethers.parseUnits(valor, tokenDecimals);

      // Dispara a transação direto, MetaMask vai pedir para assinar
      const tx = await contract.transfer(receiver, valorInteiro);

      setStatus(`Transação enviada: ${tx.hash}`);
    } catch (error: any) {
      console.error(error);
      setStatus(error?.reason || error?.message || "Erro ao enviar a transação.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Parâmetros da URL</h1>

      <ul>
        <li><strong>Rede:</strong> {rede || "bsc"}</li>
        <li><strong>Token:</strong> {token || "Carregando..."}</li>
        <li><strong>Nome do Token:</strong> {tokenName || "Carregando..."}</li>
        <li><strong>Valor:</strong> {valorFormatado || "Carregando..."}</li>
        <li><strong>Receiver:</strong> {receiver || "Não informado"}</li>
      </ul>

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
          Por favor, mude sua rede para a Binance Smart Chain.
        </p>
      )}

      {walletAddress && canApprove && token && valor && receiver && (
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

// Envolvendo com Suspense
const Home = () => (
  <Suspense fallback={<div>Carregando...</div>}>
    <Gateway />
  </Suspense>
);

export default Home;
