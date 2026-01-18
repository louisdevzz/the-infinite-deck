import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Button, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { Greeting } from "./Greeting";
import { CreateGreeting } from "./CreateGreeting";

function App() {
  const currentAccount = useCurrentAccount();
  const [greetingId, setGreeting] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
    <>
      <div>hello</div>
      <img
        className="w-[40px] h-[50px]"
        src="https://aggregator.walrus-testnet.walrus.space/v1/blobs/CIvukFxZQuHy67PR4PzxWhuw0Bhga3gIHJbctRdLG1U"
      />
    </>
  );
}

export default App;
