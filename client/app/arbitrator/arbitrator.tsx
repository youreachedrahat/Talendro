"use client";

import { useEffect, useState } from "react";
import {
  ArbitrationContractValidator,
  ArbitratorTokenValidator,
  identificationPolicyid,
  ProjectInitiateValidator,
} from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import {
  Data,
  fromText,
  mintingPolicyToId,
  type UTxO,
  type Validator,
} from "@lucid-evolution/lucid";
import { PRIVATEKEY } from "@/config";
import { SystemWallet } from "@/config/systemWallet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import ArbitratorProjectItem from "@/components/projectCards/arbitratorProjectItem";
import { toast } from "sonner";
import { getAddress, getPolicyId, privateKeytoAddress } from "@/lib/utils";
import { ArbitratorMint } from "@/components/transactions/arbitratorMint";

export default function ArbitratorTokenMinter() {
  const [WalletConnection] = useWallet();
  const { lucid, address } = WalletConnection;
  const [projects, setProjects] = useState<UTxO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    if (!lucid || !address) {
      toast.error("ERROR", { description: "Wallet not Connected" });
      return;
    }
    try {
      const ARBITRATIONADDR = getAddress(ArbitrationContractValidator);
      const PROJECTINITPID = getPolicyId(ProjectInitiateValidator);
      const utxos = await lucid.utxosAt(ARBITRATIONADDR);
      const filteredUtxos = utxos.filter((utxo) =>
        Object.keys(utxo.assets).some((key) => key.includes(PROJECTINITPID))
      );
      setProjects(filteredUtxos);
    } catch (error: any) {
      toast.error("ERROR", { description: error.message });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  };

  useEffect(() => {
    if (!address) return;
    fetchProjects();
  }, [lucid, address]);

  async function handleClickMint() {
    setIsMinting(true);
    const result = await ArbitratorMint(WalletConnection);
    if (!result.data) {
      toast.error("ERROR", {
        description: result.error,
      });
      setIsMinting(false);

      return;
    }
    toast.success("SUCCESSFULL", {
      description: "Arbitrator Minted successfully",
    });
    setIsMinting(false);
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Arbitrator Token Minter</CardTitle>
          <CardDescription>
            Mint your Arbitrator token and manage projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleClickMint} disabled={isMinting}>
            {isMinting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              "Mint Arbitrator Token"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Arbitration Projects</CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchProjects}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : projects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <ArbitratorProjectItem project={project} key={i} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-[40vh]">
              <p className="text-muted-foreground ">
                No projects found for arbitration.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
