import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Copy, CheckCircle } from "lucide-react";
import merchantQR from "@/assets/merchant-qr.png";
import { useState } from "react";
import { toast } from "sonner";

const QRCode = () => {
  const [copied, setCopied] = useState(false);
  const walletAddress = "0x742d35f8c9e...3a1f9b2c";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast.success("Address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NativeFi Payment QR Code',
          text: `Pay with crypto: ${walletAddress}`,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      toast.info("Sharing not supported on this device");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-4 md:space-y-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Payment QR Code</h1>
          <p className="text-sm text-muted-foreground">Show this QR code to customers for payment</p>
        </div>

        <Card className="shadow-elevated border-border">
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-xl">Scan to Pay</CardTitle>
            <CardDescription>Accepts USDC & USDT on all networks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 md:gap-6">
            {/* QR Code */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
              <img 
                src={merchantQR} 
                alt="Merchant Payment QR Code" 
                className="w-64 h-64 md:w-80 md:h-80"
              />
            </div>

            {/* Supported Networks */}
            <div className="w-full">
              <p className="text-xs text-muted-foreground mb-2 text-center">Supported Networks:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="bg-primary/5">BSC</Badge>
                <Badge variant="outline" className="bg-primary/5">Ethereum</Badge>
                <Badge variant="outline" className="bg-primary/5">Polygon</Badge>
                <Badge variant="outline" className="bg-primary/5">Arbitrum</Badge>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="w-full space-y-2">
              <p className="text-xs text-muted-foreground text-center">Wallet Address:</p>
              <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-lg">
                <code className="text-xs flex-1 text-center break-all">{walletAddress}</code>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={handleCopyAddress}
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-3 mt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            {/* Instructions */}
            <div className="w-full bg-muted/20 p-4 rounded-lg mt-2">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                <strong className="text-foreground">How it works:</strong><br/>
                Customer scans this QR code with their wallet app, selects the network and token (USDC/USDT), and sends the payment. You'll receive a notification when confirmed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCode;
