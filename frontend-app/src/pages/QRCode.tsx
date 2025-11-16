import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import merchantQR from "@/assets/merchant-qr.png";
import { toast } from "sonner";

const QRCode = () => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NativeFi Payment QR Code',
          text: 'Pay with crypto using this QR code',
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
