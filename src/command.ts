#!/usr/bin/env -S deno run

import { Command } from "https://deno.land/x/cliffy@v0.20.0/command/mod.ts";
import { ensureDir } from "https://deno.land/std@0.113.0/fs/mod.ts";
import {
  Destination,
  download,
} from "https://deno.land/x/download@v1.0.1/mod.ts";
import dir from "https://deno.land/x/dir@v1.2.0/mod.ts";

function checkApiKey() {
  const apiKey = Deno.env.get("ZD_CLI_CONNECT_API_KEY");
  if (!apiKey) {
    console.error("\nError: ZD_CLI_CONNECT_API_KEY environment variable is not set");
    console.error("Please set it in your shell configuration file (.bashrc, .zshrc, etc.):");
    console.error("export ZD_CLI_CONNECT_API_KEY=your_key_here\n");
    Deno.exit(1);
  }
  return apiKey;
}

async function fetchTicket(
  tick: number,
  // this is the option object
  connectApiKey: Record<string, unknown>,
): Promise<string[]> {
  const apiKey = checkApiKey();
  const authHeader = `Key ${apiKey}`;
  // todo: the API can accept multiple tickets in one query
  const ticket = await fetch(
    "https://connect.posit.it/edavidaja/zd/tickets?" +
      new URLSearchParams({ ticket_ids: tick.toString() }),
    {
      method: "GET",
      headers: { "Authorization": authHeader },
    },
  );

  const result = await ticket.json();
  return result;
}

async function downloadAttachments(tick: number, urls: string[], downloadPath?: string) {
  const downloadDir = downloadPath || dir("download");
  const destDir = `${downloadDir}/support/${tick}`;
  await ensureDir(destDir);
  urls.map(async (url) => {
    const urlParams = (new URL(url)).searchParams;
    const filename = urlParams.get("name")?.toString();
    const destination: Destination = {
      dir: destDir,
      file: filename,
    };

    const _fileObj = await download(url, destination);
  });
}

await new Command()
  .name("zd")
  .version("0.3.1")
  .description("zendesk helpers")
  .command(
    "download <ticketId:integer>",
    "download all attachments for a zendesk ticket",
  )
  .option("-d, --dir <path:string>", "specify download directory")
  .action((options, ticketId) => {
    fetchTicket(ticketId, options).then((urls) => {
      downloadAttachments(ticketId, urls, options.dir);
    });
  })
  .parse(Deno.args);