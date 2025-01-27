"use client";
import { CreateProject } from "@/components/createProjectModal";
import { PROJECTINITADDR, PROJECTINITPID } from "@/config";
import { useWallet } from "@/context/walletContext";
import { UTxO } from "@lucid-evolution/lucid";
import React, { useEffect, useState } from "react";
import ProjectItem from "../../components/projectItem";

export default function Page() {
  const [walletContext, setWalletContext] = useWallet();
  const { lucid } = walletContext;
  const [projects, setProjects] = useState<UTxO[]>([]);
  useEffect(() => {
    async function fetchutxos() {
      if (!lucid) return;
      const utxos = await lucid.utxosAt(PROJECTINITADDR);
      const filteredUtxos = utxos.filter((utxo) => {
        return Object.keys(utxo.assets).some((key) =>
          key.includes(PROJECTINITPID)
        );
      });
      setProjects(filteredUtxos);
    }
    fetchutxos();
  }, [lucid]);
  return (
    <div>
      <CreateProject />
      {projects.map((project, i) => (
        <ProjectItem project={project} key={i} from="projects" />
      ))}
    </div>
  );
}
